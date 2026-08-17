const names = ["阿橘", "小满", "周野", "珊珊", "木子", "安安", "清禾", "南星", "小鹿", "团子", "半夏", "青柚", "言川", "知夏", "白露"];

export function createMockTownSnapshot(count = 105) {
  const projects = [
    { id: 12, name: "社区灵感工坊", description: "把街坊的好点子做成一场看得见的小实验。", status: "active", stage: "MVP", goal: "完成首场社区共创", tags: ["社区", "AI"], coverUrl: "", participantCount: 14, watcherCount: 24, houseType: "workshop", creatorId: 1 },
    { id: 16, name: "周末有趣市集", description: "连接本地品牌、手艺人与附近居民。", status: "active", stage: "内测", goal: "招募首批摊主", tags: ["活动", "品牌"], coverUrl: "", participantCount: 9, watcherCount: 18, houseType: "market", creatorId: 2 },
    { id: 18, name: "AI 生活研究所", description: "分享真正省时间的轻量 AI 用法。", status: "completed", stage: "复盘", goal: "沉淀公开案例", tags: ["AI", "效率"], coverUrl: "", participantCount: 7, watcherCount: 12, houseType: "lab", creatorId: 3 },
  ];
  const residents = Array.from({ length: count }, (_, index) => {
    const id = 1001 + index;
    const project = index < 38 ? projects[index % projects.length] : null;
    const participant = project && index % 3 === 0;
    return {
      id,
      displayName: `${names[index % names.length]}${index >= names.length ? index + 1 : ""}`,
      avatarUrl: "",
      experiencePoints: (index * 17) % 360,
      communities: [],
      participantProjectIds: participant ? [project.id] : [],
      watchingProjectIds: project && !participant ? [project.id] : [],
      home: project ? { zone: "project", projectId: project.id, relation: participant ? "participant" : "watcher" } : { zone: "plaza", projectId: null, relation: null },
      assistantContext: index < 9 ? {
        eligible: true,
        currentRole: ["活动策划的小助手", "独立开发者的小助手", "品牌主理人的小助手"][index % 3],
        personalityStyle: "友好、具体、会主动寻找可以马上验证的共同点。",
        publicIntro: "主人正在参与一项社区共创。",
        currentGoals: ["认识可以一起做小实验的伙伴"],
        canOffer: ["策划与落地经验"],
        lookingFor: ["愿意共同验证想法的人"],
        notInterestedIn: ["群发广告"],
        preferredProjectTypes: ["社区", "AI"],
        collaborationStyle: "先从一个小问题开始。",
        cardSummary: {
          job: "小镇共创者",
          intro: "喜欢把想法做成可见的结果，也愿意认识能一起行动的新伙伴。",
          tags: ["社区", "共创"],
          selectedAnswers: [
            { q: "最近在做什么？", a: "正在参与一项社区共创小实验。" },
            { q: "可以提供什么？", a: "策划、组织和把想法落地的经验。" },
            { q: "想认识谁？", a: "愿意一起验证新想法的行动派。" },
          ],
        },
      } : { eligible: false },
    };
  });
  const participants = residents.reduce((total, resident) => total + resident.participantProjectIds.length, 0);
  const watchers = residents.reduce((total, resident) => total + resident.watchingProjectIds.length, 0);
  const skillBounties = [
    { id: 201, title: "品牌视觉搭档", category: "creative", ownerName: "青柚", ownerRole: "社区品牌主理人", reward: "800 鱼干", applicants: 6, deadline: "剩余 3 天", tags: ["品牌视觉", "海报"], description: "为周末有趣市集建立一套轻盈、好记的视觉语言。", kind: "bounty" },
    { id: 202, title: "短视频剪辑支援", category: "creative", ownerName: "珊珊", ownerRole: "内容策划", reward: "500 鱼干", applicants: 4, deadline: "剩余 5 天", tags: ["剪辑", "内容"], description: "把社区共创过程剪成三支 30 秒短片。", kind: "bounty" },
    { id: 203, title: "小程序前端开发", category: "tech", ownerName: "周野", ownerRole: "独立开发者", reward: "1200 鱼干", applicants: 8, deadline: "剩余 6 天", tags: ["小程序", "React"], description: "协助完成活动报名与订单状态页面。", kind: "bounty" },
    { id: 204, title: "AI 工作流搭建", category: "tech", ownerName: "木子", ownerRole: "AI 产品经理", reward: "技能挂牌", applicants: 12, deadline: "本周可约", tags: ["Agent", "自动化"], description: "可提供从需求梳理到轻量 Agent 落地的协作。", kind: "offer" },
    { id: 205, title: "市集招商运营", category: "operations", ownerName: "小满", ownerRole: "活动运营", reward: "600 鱼干", applicants: 5, deadline: "剩余 4 天", tags: ["招商", "活动"], description: "寻找熟悉本地生活商家的运营伙伴。", kind: "bounty" },
    { id: 206, title: "社群增长顾问", category: "operations", ownerName: "南星", ownerRole: "增长顾问", reward: "技能挂牌", applicants: 9, deadline: "今日有空", tags: ["增长", "社群"], description: "擅长冷启动、社群机制和转介绍路径设计。", kind: "offer" },
  ];
  return {
    success: true,
    version: 1,
    stats: { registeredResidents: count, publicProjects: projects.length, activeProjects: 2, participantRelations: participants, watcherRelations: watchers, communities: 6 },
    town: { projects, residents, communities: [{ id: 1, name: "I Have a Demo", logoUrl: "" }, { id: 2, name: "轻创", logoUrl: "" }], events: [], skillBounties },
    pagination: { residentLimit: 500, afterUserId: 0, hasMoreResidents: false, nextAfterUserId: null, projectsTruncated: false, returnedProjects: projects.length },
    generatedAt: new Date().toISOString(),
    cacheTtlSeconds: 60,
  };
}
