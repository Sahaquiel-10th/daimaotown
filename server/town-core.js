import crypto from "node:crypto";

export function mergeRuntimePages(pages) {
  if (!Array.isArray(pages) || !pages.length) throw new Error("没有可合并的小镇数据页");
  const snapshot = structuredClone(pages[0]);
  const byId = new Map();
  for (const page of pages) {
    for (const resident of page?.town?.residents || []) {
      const residentId = Number(resident?.id);
      if (residentId && !byId.has(residentId)) byId.set(residentId, resident);
    }
  }
  snapshot.town = snapshot.town || {};
  snapshot.town.residents = [...byId.values()];
  snapshot.pagination = {
    ...(snapshot.pagination || {}),
    hasMoreResidents: false,
    nextAfterUserId: null,
    returnedResidents: byId.size,
  };
  return snapshot;
}

export function stripAssistantContext(value) {
  if (Array.isArray(value)) return value.map(stripAssistantContext);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "assistantContext")
      .map(([key, item]) => [key, stripAssistantContext(item)])
  );
}

export function collectCloudFileIds(value, output = new Set()) {
  if (typeof value === "string" && value.startsWith("cloud://")) output.add(value);
  else if (Array.isArray(value)) value.forEach((item) => collectCloudFileIds(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectCloudFileIds(item, output));
  return output;
}

export function replaceCloudFileIds(value, urlByFileId) {
  if (typeof value === "string") return urlByFileId.get(value) || value;
  if (Array.isArray(value)) return value.map((item) => replaceCloudFileIds(item, urlByFileId));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceCloudFileIds(item, urlByFileId)]));
}

export function createOpaqueId() {
  return crypto.randomBytes(24).toString("base64url");
}

export function stableNumber(value) {
  const digest = crypto.createHash("sha256").update(String(value)).digest();
  return digest.readUInt32BE(0);
}

export function publicResident(resident) {
  return {
    id: Number(resident.id),
    displayName: cleanText(resident.displayName, 80) || `小镇居民 #${resident.id}`,
    avatarUrl: cleanUrl(resident.avatarUrl),
    experiencePoints: finiteNumber(resident.experiencePoints),
    communities: Array.isArray(resident.communities) ? resident.communities.slice(0, 20).map(publicCommunity).filter((item) => item.id || item.name) : [],
    participantProjectIds: numericIds(resident.participantProjectIds),
    watchingProjectIds: numericIds(resident.watchingProjectIds),
    home: resident.home && typeof resident.home === "object" ? {
      zone: resident.home.zone === "project" ? "project" : "plaza",
      projectId: Number(resident.home.projectId) || null,
      relation: ["participant", "watcher"].includes(resident.home.relation) ? resident.home.relation : null,
    } : { zone: "plaza", projectId: null, relation: null },
  };
}

export function publicCommunity(community) {
  if (typeof community === "string") return { id: null, name: cleanText(community, 80), logoUrl: "" };
  return {
    id: Number(community?.id) || null,
    name: cleanText(community?.name || community?.communityName, 80),
    logoUrl: cleanUrl(community?.logoUrl || community?.logo_url),
  };
}

export function publicEvent(event) {
  return {
    id: Number(event?.id) || null,
    title: cleanText(event?.title || event?.name, 120),
    projectId: Number(event?.projectId || event?.project_id) || null,
    startsAt: cleanText(event?.startsAt || event?.start_time, 40),
  };
}

export function publicProject(project) {
  return {
    id: Number(project.id),
    name: cleanText(project.name, 100) || `项目 #${project.id}`,
    description: cleanText(project.description, 240),
    status: ["active", "completed"].includes(project.status) ? project.status : "active",
    stage: cleanText(project.stage, 40),
    goal: cleanText(project.goal, 240),
    tags: Array.isArray(project.tags) ? project.tags.slice(0, 8).map((item) => cleanText(item, 40)).filter(Boolean) : [],
    coverUrl: cleanUrl(project.coverUrl),
    starCount: finiteNumber(project.starCount),
    watchCount: finiteNumber(project.watchCount),
    participantCount: finiteNumber(project.participantCount),
    watcherCount: finiteNumber(project.watcherCount),
    houseType: cleanText(project.houseType, 40) || "workshop",
    creatorId: Number(project.creatorId) || null,
  };
}

export function publicSkillBounty(skill) {
  const title = cleanText(skill?.title || skill?.skill_name, 160) || `技能 #${skill?.id || ""}`;
  const tags = Array.isArray(skill?.tags || skill?.specialties)
    ? (skill.tags || skill.specialties).slice(0, 8).map((item) => cleanText(item, 40)).filter(Boolean)
    : [];
  const scopes = Array.isArray(skill?.serviceScopes || skill?.service_scopes)
    ? (skill.serviceScopes || skill.service_scopes).slice(0, 8).map((item) => cleanText(item, 120)).filter(Boolean)
    : [];
  const categoryText = `${title} ${tags.join(" ")} ${scopes.join(" ")}`.toLowerCase();
  const category = ["设计", "视觉", "剪辑", "视频", "文案", "摄影", "创意"].some((word) => categoryText.includes(word))
    ? "creative"
    : ["开发", "程序", "ai", "产品", "技术", "自动化", "数据"].some((word) => categoryText.includes(word))
      ? "tech"
      : "operations";
  const availability = cleanText(skill?.availabilityStatus || skill?.availability_status, 30);
  const publishStatus = cleanText(skill?.publishStatus || skill?.publish_status, 30);
  const displayStatus = ["completed", "archived"].includes(skill?.status) || publishStatus === "archived"
    ? "completed"
    : ["busy", "resting"].includes(availability) ? "paused" : "active";
  const heat = finiteNumber(skill?.applicants ?? skill?.catCount ?? skill?.cat_count);
  return {
    id: Number(skill?.id) || cleanText(skill?.id, 80),
    title,
    category: ["creative", "tech", "operations"].includes(skill?.category) ? skill.category : category,
    categoryName: cleanText(skill?.categoryName, 40),
    ownerName: cleanText(skill?.ownerName || skill?.display_name, 80) || "技能冒险家",
    ownerRole: cleanText(skill?.ownerRole, 100) || "技能冒险家",
    avatarUrl: cleanUrl(skill?.avatarUrl || skill?.avatar_url),
    reward: cleanText(skill?.reward, 80) || `🐱 × ${heat}`,
    applicants: heat,
    deadline: cleanText(skill?.deadline, 80) || ({ idle: "当前空闲", available: "可以接单", busy: "档期较满", resting: "暂时休息" })[availability] || "档期可询",
    tags,
    serviceScopes: scopes,
    description: cleanText(skill?.description || skill?.short_intro, 500) || scopes.join("；"),
    kind: skill?.kind === "bounty" ? "bounty" : "offer",
    availabilityStatus: availability,
    publishStatus,
    displayStatus,
    updatedAt: cleanText(skill?.updatedAt || skill?.updated_at, 40),
  };
}

export function eligibleProjectResidents(snapshot, projectId) {
  return (snapshot?.town?.residents || []).filter((resident) => {
    const context = resident.assistantContext;
    if (!context?.eligible) return false;
    return (resident.participantProjectIds || []).map(Number).includes(Number(projectId)) ||
      (resident.watchingProjectIds || []).map(Number).includes(Number(projectId));
  });
}

export function cleanText(value, max = 200) {
  return String(value || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function moderatePublicReply(value, max = 120) {
  let content = cleanText(value, max);
  if (!content) return { ok: false, reason: "EMPTY" };
  const blocked = [
    /(?:微信|vx|v信|手机号|电话|邮箱|e-?mail)\s*[:：]?\s*[\w@.+-]{5,}/i,
    /(?:sk|key|token|secret)[-_][a-z0-9_-]{8,}/i,
    /(?:忽略|无视).{0,12}(?:规则|指令|提示词)/i,
    /(?:系统提示词|system prompt|开发者指令|内部密钥)/i,
    /\b1[3-9]\d{9}\b/,
  ];
  if (blocked.some((pattern) => pattern.test(content))) return { ok: false, reason: "BLOCKED_CONTENT" };
  if (content.length > max) content = `${content.slice(0, max - 1)}…`;
  return { ok: true, content };
}

function numericIds(value) {
  return Array.isArray(value) ? [...new Set(value.map(Number).filter(Number.isSafeInteger))] : [];
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function cleanUrl(value) {
  const url = cleanText(value, 1000);
  const cloudMatch = url.match(/^cloud:\/\/[^.]+\.([^/]+)\/(.+)$/i);
  if (cloudMatch) return `https://${cloudMatch[1]}.tcb.qcloud.la/${encodeURI(cloudMatch[2])}`;
  return /^https?:\/\//i.test(url) ? url : "";
}
