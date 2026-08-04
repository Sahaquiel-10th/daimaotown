# 呆猫冒险小镇

面向汇报大屏的游戏化 2.5D 小镇与轻量 BFF。中央冒险家公会负责“发布项目”和“挂出技能悬赏”，周围分为项目大厅、技能集市与多社区入口。地图支持拖拽、缩放、区域聚焦、检索和全屏展示。

视觉采用“纸片模型 + 折纸拼贴”方案。建筑和道具来自 `呆猫小镇视觉`，运行 `python3 scripts/prepare_town_assets.py` 可重新生成透明裁切后的网页素材；地块、道路、水系、镜头与数据标牌由代码生成，不依赖一张固定大背景。

## 本地运行

```bash
cp .env.example .env
npm install
npm run server
npm run dev
```

默认网页为 `http://localhost:5173`，BFF 为 `http://127.0.0.1:8091`。`.env.example` 默认启用 105 位模拟居民、3 个项目与 6 份技能演示数据；连接真实数据前，将 `TOWN_USE_DEMO` 改为 `false`，并在 BFF 的环境变量中配置 CloudBase/CAM 凭证与 `DASHBOARD_PUBLIC_TOKEN`。独立服务器也可配置 `TOWN_DATA_API_URL`，通过 Partner API 读取数据而不保存数据库主密钥。

## BFF 接口

- `GET /api/town/bootstrap`：项目、居民、社区和技能挂牌的完整公开快照；不包含 `assistantContext`。
- `GET /api/town/version`：轻量数据版本指纹；网页仅在版本变化时重新读取完整快照。
- `POST /api/town/session`：创建当前页面的临时会话；不足 2 位同项目合格助手时返回 `status=degraded`。
- `POST /api/town/session/:sessionId/next`：服务端生成、审查并返回一条发言。
- `DELETE /api/town/session/:sessionId`：提前释放内存会话；TTL 清理仍是最终保障。
- `GET /api/town/health`：不含凭证的服务状态。

真实模式会读取 `publicTownRuntimeContext`，并通过公开的 `listSkillBounties` 补充技能集市数据。`bootstrap` 在数据中心短时失败时使用最后成功快照；无历史快照且服务端凭证未配置时使用本地演示数据，页面不会白屏。所有 AI Key、CloudBase/CAM 密钥与大屏业务 token 都只能配置在 BFF 服务端，禁止使用 `VITE_` 前缀。

生产大屏每 60 秒请求一次轻量版本指纹，版本没有变化时不会重复下载居民、项目和技能完整快照；页面进入后台时暂停检查，回到前台后立即补查一次。版本接口复用 `DASHBOARD_PUBLIC_TOKEN`，不需要新增数据库表或浏览器端配置。

独立服务器部署文件位于 `deploy/`。生产服务只监听 `127.0.0.1:3080`，由独立的 Nginx 站点转发；GitHub Actions 使用受限 SSH Key 把已验证的构建包传给 `/usr/local/sbin/deploy-daimaotown`，不会获得通用服务器 Shell 权限，也不依赖服务器主动连接 GitHub。

## 验证与部署

```bash
npm test
npm run build
TOWN_WEB_HOST=0.0.0.0 npm run server
```

生产环境应由同域反向代理提供网页与 `/api`，设置 HTTPS，并通过平台密钥管理注入服务端环境变量。进程重启会清空临时会话，符合 V1 设计。

## GitHub 自动化

`main` 分支的每次推送都会触发 GitHub Actions，自动执行依赖安装、测试和生产构建，并保留 7 天的 `dist` 构建产物。Pull Request 也会运行同一套检查。

生产环境需要服务端保存 `DASHBOARD_PUBLIC_TOKEN` 等密钥，因此不能直接部署到纯静态的 GitHub Pages。自有服务器将业务密钥保存在服务器的 `/etc/daimaotown.env`，GitHub Secrets 只保存受限部署 Key、主机指纹和连接地址；任何生产密钥都不得提交到仓库。
