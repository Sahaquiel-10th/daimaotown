const DEFAULT_TOWN_API_URL = "https://api.daimao.aiarrival.cn/partner/v1/business";
const SNAPSHOT_TTL_SECONDS = 60;
let cachedSnapshot = null;
let cachedSnapshotExpiresAt = 0;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/api/town/bootstrap") {
      return townBootstrap(env);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== "GET") return response;

    const accept = request.headers.get("accept") || "";
    if (!accept.includes("text/html")) return response;

    url.pathname = "/index.html";
    url.search = "";
    return env.ASSETS.fetch(new Request(url, request));
  },
};

async function townBootstrap(env) {
  if (!env.DASHBOARD_PUBLIC_TOKEN) {
    return jsonResponse({ success: false, code: "TOWN_DATA_NOT_CONFIGURED", message: "真实数据连接尚未配置" }, 503);
  }

  if (cachedSnapshot && Date.now() < cachedSnapshotExpiresAt) {
    return jsonResponse(cachedSnapshot, 200, {
      "cache-control": `private, max-age=${SNAPSHOT_TTL_SECONDS}`,
      "x-daimao-data-source": "live",
    });
  }

  try {
    const pages = [];
    const seen = new Set();
    let afterUserId = 0;
    for (let index = 0; index < 1000; index += 1) {
      if (seen.has(afterUserId)) throw new Error("居民分页游标重复");
      seen.add(afterUserId);
      const page = await fetchTownPage(env, afterUserId);
      pages.push(page);
      if (!page.pagination?.hasMoreResidents) break;
      const next = Number(page.pagination?.nextAfterUserId);
      if (!Number.isSafeInteger(next) || next <= afterUserId) throw new Error("居民分页游标无效");
      afterUserId = next;
    }

    const payload = publicBootstrap(mergePages(pages));
    cachedSnapshot = payload;
    cachedSnapshotExpiresAt = Date.now() + SNAPSHOT_TTL_SECONDS * 1000;
    return jsonResponse(payload, 200, {
      "cache-control": `private, max-age=${SNAPSHOT_TTL_SECONDS}`,
      "x-daimao-data-source": "live",
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      code: "TOWN_DATA_UNAVAILABLE",
      message: "数据中心暂时不可用，请稍后重试",
    }, 502);
  }
}

async function fetchTownPage(env, afterUserId) {
  const response = await fetch(env.TOWN_DATA_API_URL || DEFAULT_TOWN_API_URL, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${env.DASHBOARD_PUBLIC_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      action: "publicTownRuntimeContext",
      timestamp: Date.now(),
      nonce: crypto.randomUUID(),
      data: { projectLimit: 300, residentLimit: 500, afterUserId },
    }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) throw new Error(payload?.message || `数据中心 HTTP ${response.status}`);
  return payload;
}

function mergePages(pages) {
  if (!pages.length) throw new Error("数据中心没有返回快照");
  const snapshot = structuredClone(pages[0]);
  const residents = new Map();
  pages.forEach((page) => (page.town?.residents || []).forEach((resident) => {
    const id = Number(resident?.id);
    if (id && !residents.has(id)) residents.set(id, resident);
  }));
  snapshot.town = snapshot.town || {};
  snapshot.town.residents = [...residents.values()];
  return snapshot;
}

function publicBootstrap(snapshot) {
  const town = snapshot.town || {};
  return {
    success: true,
    version: Number(snapshot.version || 1),
    stats: snapshot.stats || {},
    town: {
      projects: (town.projects || []).map(publicProject),
      residents: (town.residents || []).map(publicResident),
      communities: (town.communities || []).map(publicCommunity),
      events: (town.events || []).map(publicEvent),
      skillBounties: (town.skillBounties || []).map(publicSkill),
    },
    generatedAt: snapshot.generatedAt || new Date().toISOString(),
    source: "live",
    cacheTtlSeconds: SNAPSHOT_TTL_SECONDS,
  };
}

function publicProject(project) {
  return {
    id: number(project.id),
    name: text(project.name, 100) || `项目 #${project.id}`,
    description: text(project.description, 240),
    status: project.status === "completed" ? "completed" : "active",
    stage: text(project.stage, 40),
    goal: text(project.goal, 240),
    tags: textList(project.tags, 8, 40),
    participantCount: number(project.participantCount),
    watcherCount: number(project.watcherCount),
    communityId: number(project.communityId),
    communityName: text(project.communityName, 80),
    houseType: text(project.houseType, 40) || "workshop",
  };
}

function publicResident(resident) {
  return {
    id: number(resident.id),
    displayName: text(resident.displayName, 80) || `小镇居民 #${resident.id}`,
    experiencePoints: number(resident.experiencePoints),
    communities: (resident.communities || []).slice(0, 20).map(publicCommunity),
    participantProjectIds: numberList(resident.participantProjectIds),
    watchingProjectIds: numberList(resident.watchingProjectIds),
    home: {
      zone: resident.home?.zone === "project" ? "project" : "plaza",
      projectId: number(resident.home?.projectId) || null,
      relation: ["participant", "watcher"].includes(resident.home?.relation) ? resident.home.relation : null,
    },
  };
}

function publicSkill(skill) {
  const title = text(skill.title || skill.skill_name, 160) || `技能 #${skill.id}`;
  const tags = textList(skill.tags || skill.specialties, 8, 40);
  const scopes = textList(skill.serviceScopes || skill.service_scopes, 8, 120);
  const categoryText = `${title} ${tags.join(" ")} ${scopes.join(" ")}`.toLowerCase();
  const category = ["设计", "视觉", "剪辑", "视频", "文案", "摄影", "创意"].some((word) => categoryText.includes(word))
    ? "creative"
    : ["开发", "程序", "ai", "产品", "技术", "自动化", "数据"].some((word) => categoryText.includes(word))
      ? "tech"
      : "operations";
  const availability = text(skill.availabilityStatus || skill.availability_status, 30);
  const heat = number(skill.applicants ?? skill.catCount ?? skill.cat_count);
  return {
    id: number(skill.id) || text(skill.id, 80),
    title,
    category,
    ownerName: text(skill.ownerName || skill.display_name, 80) || "技能冒险家",
    ownerRole: text(skill.ownerRole, 100) || "技能冒险家",
    reward: text(skill.reward, 80) || `🐱 × ${heat}`,
    applicants: heat,
    deadline: text(skill.deadline, 80) || ({ idle: "当前空闲", available: "可以接单", busy: "档期较满", resting: "暂时休息" })[availability] || "档期可询",
    tags,
    serviceScopes: scopes,
    description: text(skill.description || skill.short_intro, 500) || scopes.join("；"),
    kind: skill.kind === "bounty" ? "bounty" : "offer",
  };
}

function publicCommunity(community) {
  return { id: number(community?.id) || null, name: text(community?.name, 80) };
}

function publicEvent(event) {
  return { id: number(event?.id) || null, title: text(event?.title, 120), date: text(event?.date, 40) };
}

function text(value, max) { return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max); }
function number(value) { const result = Number(value); return Number.isFinite(result) ? result : 0; }
function numberList(value) { return Array.isArray(value) ? [...new Set(value.map(number).filter(Number.isSafeInteger))] : []; }
function textList(value, limit, max) { return Array.isArray(value) ? value.slice(0, limit).map((item) => text(item, max)).filter(Boolean) : []; }
function jsonResponse(payload, status, headers = {}) { return new Response(JSON.stringify(payload), { status, headers: { "content-type": "application/json; charset=utf-8", ...headers } }); }
