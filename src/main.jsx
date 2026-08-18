import React, { useEffect, useRef, useState } from "react";
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
const WORLD = { width: 2800, height: 1800 };
const art = (name) => `/assets/town/papercraft/${name}.png`;

const DEMO_SKILLS = [
  { id: "s1", title: "品牌视觉搭档", ownerName: "青柚", ownerRole: "社区品牌主理人", reward: "技能挂牌", applicants: 6, deadline: "当前可约", tags: ["品牌视觉", "海报"], description: "为周末有趣市集建立一套轻盈、好记的视觉语言。", kind: "offer", displayStatus: "active" },
  { id: "s2", title: "短视频剪辑支援", ownerName: "珊珊", ownerRole: "内容策划", reward: "技能挂牌", applicants: 4, deadline: "档期较满", tags: ["剪辑", "内容"], description: "把社区共创过程剪成三支 30 秒短片。", kind: "offer", displayStatus: "paused" },
  { id: "s3", title: "小程序前端开发", ownerName: "周野", ownerRole: "独立开发者", reward: "技能挂牌", applicants: 8, deadline: "已完成展示", tags: ["小程序", "React"], description: "协助完成活动报名与订单状态页面。", kind: "offer", displayStatus: "completed" },
  { id: "s4", title: "AI 工作流搭建", ownerName: "木子", ownerRole: "AI 产品经理", reward: "技能挂牌", applicants: 12, deadline: "本周可约", tags: ["Agent", "自动化"], description: "可提供从需求梳理到轻量 Agent 落地的协作。", kind: "offer", displayStatus: "active" },
  { id: "s5", title: "市集招商运营", ownerName: "小满", ownerRole: "活动运营", reward: "技能挂牌", applicants: 5, deadline: "暂时休息", tags: ["招商", "活动"], description: "寻找熟悉本地生活商家的运营伙伴。", kind: "offer", displayStatus: "paused" },
  { id: "s6", title: "社群增长顾问", ownerName: "南星", ownerRole: "增长顾问", reward: "技能挂牌", applicants: 9, deadline: "当前可约", tags: ["增长", "社群"], description: "擅长冷启动、社群机制和转介绍路径设计。", kind: "offer", displayStatus: "active" },
];

const PROJECT_HALL = { x: 410, y: 525, width: 280, asset: "project-workshop" };

const FALLBACK_PROJECTS = [
  { id: 12, name: "社区灵感工坊", description: "把街坊的好点子做成看得见的小实验。", status: "active", stage: "MVP", goal: "完成首场社区共创", tags: ["社区", "AI"], participantCount: 14, watcherCount: 24 },
  { id: 16, name: "周末有趣市集", description: "连接本地品牌、手艺人与附近居民。", status: "active", stage: "内测", goal: "招募首批摊主", tags: ["活动", "品牌"], participantCount: 9, watcherCount: 18 },
  { id: 18, name: "AI 生活研究所", description: "分享真正省时间的轻量 AI 用法。", status: "completed", stage: "复盘", goal: "沉淀公开案例", tags: ["AI", "效率"], participantCount: 7, watcherCount: 12 },
];

const SKILL_STALLS = [
  { id: "active", title: "进行中", subtitle: "当前可被发现与邀约", x: 1900, y: 830, width: 185, asset: "skill-creative" },
  { id: "paused", title: "暂停", subtitle: "档期忙碌或暂时休息", x: 2115, y: 930, width: 175, asset: "skill-tech" },
  { id: "completed", title: "已完成", subtitle: "已经沉淀的技能足迹", x: 2310, y: 820, width: 180, asset: "skill-operations" },
];

const DECORATIVE_HOUSES = [
  ["project-market", 210, 250, 145], ["project-studio", 690, 235, 135], ["project-lab", 930, 255, 150],
  ["project-memorial", 1640, 250, 120], ["project-studio", 1880, 250, 140], ["project-workshop", 2190, 270, 135],
  ["project-market", 2470, 390, 125], ["project-lab", 250, 1000, 140], ["project-memorial", 500, 1170, 115],
  ["project-studio", 700, 1210, 145], ["project-workshop", 1090, 1230, 130], ["project-market", 1510, 1190, 145],
  ["project-lab", 1820, 1160, 130], ["project-memorial", 2240, 1110, 120], ["project-studio", 2480, 1000, 145],
];

const PROP_LAYOUTS = [
  ["prop-tree", 120, 190, 66], ["prop-tree", 178, 215, 56], ["prop-tree", 226, 186, 62],
  ["prop-tree", 570, 165, 60], ["prop-tree", 625, 185, 52], ["prop-tree", 1280, 170, 64], ["prop-tree", 1338, 195, 54],
  ["prop-tree", 2380, 210, 62], ["prop-tree", 2435, 235, 54], ["prop-tree", 2630, 650, 58], ["prop-tree", 2580, 680, 50],
  ["prop-tree", 110, 1180, 64], ["prop-tree", 165, 1200, 52], ["prop-tree", 2550, 1160, 62], ["prop-tree", 2605, 1190, 52],
  ["prop-shrub", 245, 240, 38], ["prop-shrub", 290, 250, 32], ["prop-shrub", 760, 480, 42], ["prop-shrub", 805, 495, 34],
  ["prop-shrub", 1700, 460, 40], ["prop-shrub", 1745, 475, 32], ["prop-shrub", 980, 1190, 38], ["prop-shrub", 1020, 1200, 32],
  ["prop-shrub", 2180, 1090, 40], ["prop-shrub", 2222, 1100, 32],
  ["prop-lamp", 595, 700, 30], ["prop-lamp", 760, 590, 30], ["prop-lamp", 960, 505, 30], ["prop-lamp", 1180, 455, 30],
  ["prop-lamp", 1600, 455, 30], ["prop-lamp", 1830, 510, 30], ["prop-lamp", 2070, 600, 30], ["prop-lamp", 2290, 730, 30],
  ["prop-lamp", 2330, 980, 30], ["prop-lamp", 2070, 1130, 30], ["prop-lamp", 1770, 1210, 30], ["prop-lamp", 1260, 1260, 30],
  ["prop-lamp", 720, 1125, 30], ["prop-lamp", 510, 970, 30], ["prop-lamp", 920, 785, 28], ["prop-lamp", 1100, 820, 28],
  ["prop-lamp", 1650, 850, 28], ["prop-lamp", 1870, 900, 28],
  ["prop-bench", 790, 560, 50], ["prop-bench", 820, 990, 50], ["prop-bench", 1690, 570, 50],
  ["prop-bench", 1910, 1060, 50], ["prop-bench", 1190, 1090, 50], ["prop-bench", 1580, 1070, 50],
  ["prop-signpost", 720, 750, 40], ["prop-mailbox", 1630, 810, 30], ["prop-fountain", 1320, 925, 92],
  ["prop-planter", 1040, 1110, 42], ["prop-parcels", 2080, 1250, 40], ["prop-produce-crate", 510, 900, 40],
  ["prop-notice-board", 860, 570, 46], ["prop-bridge", 2330, 1260, 160],
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
  const [residentBatch, setResidentBatch] = useState(0);
  const [townEventIndex, setTownEventIndex] = useState(0);

  useEffect(() => {
    initializeData();
    const clockTimer = window.setInterval(() => setClock(new Date()), 1000);
    const dataTimer = window.setInterval(checkForUpdates, 60_000);
    const residentTimer = window.setInterval(() => setResidentBatch((value) => value + 1), 180_000);
    const townEventTimer = window.setInterval(() => setTownEventIndex((value) => value + 1), 12_000);
    const hintTimer = window.setTimeout(() => setHintVisible(false), 7000);
    const onVisibilityChange = () => {
      if (!document.hidden) checkForUpdates();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(dataTimer);
      window.clearInterval(residentTimer);
      window.clearInterval(townEventTimer);
      window.clearTimeout(hintTimer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    bootstrapRef.current = bootstrap;
  }, [bootstrap]);

  useEffect(() => {
    const timer = window.setTimeout(() => focusAt(1400, 900, fittedScale()), 30);
    let resizeTimer;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => focusAt(1400, 900, fittedScale()), 120);
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
  const communities = bootstrap?.town?.communities || [];
  const skills = bootstrap ? (bootstrap.town?.skillBounties || []) : DEMO_SKILLS;
  const officialEvents = bootstrap?.town?.events || [];
  const stats = bootstrap?.stats || {};
  const visibleProjects = projects.filter((project) => !search || `${project.name} ${(project.tags || []).join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  const visibleSkills = skills.filter((skill) => !search || `${skill.title} ${skill.ownerName} ${(skill.tags || []).join(" ")}`.toLowerCase().includes(search.toLowerCase()));
  const selectedData = resolveSelection(selected, projects, skills, residents);
  const timeOfDay = townTimePhase(clock);
  const townEvents = buildTownEvents(projects, skills, communities, officialEvents);
  const currentTownEvent = townEvents[townEventIndex % townEvents.length];

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
    if (nextMode === "projects") focusAt(550, 760, 0.9);
    else if (nextMode === "skills") focusAt(2160, 980, 0.85);
    else focusAt(1400, 900, fittedScale());
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
    if (event.target.closest?.(".detail-panel")) return;
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
          <HeaderStat icon={<Award />} label="技能进行中" value={skills.filter((item) => skillDisplayStatus(item) === "active").length} />
          <HeaderStat icon={<Sparkles />} label="技能暂停" value={skills.filter((item) => skillDisplayStatus(item) === "paused").length} />
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
        className={`world-viewport mode-${mode} phase-${timeOfDay}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div className="world-sky" />
        <div
          className={`world event-${currentTownEvent.type}`}
          style={{ width: WORLD.width, height: WORLD.height, transform: `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})` }}
        >
          <div className="paper-island" />
          <MapPaths />
          <DistrictSign className="projects-sign" icon={<BriefcaseBusiness />} eyebrow="PROJECT QUESTS" title="项目大厅" detail={`${projects.length} 个项目集中展示`} />
          <DistrictSign className="skills-sign" icon={<WandSparkles />} eyebrow="SKILL MARKET" title="技能集市" detail={`${skills.length} 位技能冒险家在此挂牌`} />

          <button className={`guild world-node ${selected?.type === "guild" ? "selected" : ""}`} onClick={(event) => { event.stopPropagation(); pick({ type: "guild" }, { x: 1400, y: 830 }); }}>
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
            <ProjectHall
              projects={visibleProjects}
              selected={selected?.type === "project-hall" || selected?.type === "project"}
              onSelect={() => pick({ type: "project-hall" }, { x: 550, y: 720 })}
            />
          </div>

          <div className="skills-layer">
            {SKILL_STALLS.map((stall) => (
              <SkillStall
                key={stall.id}
                stall={stall}
                skills={visibleSkills.filter((item) => skillDisplayStatus(item) === stall.id)}
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
            {DECORATIVE_HOUSES.map(([name, x, y, width], index) => <img className="decorative-house" key={`house-${index}`} src={art(name)} style={{ left: x, top: y, width }} alt="" draggable="false" />)}
            {PROP_LAYOUTS.map(([name, x, y, width], index) => <img className={`town-prop prop-${name.replace("prop-", "")}`} key={`${name}-${index}`} src={art(name)} style={{ left: x, top: y, width }} alt="" draggable="false" />)}
          </div>
          <WanderingAssistants
            residents={residents}
            projects={projects}
            skills={skills}
            batch={residentBatch}
            selectedId={selected?.type === "resident" ? selected.id : null}
            onSelect={(person) => setSelected({ type: "resident", id: person.id, item: person })}
          />
        </div>

        {hintVisible && <div className="map-hint"><Maximize2 />拖动画布探索小镇 · 滚轮缩放</div>}

        <div className={`town-event-toast event-${currentTownEvent.type}`} key={`${currentTownEvent.type}-${townEventIndex}`}>
          <span><Sparkles /></span>
          <div><small>小镇事件 · {currentTownEvent.place}</small><strong>{currentTownEvent.text}</strong></div>
        </div>

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

        <DetailPanel data={selectedData} projects={projects} skills={skills} residents={residents} communities={communities} onClose={() => setSelected(null)} onSelectProject={(id) => setSelected({ type: "project", id })} onSelectSkill={(id) => setSelected({ type: "skill", id })} />

        <div className="map-legend">
          <span><i className="legend-dot project" />项目任务</span>
          <span><i className="legend-dot bounty" />技能进行中</span>
          <span><i className="legend-dot paused" />技能暂停</span>
          <span><i className="legend-dot completed" />技能已完成</span>
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

function ProjectHall({ projects, selected, onSelect }) {
  const participants = projects.reduce((total, project) => total + Number(project.participantCount || 0), 0);
  const active = projects.filter((project) => project.status !== "completed").length;
  return (
    <button
      className={`project-node project-hall world-node ${selected ? "selected" : ""}`}
      style={{ left: PROJECT_HALL.x, top: PROJECT_HALL.y, width: PROJECT_HALL.width }}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
    >
      <div className="node-shadow" />
      <img className="building-art" src={art(PROJECT_HALL.asset)} alt="" draggable="false" />
      <div className="project-flag">{active} 项进行中</div>
      <div className="node-label">
        <span>ALL PROJECT QUESTS</span>
        <strong>项目大厅</strong>
        <div><em><BriefcaseBusiness />{projects.length} 个项目</em><em><UsersRound />{participants} 人次协作</em></div>
      </div>
      <div className="building-hover-card"><b>项目大厅</b><span>所有付费项目集中在这里展示</span><em>点击查看 {projects.length} 个项目 ›</em></div>
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
        <span>SKILL MARKET STATUS</span><strong>{stall.title}</strong><small>{stall.subtitle}</small>
      </div>
      {skills.slice(0, 2).map((skill, index) => (
        <div key={skill.id} className={`floating-order order-${index} ${skill.kind === "offer" ? "offer" : ""}`}>
          <i>技能挂牌</i><b>{skill.title}</b>
        </div>
      ))}
      <div className="building-hover-card"><b>{stall.title} · {skills.length} 位</b><span>{stall.subtitle}</span><em>点击查看技能列表 ›</em></div>
    </button>
  );
}

function AssistantToken({ person, index = 0 }) {
  const name = person.displayName || person.ownerName || "呆猫助手";
  const avatarUrl = person.avatarUrl || "";
  return (
    <div className={`assistant-token token-${index % 4}`}>
      <div className={`assistant-body ${avatarUrl ? "has-avatar" : ""}`}>
        <img className="assistant-fallback" src="/assets/town/logo.png" alt="" />
        {avatarUrl && <img className="assistant-avatar" src={avatarUrl} alt="" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
      </div>
      <span>{name}</span>
    </div>
  );
}

function WanderingAssistants({ residents, projects, skills, batch, selectedId, onSelect }) {
  const fallbackNames = Array.from({ length: 50 }, (_, index) => ({ id: `demo-${index}`, displayName: `冒险家 ${String(index + 1).padStart(2, "0")}` }));
  const source = residents.length ? residents : fallbackNames;
  const count = Math.min(50, source.length);
  const start = source.length > count ? (batch * count) % source.length : 0;
  const people = Array.from({ length: count }, (_, index) => source[(start + index) % source.length]);
  const companions = new Map([
    [2, { id: 0, member: 0, route: 1 }], [3, { id: 0, member: 1, route: 1 }],
    [7, { id: 1, member: 0, route: 3 }], [8, { id: 1, member: 1, route: 3 }], [9, { id: 1, member: 2, route: 3 }],
    [13, { id: 2, member: 0, route: 5 }], [14, { id: 2, member: 1, route: 5 }],
    [18, { id: 3, member: 0, route: 7 }], [19, { id: 3, member: 1, route: 7 }], [20, { id: 3, member: 2, route: 7 }],
    [24, { id: 4, member: 0, route: 9 }], [25, { id: 4, member: 1, route: 9 }],
    [29, { id: 5, member: 0, route: 11 }], [30, { id: 5, member: 1, route: 11 }], [31, { id: 5, member: 2, route: 11 }],
    [35, { id: 6, member: 0, route: 13 }], [36, { id: 6, member: 1, route: 13 }],
    [40, { id: 7, member: 0, route: 15 }], [41, { id: 7, member: 1, route: 15 }], [42, { id: 7, member: 2, route: 15 }],
    [45, { id: 8, member: 0, route: 17 }], [46, { id: 8, member: 1, route: 17 }],
    [47, { id: 9, member: 0, route: 6 }], [48, { id: 9, member: 1, route: 6 }], [49, { id: 9, member: 2, route: 6 }],
  ]);
  return (
    <div className="wanderers">
      {people.map((person, index) => {
        const seed = stableResidentNumber(person.id || person.displayName || index);
        const companion = companions.get(index);
        const route = companion?.route ?? ((seed + index * 5) % 18);
        const duration = 108 + (seed % 47) + (companion?.member || 0) * 2.5;
        const delay = companion ? -(companion.id * 29 + 18) - companion.member * .7 : -(seed % Math.floor(duration));
        const activity = residentActivity(person, projects, skills, route, batch);
        return (
          <button
            type="button"
            className={`wanderer route-${route} ${companion ? "walking-together" : "walking-solo"} ${String(selectedId) === String(person.id) ? "selected" : ""}`}
            key={`${person.id || person.displayName}-${batch}`}
            style={{ "--walk-delay": `${delay}s`, "--walk-duration": `${duration}s`, "--walk-scale": `${0.78 + (index % 5) * 0.055}` }}
            onClick={(event) => { event.stopPropagation(); onSelect({ ...person, townActivity: activity }); }}
            aria-label={`查看冒险家 ${person.displayName || "呆猫助手"} 的公开档案`}
          >
            <AssistantToken person={person} index={index} />
            {index === 1 && <div className="thought-bubble">{activity}</div>}
          </button>
        );
      })}
    </div>
  );
}

function DetailPanel({ data, projects, skills, residents, communities, onClose, onSelectProject, onSelectSkill }) {
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
        <div className="panel-summary"><div><strong>{projects.length}</strong><span>公开项目</span></div><div><strong>{skills.length}</strong><span>技能委托</span></div><div><strong>{communities.length}</strong><span>活跃社区</span></div></div>
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
  if (data.type === "project-hall") {
    return (
      <aside className="detail-panel">
        <PanelHead eyebrow="PROJECT QUEST HALL" title="项目大厅" onClose={onClose} />
        <p className="panel-intro">小镇里的项目不再各占一栋房子。所有公开项目集中在这里，随着数量增长继续使用同一个大厅。</p>
        <div className="project-list">
          {projects.map((project) => (
            <button key={project.id} onClick={() => onSelectProject(project.id)}>
              <i className={project.status === "completed" ? "completed" : "active"}>{project.status === "completed" ? "已完成" : project.stage || "进行中"}</i>
              <b>{project.name}</b>
              <span>{project.participantCount || 0} 人协作 · {project.watcherCount || 0} 人关注</span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </aside>
    );
  }
  if (data.type === "skill") {
    return <SkillDetail skill={data.item} onClose={onClose} />;
  }
  if (data.type === "stall") {
    const categorySkills = skills.filter((item) => skillDisplayStatus(item) === data.id);
    return (
      <aside className="detail-panel">
        <PanelHead eyebrow="SKILL MARKET" title={data.title} onClose={onClose} />
        <p className="panel-intro">{data.subtitle}。这里展示的是有技能的冒险家，分组只用于大屏观察，不会改动后台的档期与上架状态。</p>
        <div className="skill-list">
          {categorySkills.map((skill) => (
            <button key={skill.id} onClick={() => onSelectSkill(skill.id)}>
              <i className={data.id}>技能挂牌</i>
              <b>{skill.title}</b><span>{skill.ownerName} · {skill.reward}</span><ChevronRight />
            </button>
          ))}
        </div>
      </aside>
    );
  }
  if (data.type === "resident") {
    const resident = data.item;
    const residentCommunities = resident.communities || [];
    const card = resident.publicCard || {};
    const activity = resident.townActivity || residentActivity(resident, projects, skills, stableResidentNumber(resident.id) % 18, 0);
    return (
      <aside className="detail-panel resident-panel">
        <PanelHead eyebrow="ADVENTURER PROFILE" title="冒险家档案" onClose={onClose} />
        <div className="resident-profile-head">
          <div className="resident-profile-avatar">
            <img className="profile-fallback" src="/assets/town/logo.png" alt="" />
            {resident.avatarUrl && <img className="profile-real-avatar" src={resident.avatarUrl} alt="" referrerPolicy="no-referrer" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
          </div>
          <div><span>用户的 AI 小助手</span><h3>{resident.displayName}</h3><em>{card.job || "呆猫社区冒险家"}</em></div>
        </div>
        <div className="resident-activity">
          <span>当前活动</span>
          <strong>{activity}</strong>
        </div>
        {card.intro && <div className="resident-intro"><span>个人介绍</span><p>{card.intro}</p></div>}
        {!!card.tags?.length && <div className="tag-list resident-tags">{card.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
        {!!card.answers?.length && <div className="resident-answers">
          <span>冒险家问答</span>
          {card.answers.slice(0, 3).map((item, index) => <div key={`${item.question}-${index}`}><b>{item.question}</b><p>{item.answer}</p></div>)}
        </div>}
        <div className="panel-metrics resident-metrics">
          <div><span>参与项目</span><b>{resident.participantProjectIds?.length || 0}</b></div>
          <div><span>关注项目</span><b>{resident.watchingProjectIds?.length || 0}</b></div>
          <div><span>冒险经验</span><b>{Number(resident.experiencePoints || 0).toLocaleString("zh-CN")}</b></div>
        </div>
        <div className="resident-communities">
          <span>所属社区</span>
          <div>{residentCommunities.length ? residentCommunities.map((community, index) => <i key={community.id || `${community.name}-${index}`}>{community.name || "呆猫社区"}</i>) : <i>暂未加入社区</i>}</div>
        </div>
      </aside>
    );
  }
  return (
    <aside className="detail-panel">
      <PanelHead eyebrow="COMMUNITY PORTAL" title="居民议事厅" onClose={onClose} />
      <p className="panel-intro">数据中心支持多个小程序社区。每个社区拥有自己的项目、任务与技能生态，并在同一座小镇里被看见。</p>
      <div className="community-stack">
        {communities.length ? communities.map((community) => {
          const memberCount = residents.filter((resident) => (resident.communities || []).some((item) => Number(item.id) === Number(community.id))).length;
          const projectCount = projects.filter((project) => Number(project.communityId) === Number(community.id)).length;
          return <div className="community-row" key={community.id || community.name}>
            <span className="community-logo">{community.logoUrl ? <img src={community.logoUrl} alt="" referrerPolicy="no-referrer" /> : (community.name || "社").slice(0, 1)}</span>
            <span><b>{community.name}</b><small>{memberCount} 位居民 · {projectCount} 个项目</small></span>
            <em>运行中</em>
          </div>;
        }) : <div className="community-empty">后台暂无已启用社区</div>}
      </div>
    </aside>
  );
}

function SkillDetail({ skill, onClose }) {
  const displayStatus = skillDisplayStatus(skill);
  const displayLabel = ({ active: "进行中", paused: "暂停", completed: "已完成" })[displayStatus];
  return (
    <aside className="detail-panel">
      <PanelHead eyebrow="ADVENTURER SKILL" title={skill.title} onClose={onClose} />
      <div className="status-row"><span className={`status ${displayStatus}`}>{displayLabel}</span><span><Clock3 />{skill.deadline}</span></div>
      <p className="panel-intro">{skill.description}</p>
      <div className="owner-card"><div>{skill.avatarUrl ? <img src={skill.avatarUrl} alt="" /> : skill.ownerName.slice(0, 1)}</div><span><small>技能冒险家</small><b>{skill.ownerName}</b><em>{skill.ownerRole}</em></span></div>
      <div className="reward-card"><span>当前热度</span><strong>{skill.reward}</strong><em>{skill.applicants} 位冒险家已关注</em></div>
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
      <path className="river-shadow" d="M -80 1510 C 360 1390 620 1490 940 1435 C 1260 1380 1480 1455 1780 1405 C 2100 1350 2380 1435 2880 1280" />
      <path className="river" d="M -80 1510 C 360 1390 620 1490 940 1435 C 1260 1380 1480 1455 1780 1405 C 2100 1350 2380 1435 2880 1280" />
      <path className="road outer" d="M 410 760 C 520 430 980 330 1400 430 C 1850 335 2310 470 2410 820 C 2490 1130 2070 1320 1610 1270 C 1210 1395 680 1240 430 980 C 360 900 360 830 410 760 Z" />
      <path className="road" d="M 1400 850 L 540 720 M 1400 850 L 2160 940 M 1400 850 L 930 1280 M 1400 850 L 1850 1270 M 1400 850 L 1400 430 M 540 720 L 430 980 M 2160 940 L 2410 820" />
      <path className="road-stitch outer" d="M 410 760 C 520 430 980 330 1400 430 C 1850 335 2310 470 2410 820 C 2490 1130 2070 1320 1610 1270 C 1210 1395 680 1240 430 980 C 360 900 360 830 410 760 Z" />
    </svg>
  );
}

function resolveSelection(selected, projects, skills, residents) {
  if (!selected) return null;
  if (selected.type === "guild" || selected.type === "community" || selected.type === "project-hall") return selected;
  if (selected.type === "project") return { type: "project", item: projects.find((item) => String(item.id) === String(selected.id)) || projects[0] };
  if (selected.type === "skill") return { type: "skill", item: skills.find((item) => String(item.id) === String(selected.id)) || skills[0] };
  if (selected.type === "resident") {
    const resident = residents.find((item) => String(item.id) === String(selected.id));
    return { type: "resident", item: { ...(resident || {}), ...(selected.item || {}) } };
  }
  if (selected.type === "stall") {
    const stall = SKILL_STALLS.find((item) => item.id === selected.id);
    return { type: "stall", ...stall };
  }
  return null;
}

function stableResidentNumber(value) {
  return [...String(value)].reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 2166136261);
}

function townTimePhase(date) {
  let hour = Number(new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", hour: "2-digit", hour12: false }).format(date));
  if (hour === 24) hour = 0;
  if (hour < 5) return "late-night";
  if (hour < 8) return "dawn";
  if (hour < 17) return "day";
  if (hour < 19) return "dusk";
  return "night";
}

function buildTownEvents(projects = [], skills = [], communities = [], officialEvents = []) {
  const activeProjects = projects.filter((project) => project.status !== "completed");
  const completedProjects = projects.filter((project) => project.status === "completed");
  const activeSkills = skills.filter((skill) => skillDisplayStatus(skill) === "active");
  const events = [
    { type: "project", place: "项目大厅", text: `${activeProjects.length} 项委托正在等待冒险家` },
    { type: "skill", place: "技能集市", text: `${activeSkills.length} 位技能冒险家当前可以邀约` },
    { type: "community", place: "居民议事厅", text: `${communities.length} 个社区正在小镇共同运行` },
  ];
  if (officialEvents[0]?.title) events.push({ type: "guild", place: "冒险家公会", text: `城镇活动「${officialEvents[0].title}」正在登记` });
  if (completedProjects[0]?.name) events.push({ type: "project", place: "项目大厅", text: `「${completedProjects[0].name}」留下了新的完成足迹` });
  return events;
}

function residentActivity(resident, projects = [], skills = [], route = 0, batch = 0) {
  const seed = stableResidentNumber(resident?.id || resident?.displayName || route);
  const participantProjects = projects.filter((project) => (resident?.participantProjectIds || []).map(String).includes(String(project.id)));
  const watchedProjects = projects.filter((project) => (resident?.watchingProjectIds || []).map(String).includes(String(project.id)));
  if (participantProjects.length && seed % 5 !== 0) {
    const project = participantProjects[(seed + batch) % participantProjects.length];
    return `正前往「${project.name}」参加项目协作`;
  }
  if (watchedProjects.length && seed % 4 !== 0) {
    const project = watchedProjects[(seed + batch) % watchedProjects.length];
    return `去项目大厅看看「${project.name}」的新进展`;
  }
  const activeSkills = skills.filter((skill) => skillDisplayStatus(skill) === "active");
  const routeActivities = [
    "正沿北侧街道慢慢闲逛",
    "准备去项目大厅看看新委托",
    "在冒险家公会附近等待新任务",
    "正往技能集市方向走",
    "在喷泉广场附近散步",
    "准备到居民议事厅看看新社区",
    "在河岸步道上悠闲散步",
    "正去长椅边和朋友碰面",
    "从项目大厅返回中央广场",
    "在集市外围寻找合作伙伴",
    "沿着环镇小路随意逛逛",
    "准备到冒险家公会登记近况",
    "在南侧街区探索新的小店",
    "正穿过广场前往项目大厅",
    "在技能集市附近看看热闹",
    "和同伴一起去河边散步",
    "正在小镇边缘悠闲闲逛",
    "从居民议事厅前往中央广场",
  ];
  if (activeSkills.length && seed % 9 === 0) {
    const skill = activeSkills[(seed + batch) % activeSkills.length];
    return `正去技能集市看看「${skill.title}」`;
  }
  return routeActivities[(route + batch) % routeActivities.length];
}

function skillDisplayStatus(skill) {
  if (["active", "paused", "completed"].includes(skill.displayStatus)) return skill.displayStatus;
  if (["completed", "archived"].includes(skill.status) || skill.publishStatus === "archived") return "completed";
  if (["busy", "resting"].includes(skill.availabilityStatus)) return "paused";
  return "active";
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function formatTime(date) { return new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date); }
function formatDate(date) { return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(date); }
function connectionLabel(status) { return ({ connecting: "连接中", refreshing: "更新中", ready: "数据已连接", stale: "缓存快照", demo: "演示数据" })[status] || status; }

createRoot(document.getElementById("root")).render(<App />);
