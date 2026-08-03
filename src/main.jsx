import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const glyph = (symbol) => function Glyph() { return <span className="glyph" aria-hidden="true">{symbol}</span>; };
const Award = glyph("★");
const BriefcaseBusiness = glyph("▣");
const ChevronRight = glyph("›");
const Clock3 = glyph("◷");
const Compass = glyph("◈");
const Eye = glyph("◉");
const Fullscreen = glyph("⛶");
const Maximize2 = glyph("↗");
const Minus = glyph("−");
const Plus = glyph("+");
const Radio = glyph("●");
const RotateCcw = glyph("↻");
const Search = glyph("⌕");
const ShieldCheck = glyph("◆");
const Sparkles = glyph("✦");
const UsersRound = glyph("♟");
const WandSparkles = glyph("✧");
const X = glyph("×");

const apiBase = import.meta.env.VITE_TOWN_API_URL || "/api";
const WORLD = { width: 2500, height: 1600 };
const art = (name) => `/assets/town/papercraft/${name}.png`;

const DEMO_SKILLS = [
  { id: "s1", title: "品牌视觉搭档", category: "creative", categoryName: "创意工坊", ownerName: "青柚", ownerRole: "社区品牌主理人", reward: "800 鱼干", applicants: 6, deadline: "剩余 3 天", tags: ["品牌视觉", "海报"], description: "为周末有趣市集建立一套轻盈、好记的视觉语言。", kind: "bounty" },
  { id: "s2", title: "短视频剪辑支援", category: "creative", categoryName: "创意工坊", ownerName: "珊珊", ownerRole: "内容策划", reward: "500 鱼干", applicants: 4, deadline: "剩余 5 天", tags: ["剪辑", "内容"], description: "把社区共创过程剪成三支 30 秒短片。", kind: "bounty" },
  { id: "s3", title: "小程序前端开发", category: "tech", categoryName: "技术营地", ownerName: "周野", ownerRole: "独立开发者", reward: "1200 鱼干", applicants: 8, deadline: "剩余 6 天", tags: ["小程序", "React"], description: "协助完成活动报名与订单状态页面。", kind: "bounty" },
  { id: "s4", title: "AI 工作流搭建", category: "tech", categoryName: "技术营地", ownerName: "木子", ownerRole: "AI 产品经理", reward: "技能挂牌", applicants: 12, deadline: "本周可约", tags: ["Agent", "自动化"], description: "可提供从需求梳理到轻量 Agent 落地的协作。", kind: "offer" },
  { id: "s5", title: "市集招商运营", category: "operations", categoryName: "运营商栈", ownerName: "小满", ownerRole: "活动运营", reward: "600 鱼干", applicants: 5, deadline: "剩余 4 天", tags: ["招商", "活动"], description: "寻找熟悉本地生活商家的运营伙伴。", kind: "bounty" },
  { id: "s6", title: "社群增长顾问", category: "operations", categoryName: "运营商栈", ownerName: "南星", ownerRole: "增长顾问", reward: "技能挂牌", applicants: 9, deadline: "今日有空", tags: ["增长", "社群"], description: "擅长冷启动、社群机制和转介绍路径设计。", kind: "offer" },
];

const PROJECT_LAYOUTS = [
  { x: 235, y: 250, width: 390, asset: "project-workshop", tone: "gold" },
  { x: 210, y: 780, width: 350, asset: "project-market", tone: "coral" },
  { x: 1760, y: 230, width: 345, asset: "project-lab", tone: "mint" },
  { x: 2020, y: 695, width: 285, asset: "project-memorial", tone: "stone" },
  { x: 470, y: 1080, width: 320, asset: "project-studio", tone: "coral" },
];

const FALLBACK_PROJECTS = [
  { id: 12, name: "社区灵感工坊", description: "把街坊的好点子做成看得见的小实验。", status: "active", stage: "MVP", goal: "完成首场社区共创", tags: ["社区", "AI"], participantCount: 14, watcherCount: 24 },
  { id: 16, name: "周末有趣市集", description: "连接本地品牌、手艺人与附近居民。", status: "active", stage: "内测", goal: "招募首批摊主", tags: ["活动", "品牌"], participantCount: 9, watcherCount: 18 },
  { id: 18, name: "AI 生活研究所", description: "分享真正省时间的轻量 AI 用法。", status: "completed", stage: "复盘", goal: "沉淀公开案例", tags: ["AI", "效率"], participantCount: 7, watcherCount: 12 },
];

const SKILL_STALLS = [
  { id: "creative", title: "创意工坊", subtitle: "设计 · 内容 · 影像", x: 1530, y: 930, width: 300, asset: "skill-creative" },
  { id: "tech", title: "技术营地", subtitle: "开发 · AI · 产品", x: 1770, y: 1065, width: 285, asset: "skill-tech" },
  { id: "operations", title: "运营商栈", subtitle: "增长 · 商务 · 活动", x: 2070, y: 980, width: 285, asset: "skill-operations" },
];

const PROP_LAYOUTS = [
  ["prop-tree", 80, 210, 115], ["prop-tree", 690, 180, 100], ["prop-tree", 2190, 210, 120],
  ["prop-tree", 2320, 430, 95], ["prop-tree", 114, 1230, 110], ["prop-tree", 2220, 1300, 105],
  ["prop-shrub", 755, 410, 74], ["prop-shrub", 1630, 420, 72], ["prop-shrub", 1000, 1280, 68],
  ["prop-lamp", 820, 650, 62], ["prop-lamp", 1645, 685, 62], ["prop-lamp", 1175, 1120, 58],
  ["prop-bench", 790, 910, 92], ["prop-bench", 1435, 1190, 92],
  ["prop-signpost", 640, 730, 70], ["prop-mailbox", 1500, 780, 52],
  ["prop-fountain", 1135, 860, 165], ["prop-planter", 960, 1080, 76],
  ["prop-parcels", 1990, 1240, 72], ["prop-produce-crate", 520, 890, 72],
  ["prop-notice-board", 920, 585, 75], ["prop-bridge", 2220, 590, 130],
];

function App() {
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const dataVersionRef = useRef("");
  const bootstrapRef = useRef(null);
  const refreshInFlightRef = useRef(false);
  const [bootstrap, setBootstrap] = useState(null);
  const [connection, setConnection] = useState("connecting");
  const [clock, setClock] = useState(new Date());
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 0.7 });
  const [mode, setMode] = useState("all");
  const [selected, setSelected] = useState({ type: "guild" });
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    initializeData();
    const clockTimer = window.setInterval(() => setClock(new Date()), 1000);
    const dataTimer = window.setInterval(checkForUpdates, 60_000);
    const hintTimer = window.setTimeout(() => setHintVisible(false), 7000);
    const onVisibilityChange = () => {
      if (!document.hidden) checkForUpdates();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(dataTimer);
      window.clearTimeout(hintTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    bootstrapRef.current = bootstrap;
  }, [bootstrap]);

  useEffect(() => {
    const timer = window.setTimeout(() => focusAt(1250, 780, fittedScale()), 30);
    let resizeTimer;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => focusAt(1250, 780, fittedScale()), 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  async function initializeData() {
    let version = "";
    try {
      version = await loadDataVersion();
    } catch {
      // The full snapshot remains a safe compatibility path while the version
      // endpoint is unavailable or an older backend is still being deployed.
    }
    await loadBootstrap(version);
  }

  async function loadDataVersion() {
    const response = await fetch(`${apiBase}/town/version`, { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok || !payload?.success || !payload.version) throw new Error(payload?.message || "版本读取失败");
    return String(payload.version);
  }

  async function checkForUpdates() {
    if (refreshInFlightRef.current || document.hidden) return;
    try {
      const version = await loadDataVersion();
      if (!dataVersionRef.current || version !== dataVersionRef.current) await loadBootstrap(version);
      else setConnection("ready");
    } catch {
      setConnection(bootstrapRef.current ? "stale" : "demo");
    }
  }

  async function loadBootstrap(version = "") {
    if (refreshInFlightRef.current) return;
    refreshInFlightRef.current = true;
    setConnection((value) => value === "ready" ? "refreshing" : "connecting");
    try {
      const response = await fetch(`${apiBase}/town/bootstrap`);
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "数据读取失败");
      setBootstrap(payload);
      if (version) dataVersionRef.current = version;
      setConnection(payload.source === "live" ? "ready" : payload.source === "stale" ? "stale" : "demo");
    } catch {
      setConnection(bootstrapRef.current ? "stale" : "demo");
    } finally {
      refreshInFlightRef.current = false;
    }
  }

  const projects = bootstrap ? (bootstrap.town?.projects || []) : FALLBACK_PROJECTS;
  const residents = bootstrap?.town?.residents || [];
  const skills = bootstrap ? (bootstrap.town?.skillBounties || []) : DEMO_SKILLS;
  const stats = bootstrap?.stats || {};
  const residentsByProject = useMemo(() => {
    const result = new Map(projects.map((project) => [Number(project.id), []]));
    residents.forEach((resident) => {
      const id = Number(resident.home?.projectId);
      if (result.has(id)) result.get(id).push(resident);
    });
    return result;
  }, [projects, residents]);

  const visibleProjects = projects.filter((project) => !search || `${project.name} ${(project.tags || []).join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  const visibleSkills = skills.filter((skill) => !search || `${skill.title} ${skill.ownerName} ${(skill.tags || []).join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  const selectedData = resolveSelection(selected, projects, skills);

  function fittedScale() {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return 0.7;
    return Math.max(0.52, Math.min(0.62, (rect.width - 380) / WORLD.width, (rect.height + 25) / WORLD.height));
  }

  function focusAt(worldX, worldY, scale = camera.scale) {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const usableWidth = rect.width > 900 ? rect.width - 350 : rect.width;
    setCamera({ x: usableWidth / 2 - worldX * scale, y: rect.height / 2 - worldY * scale, scale });
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setSelected(nextMode === "all" ? { type: "guild" } : null);
    if (nextMode === "projects") focusAt(830, 760, 0.78);
    else if (nextMode === "skills") focusAt(1800, 1010, 0.82);
    else focusAt(1250, 780, fittedScale());
  }

  function zoom(delta) {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCamera((current) => {
      const nextScale = clamp(current.scale + delta, 0.42, 1.25);
      const centerWorldX = (rect.width / 2 - current.x) / current.scale;
      const centerWorldY = (rect.height / 2 - current.y) / current.scale;
      return {
        scale: nextScale,
        x: rect.width / 2 - centerWorldX * nextScale,
        y: rect.height / 2 - centerWorldY * nextScale,
      };
    });
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    if (event.target.closest?.("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startY: event.clientY, cameraX: camera.x, cameraY: camera.y, moved: false };
    setHintVisible(false);
  }

  function onPointerMove(event) {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    dragRef.current.moved ||= Math.abs(dx) + Math.abs(dy) > 5;
    setCamera((current) => ({ ...current, x: dragRef.current.cameraX + dx, y: dragRef.current.cameraY + dy }));
  }

  function onPointerUp(event) {
    if (!dragRef.current) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current = null;
  }

  function onWheel(event) {
    event.preventDefault();
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHintVisible(false);
    setCamera((current) => {
      const nextScale = clamp(current.scale * (event.deltaY > 0 ? 0.92 : 1.08), 0.42, 1.25);
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      const worldX = (px - current.x) / current.scale;
      const worldY = (py - current.y) / current.scale;
      return { scale: nextScale, x: px - worldX * nextScale, y: py - worldY * nextScale };
    });
  }

  function pick(selection, focus) {
    setSelected(selection);
    if (focus) focusAt(focus.x, focus.y, Math.max(camera.scale, 0.78));
  }

  return (
    <main className="town-app">
      <header className="town-header">
        <div className="brand">
          <div className="brand-mark"><img src="/assets/town/logo.png" alt="" /></div>
          <div>
            <div className="brand-kicker"><span /> DAIMAO COMMUNITY WORLD</div>
            <h1>呆猫冒险小镇</h1>
          </div>
        </div>
        <div className="overview-stats">
          <HeaderStat icon={<UsersRound />} label="冒险家" value={bootstrap ? (stats.registeredResidents ?? residents.length) : 105} />
          <HeaderStat icon={<BriefcaseBusiness />} label="进行项目" value={stats.activeProjects ?? projects.filter((p) => p.status !== "completed").length} />
          <HeaderStat icon={<Award />} label="技能悬赏" value={skills.filter((item) => item.kind !== "offer").length} />
          <HeaderStat icon={<Sparkles />} label="技能挂牌" value={skills.filter((item) => item.kind === "offer").length} />
        </div>
        <div className="header-actions">
          <div className={`connection-pill ${connection}`}><Radio />{connectionLabel(connection)}</div>
          <div className="clock"><strong>{formatTime(clock)}</strong><span>{formatDate(clock)}</span></div>
          <button className="round-button" onClick={() => document.documentElement.requestFullscreen?.()} title="进入全屏"><Fullscreen /></button>
        </div>
      </header>

      <nav className="world-tabs" aria-label="小镇区域">
        <button className={mode === "all" ? "active" : ""} onClick={() => changeMode("all")}><Compass />小镇全景<span>{projects.length + skills.length}</span></button>
        <button className={mode === "projects" ? "active" : ""} onClick={() => changeMode("projects")}><BriefcaseBusiness />项目大厅<span>{projects.length}</span></button>
        <button className={mode === "skills" ? "active" : ""} onClick={() => changeMode("skills")}><WandSparkles />技能集市<span>{skills.length}</span></button>
      </nav>

      <section
        ref={viewportRef}
        className={`world-viewport mode-${mode}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div className="world-sky" />
        <div
          className="world"
          style={{ width: WORLD.width, height: WORLD.height, transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})` }}
        >
          <div className="paper-island" />
          <MapPaths />
          <DistrictSign className="projects-sign" icon={<BriefcaseBusiness />} eyebrow="PROJECT QUESTS" title="项目大厅" detail={`${projects.length} 个项目正在这里发生`} />
          <DistrictSign className="skills-sign" icon={<WandSparkles />} eyebrow="SKILL BOUNTIES" title="技能集市" detail={`${skills.length} 份技能等待被发现`} />

          <button className={`guild world-node ${selected?.type === "guild" ? "selected" : ""}`} onClick={(event) => { event.stopPropagation(); pick({ type: "guild" }, { x: 1250, y: 720 }); }}>
            <div className="guild-halo" />
            <img src={art("guild")} alt="冒险家公会" draggable="false" />
            <div className="guild-banner">
              <span>城镇中心 · NO. 001</span>
              <strong>冒险家公会</strong>
              <small>发布项目 · 挂出技能悬赏</small>
            </div>
            <div className="guild-desk project-desk"><BriefcaseBusiness /><span>项目委托处</span></div>
            <div className="guild-desk skill-desk"><WandSparkles /><span>技能登记处</span></div>
          </button>

          <div className="projects-layer">
            {visibleProjects.slice(0, PROJECT_LAYOUTS.length).map((project, index) => {
              const layout = PROJECT_LAYOUTS[index] || PROJECT_LAYOUTS.at(-1);
              const projectResidents = residentsByProject.get(Number(project.id)) || [];
              return (
                <ProjectNode
                  key={project.id}
                  project={project}
                  layout={layout}
                  residents={projectResidents}
                  selected={selected?.type === "project" && String(selected.id) === String(project.id)}
                  onSelect={() => pick({ type: "project", id: project.id }, { x: layout.x + layout.width / 2, y: layout.y + 240 })}
                />
              );
            })}
          </div>

          <div className="skills-layer">
            {SKILL_STALLS.map((stall) => (
              <SkillStall
                key={stall.id}
                stall={stall}
                skills={visibleSkills.filter((item) => item.category === stall.id)}
                selected={selected?.type === "stall" && selected.id === stall.id}
                onSelect={() => pick({ type: "stall", id: stall.id }, { x: stall.x + stall.width / 2, y: stall.y + 200 })}
              />
            ))}
          </div>

          <button className="community-hall world-node" onClick={(event) => { event.stopPropagation(); setSelected({ type: "community" }); }}>
            <img src={art("community-hall")} alt="" draggable="false" />
            <span><small>多社区入口</small><strong>居民议事厅</strong></span>
          </button>

          <div className="environment-layer" aria-hidden="true">
            {PROP_LAYOUTS.map(([name, x, y, width], index) => <img key={`${name}-${index}`} src={art(name)} style={{ left: x, top: y, width }} alt="" draggable="false" />)}
          </div>
          <WanderingAssistants residents={residents} />
        </div>

        {hintVisible && <div className="map-hint"><Maximize2 />拖动画布探索小镇 · 滚轮缩放</div>}

        <div className="map-tools">
          <button onClick={() => zoom(0.1)} title="放大"><Plus /></button>
          <span>{Math.round(camera.scale * 100)}%</span>
          <button onClick={() => zoom(-0.1)} title="缩小"><Minus /></button>
          <button onClick={() => changeMode("all")} title="回到全景"><RotateCcw /></button>
          <button className={searchOpen ? "active" : ""} onClick={() => setSearchOpen((value) => !value)} title="搜索"><Search /></button>
        </div>

        {searchOpen && (
          <div className="search-panel">
            <Search />
            <input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索项目、技能或冒险家" />
            <button onClick={() => { setSearch(""); setSearchOpen(false); }}><X /></button>
          </div>
        )}

        <DetailPanel data={selectedData} projects={projects} skills={skills} onClose={() => setSelected(null)} onSelectSkill={(id) => setSelected({ type: "skill", id })} />

        <div className="map-legend">
          <span><i className="legend-dot project" />项目任务</span>
          <span><i className="legend-dot bounty" />技能悬赏</span>
          <span><i className="legend-dot offer" />技能挂牌</span>
          <em>画面中的角色为用户 AI 小助手</em>
        </div>
      </section>
    </main>
  );
}

function HeaderStat({ icon, label, value }) {
  return <div className="header-stat"><div>{icon}<span>{label}</span></div><strong>{Number(value || 0).toLocaleString("zh-CN")}</strong></div>;
}

function DistrictSign({ className, icon, eyebrow, title, detail }) {
  return <div className={`district-sign ${className}`}><div>{icon}</div><span><small>{eyebrow}</small><strong>{title}</strong><em>{detail}</em></span></div>;
}

function ProjectNode({ project, layout, residents, selected, onSelect }) {
  const people = residents.length ? residents : mockPeople(project);
  const total = project.participantCount ?? people.filter((p) => p.relation !== "watcher").length;
  const watching = project.watcherCount ?? people.filter((p) => p.relation === "watcher").length;
  return (
    <button
      className={`project-node world-node tone-${layout.tone} ${project.status === "completed" ? "completed" : ""} ${selected ? "selected" : ""}`}
      style={{ left: layout.x, top: layout.y, width: layout.width }}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
    >
      <div className="node-shadow" />
      <img className="building-art" src={art(layout.asset)} alt="" draggable="false" />
      <div className="project-flag">{project.status === "completed" ? "冒险完成" : project.stage || "进行中"}</div>
      <div className="node-label">
        <span>{project.status === "completed" ? "COMPLETED QUEST" : "ACTIVE QUEST"}</span>
        <strong>{project.name}</strong>
        <div><em><UsersRound />{total} 人协作</em><em><Eye />{watching} 人关注</em></div>
      </div>
      <div className="resident-ring">
        {people.slice(0, 4).map((person, index) => <AssistantToken key={person.id || index} person={person} index={index} />)}
      </div>
    </button>
  );
}

function SkillStall({ stall, skills, selected, onSelect }) {
  return (
    <button
      className={`skill-stall world-node ${selected ? "selected" : ""}`}
      style={{ left: stall.x, top: stall.y, width: stall.width }}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
    >
      <div className="node-shadow" />
      <img src={art(stall.asset)} alt="" draggable="false" />
      <div className="skill-count"><strong>{skills.length}</strong><span>份技能</span></div>
      <div className="node-label skill-label">
        <span>SKILL MARKET</span><strong>{stall.title}</strong><small>{stall.subtitle}</small>
      </div>
      {skills.slice(0, 2).map((skill, index) => (
        <div key={skill.id} className={`floating-order order-${index} ${skill.kind === "offer" ? "offer" : ""}`}>
          <i>{skill.kind === "offer" ? "技能挂牌" : "悬赏"}</i><b>{skill.title}</b>
        </div>
      ))}
    </button>
  );
}

function AssistantToken({ person, index = 0 }) {
  const name = person.displayName || person.ownerName || "呆猫助手";
  return (
    <div className={`assistant-token token-${index % 4}`}>
      <div className="assistant-body"><img src="/assets/town/logo.png" alt="" /></div>
      <span>{name}</span>
    </div>
  );
}

function WanderingAssistants({ residents }) {
  const fallback = ["阿橘", "小满", "清禾", "南星", "团子", "木子", "小鹿", "知夏"];
  const names = residents.length ? residents.slice(0, 8).map((item) => item.displayName) : fallback;
  const positions = [
    [920, 770], [1465, 755], [840, 1110], [1550, 1240],
    [1140, 1235], [1840, 780], [690, 620], [1950, 520],
  ];
  return (
    <div className="wanderers">
      {names.map((name, index) => (
        <div className={`wanderer wander-${index}`} key={`${name}-${index}`} style={{ left: positions[index][0], top: positions[index][1] }}>
          <AssistantToken person={{ displayName: name }} index={index} />
          {index === 1 && <div className="thought-bubble">正在寻找 UI 搭档…</div>}
        </div>
      ))}
    </div>
  );
}

function DetailPanel({ data, projects, skills, onClose, onSelectSkill }) {
  if (!data) return null;
  if (data.type === "guild") {
    return (
      <aside className="detail-panel guild-panel">
        <PanelHead eyebrow="TOWN CENTER" title="冒险家公会" onClose={onClose} />
        <p className="panel-intro">所有项目与技能委托都从这里出发。用户的 AI 小助手会带着身份和目标，前往最适合的任务地点。</p>
        <div className="guild-actions">
          <div><span><BriefcaseBusiness /></span><b>发布项目委托</b><small>让想法成为小镇里的一座新建筑</small><ChevronRight /></div>
          <div><span><WandSparkles /></span><b>挂出技能悬赏</b><small>寻找能力，也可以把自己的技能挂出来</small><ChevronRight /></div>
        </div>
        <div className="panel-summary"><div><strong>{projects.length}</strong><span>公开项目</span></div><div><strong>{skills.length}</strong><span>技能委托</span></div><div><strong>3</strong><span>活跃社区</span></div></div>
      </aside>
    );
  }
  if (data.type === "project") {
    const project = data.item;
    return (
      <aside className="detail-panel">
        <PanelHead eyebrow={project.status === "completed" ? "COMPLETED QUEST" : "ACTIVE QUEST"} title={project.name} onClose={onClose} />
        <div className="status-row"><span className="status active">{project.status === "completed" ? "已完成" : project.stage || "进行中"}</span><span><Clock3 />最近更新 12 分钟前</span></div>
        <p className="panel-intro">{project.description || project.goal || "一项正在小镇发生的公开项目。"}</p>
        <div className="project-goal"><ShieldCheck /><div><span>本阶段目标</span><strong>{project.goal || "完成下一阶段公开验证"}</strong></div></div>
        <div className="panel-metrics"><div><span>协作成员</span><b>{project.participantCount ?? 8}</b></div><div><span>关注居民</span><b>{project.watcherCount ?? 16}</b></div><div><span>完成进度</span><b>{project.status === "completed" ? "100%" : "68%"}</b></div></div>
        <div className="tag-list">{(project.tags || ["社区共创"]).map((tag) => <span key={tag}>#{tag}</span>)}</div>
      </aside>
    );
  }
  if (data.type === "skill") {
    return <SkillDetail skill={data.item} onClose={onClose} />;
  }
  if (data.type === "stall") {
    const categorySkills = skills.filter((item) => item.category === data.id);
    return (
      <aside className="detail-panel">
        <PanelHead eyebrow="SKILL MARKET" title={data.title} onClose={onClose} />
        <p className="panel-intro">{data.subtitle}。这里既有等待认领的技能悬赏，也有居民主动亮出的能力挂牌。</p>
        <div className="skill-list">
          {categorySkills.map((skill) => (
            <button key={skill.id} onClick={() => onSelectSkill(skill.id)}>
              <i className={skill.kind}>{skill.kind === "offer" ? "技能挂牌" : "悬赏招募"}</i>
              <b>{skill.title}</b><span>{skill.ownerName} · {skill.reward}</span><ChevronRight />
            </button>
          ))}
        </div>
      </aside>
    );
  }
  return (
    <aside className="detail-panel">
      <PanelHead eyebrow="COMMUNITY PORTAL" title="居民议事厅" onClose={onClose} />
      <p className="panel-intro">数据中心支持多个小程序社区。每个社区拥有自己的项目、任务与技能生态，并在同一座小镇里被看见。</p>
      <div className="community-stack"><span>demo 社区<b>当前活跃</b></span><span>创客社区<em>筹备中</em></span><span>本地生活社区<em>筹备中</em></span></div>
    </aside>
  );
}

function SkillDetail({ skill, onClose }) {
  return (
    <aside className="detail-panel">
      <PanelHead eyebrow={skill.kind === "offer" ? "SKILL AVAILABLE" : "SKILL BOUNTY"} title={skill.title} onClose={onClose} />
      <div className="status-row"><span className={`status ${skill.kind}`}>{skill.kind === "offer" ? "技能挂牌" : "悬赏招募"}</span><span><Clock3 />{skill.deadline}</span></div>
      <p className="panel-intro">{skill.description}</p>
      <div className="owner-card"><div>{skill.ownerName.slice(0, 1)}</div><span><small>委托人</small><b>{skill.ownerName}</b><em>{skill.ownerRole}</em></span></div>
      <div className="reward-card"><span>{skill.kind === "offer" ? "当前热度" : "悬赏报酬"}</span><strong>{skill.reward}</strong><em>{skill.applicants} 位冒险家已关注</em></div>
      <div className="tag-list">{skill.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
    </aside>
  );
}

function PanelHead({ eyebrow, title, onClose }) {
  return <div className="panel-head"><div><span>{eyebrow}</span><h2>{title}</h2></div><button onClick={onClose}><X /></button></div>;
}

function MapPaths() {
  return (
    <svg className="map-paths" viewBox={`0 0 ${WORLD.width} ${WORLD.height}`} aria-hidden="true">
      <path className="river-shadow" d="M -100 1420 C 280 1180 330 1030 540 980 C 770 925 890 1050 1050 1015 C 1230 975 1300 805 1465 785 C 1680 760 1750 860 1940 785 C 2140 705 2210 565 2600 530" />
      <path className="river" d="M -100 1420 C 280 1180 330 1030 540 980 C 770 925 890 1050 1050 1015 C 1230 975 1300 805 1465 785 C 1680 760 1750 860 1940 785 C 2140 705 2210 565 2600 530" />
      <path className="road outer" d="M 220 695 C 400 500 655 525 875 650 C 1030 740 1090 835 1250 835 C 1435 835 1470 695 1645 580 C 1815 470 2070 490 2270 690" />
      <path className="road" d="M 1250 760 C 980 690 745 510 505 420 M 1190 790 C 905 825 600 870 390 940 M 1290 785 C 1515 680 1705 525 1910 420 M 1300 840 C 1535 960 1720 1110 1900 1210 M 1125 855 C 950 1060 785 1190 620 1260" />
      <path className="road-stitch outer" d="M 220 695 C 400 500 655 525 875 650 C 1030 740 1090 835 1250 835 C 1435 835 1470 695 1645 580 C 1815 470 2070 490 2270 690" />
    </svg>
  );
}

function resolveSelection(selected, projects, skills) {
  if (!selected) return null;
  if (selected.type === "guild" || selected.type === "community") return selected;
  if (selected.type === "project") return { type: "project", item: projects.find((item) => String(item.id) === String(selected.id)) || projects[0] };
  if (selected.type === "skill") return { type: "skill", item: skills.find((item) => String(item.id) === String(selected.id)) || skills[0] };
  if (selected.type === "stall") {
    const stall = SKILL_STALLS.find((item) => item.id === selected.id);
    return { type: "stall", ...stall };
  }
  return null;
}

function mockPeople(project) {
  const names = ["阿橘", "小满", "周野", "清禾"];
  return names.map((displayName, index) => ({ id: `${project.id}-${index}`, displayName, relation: index === 3 ? "watcher" : "participant" }));
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function formatTime(date) { return new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date); }
function formatDate(date) { return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(date); }
function connectionLabel(status) { return ({ connecting: "连接中", refreshing: "更新中", ready: "数据已连接", stale: "缓存快照", demo: "演示数据" })[status] || status; }

createRoot(document.getElementById("root")).render(<App />);
