# 折纸拼贴 AI 小镇：美术生产与生图提示词

> 用途：在没有专职美术的前提下，为呆猫 AI 小镇制作第一版汇报级视觉资产。
>
> 原则：不让 AI 设计整座小镇，也不让 AI 独立设计几十张互不相关的图片。地图结构、道路、文字、状态和阴影由网页代码统一完成；先用一个孤立的项目工坊确定资产风格，后续单体资产携带它作为参考图逐个生成。

## 1. 建议方向

第一版采用「折纸拼贴冒险小镇」：

- 45° 左右的等距俯视视角，像搭在桌面上的纸艺立体书。
- 建筑由折叠纸张、剪纸、瓦楞纸板和印刷纸片组成。
- 保留少量不完全齐整的裁切边缘、折痕和纸纤维，让生成差异成为手作感的一部分。
- 主体克制，重点建筑和呆猫角色负责个性。
- 不在提示词中引用具体游戏或现成 IP 名称，使用「纸艺立体书、折纸、拼贴、纸板舞台」描述需要的视觉语言。

### 固定视觉参数

后续每一张生产资产都必须重复以下约束：

- 视角：统一等距三分之四俯视，镜头从正南偏东看向建筑。
- 光线：柔和左上方主光，右下方受光较弱。
- 材质：哑光未涂布纸、奶油纸、薄卡纸、少量瓦楞纸切面。
- 轮廓：深灰黑墨线，不使用厚重纯黑描边包围所有细节。
- 造型：2～4 层纸片叠加，有可见折痕、插口和剪贴边缘。
- 比例：可爱但克制，不做幼儿玩具，不做光滑塑料或黏土模型。
- 文字：生成图中禁止出现文字、字母、数字和 Logo；所有招牌由网页后加。
- 阴影：生产素材不生成落地阴影，网页统一添加。
- 构图：单体完整、居中，四周至少保留 15% 空白，不裁切屋顶和地基。

### 品牌色

- 奶油底色：`#F8F5EE`
- 深灰黑：`#111111`
- 行动黄：`#FFD76B`
- 状态绿：`#BFE7C0`
- 提醒红：`#FF6F61`

颜色可以出现变化，但每个资产最多只让一个品牌强调色成为主角。

## 2. 哪些内容由代码完成

以下内容不要生图：

- 等距地块、草地、道路、河流和桥面基础形状。
- 建筑名称、项目名称、技能名称、人物名称。
- 项目进度条、人数、围观数、社区徽章和档期状态。
- 角色头顶标签、对话气泡、任务提示和地图图标。
- 建筑落地阴影、发光、夜间灯光、施工围栏和完成庆典粒子。
- 普通项目房屋的批量换色、层级和标牌组合。

以下内容可以生图：

- 中央冒险家公会。
- 少量特殊建筑原型及其纸艺装饰。
- 技能集市的特殊摊位外观。
- 环境装饰物图集。
- 必要时的小助手基础身体和配件。

现有仓库中的呆猫透明素材优先用于界面、气泡、建筑门口和镜头特写，不重新生成同用途素材。

## 3. 生图总流程

严格按照顺序推进，不要一次生成全部图片。

1. 先由网页代码搭建灰盒地图，确定正交等距视角、中央广场、道路、项目街区、技能集市和镜头路线。
2. 不使用 AI 生成整镇概念图或地图背景。
3. 单独生成一个低矮的项目工坊，作为第一张资产风格母版。
4. 只针对项目工坊做单变量修改，直到纸张质感、视角和轮廓通过。
5. 把通过的项目工坊命名为 `STYLE_ANCHOR`。
6. 生成中央冒险家公会，并将它定为第二张参考图 `GUILD_ANCHOR`。
7. 后续每个建筑都同时附上 `STYLE_ANCHOR` 和 `GUILD_ANCHOR`。
8. 每次只生成一个资产。接受后再做下一个。
9. 若某张图不合格，只修改一个问题，例如“屋顶太圆”或“减少塑料感”，不要整段重写提示词。
10. 生产素材统一使用纯色抠图背景；裁切、透明化和阴影由后续程序处理。

参考图角色：

- 图片 1：`STYLE_ANCHOR`，是通过验收的孤立项目工坊，负责资产风格、色彩、纸张质感和视角。
- 图片 2：`GUILD_ANCHOR`，负责建筑比例、轮廓、光线和细节密度。
- 图片 3：可选的上一张同类资产，负责保持该系列一致性。

## 4. 第一步：孤立项目工坊风格母版

不要再把两张整镇候选图作为生图参考。它们可以保留为内部情绪板，但不能传给后续生成，因为模型会继承其中的实体书、摄影透视、教堂和微缩摆件构图。

第一张生产母版只画一个简单、低矮、轮廓清楚的项目工坊。单体比整镇更容易控制视角、材质和抠图边缘，也不会让图像模型参与地图设计。

### 4.1 项目工坊母版提示词

本次不上传任何参考图，从零生成。

```text
Use case: stylized-concept
Asset type: isolated game-building visual style anchor
Primary request: one compact community project workshop building for a modular isometric web game map
Subject: a low and wide civic workshop with one simple folded gable roof, a broad open doorway, two square windows, one blank rectangular notice panel for later HTML text, and a small side awning; practical, welcoming, collaborative, and clearly not a home, church, castle, or fantasy shop
Style/medium: clean digital cut-paper collage illustration, two to four flat layers of folded matte card stock, subtle paper fibers, restrained fold lines, clean hand-cut edges, sparse charcoal ink details; graphic and game-ready, not a photograph of a physical miniature
Composition/framing: exactly one complete building centered on canvas; strict orthographic isometric three-quarter top-down view; parallel roof and wall edges remain parallel; no perspective convergence; no wide-angle lens; all roof and base edges visible; at least 20 percent empty padding
Lighting/mood: simple soft light from the upper left, minimal shading, no dramatic studio lighting
Color palette: warm cream walls and charcoal roof dominate; coral yellow appears only on the small awning; no other strong colors
Scene/backdrop: perfectly flat solid #0000FF chroma-key background for later background removal
Constraints: one building only; no people; no cats; no trees; no street; no ground island; no open book; no tabletop; no room backdrop; no cast shadow; no reflection; no depth of field; no readable text; no letters; no numbers; no logo; no watermark; do not use #0000FF anywhere on the building
Avoid: physical-model photography, macro photography, shallow focus, cathedral, church, chapel, clock tower, castle, medieval tavern, glossy plastic, clay render, realistic brick texture, generic mobile-game cottage, excessive roof complexity, overly cute toy proportions
```

### 4.2 项目工坊母版验收

必须全部满足：

- 画面里只有一个完整建筑。
- 背景是平整纯蓝，没有地面、桌面、书页和景深。
- 建筑低矮、横向展开，不像住宅、教堂、城堡或商店。
- 屋顶和墙面主要平行边基本保持平行。
- 纸张纹理可见，但不像实体模型摄影。
- 建筑轮廓足够简单，缩小到 240px 宽仍可识别。
- 奶油色与深灰黑占绝对主导，黄色只作为局部强调。
- 没有文字、人物、树木、道具和落地阴影。

如果仍然出现实体模型摄影感，使用：

```text
Keep the building geometry unchanged. Convert only the rendering style from physical miniature photography to a clean flat digital cut-paper collage illustration. Remove lens effects, depth of field, studio lighting, realistic material shadows, and tabletop realism.
```

如果仍然像住宅或教堂，使用：

```text
Keep the paper style and camera unchanged. Redesign only the building silhouette into a low, wide, practical civic workshop with a broad doorway and simple roof. Remove all residential, church, chapel, castle, tower, spire, and fantasy-shop associations.
```

## 5. 第二步：中央冒险家公会

生成时附上：

- 图片 1：通过验收的孤立项目工坊 `STYLE_ANCHOR`。

### 5.1 公会生产提示词

```text
Use case: stylized-concept
Asset type: isolated game landmark building
Input images: Image 1 is the approved town style anchor; use it only for visual style, paper material, palette, camera angle, lighting direction, and detail density
Primary request: create one isolated central adventurers' guild building for the same papercraft town
Subject: a welcoming civic guild hall with a broad central entrance, a tall folded-paper roof, a small clock-like circular emblem without text, two symmetrical wings suggesting a project hall and a skill hall, a front notice board with blank paper cards, and a tiny gathering platform
Style/medium: the exact same handcrafted folded-paper and cut-paper collage language as Image 1; layered matte card stock; visible folds, slots, tabs, and clean hand-cut edges
Composition/framing: single complete building, centered, consistent isometric three-quarter top-down camera from the same direction as Image 1, all roof and base edges visible, at least 15 percent empty padding
Lighting/mood: same soft upper-left daylight as Image 1
Color palette: cream and charcoal dominate; coral yellow marks the main entrance; pale green appears only as a small active-status accent
Scene/backdrop: perfectly flat solid #0000FF chroma-key background for later background removal
Constraints: one building only; no characters; no ground scene; no cast shadow; no reflection; no readable text; no letters; no numbers; no logo; no watermark; do not use #0000FF anywhere on the building; preserve the visual identity of Image 1 without copying its full scene
Avoid: castle towers, medieval fortress, cathedral, glossy plastic, clay render, smooth generic 3D, excessive fantasy ornaments
```

### 5.2 公会验收

- 缩小到 300px 宽仍能辨认出它是中央地标。
- 两翼存在，但不会像两个完全独立的建筑。
- 入口明确，方便网页后加“冒险家公会”牌匾。
- 蓝色背景平整、单一，没有渐变和地面阴影。
- 建筑没有使用蓝色，便于后续抠图。

## 6. 第三步：项目建筑原型

每次生成一个建筑。所有提示词都附上：

- 图片 1：`STYLE_ANCHOR`
- 图片 2：`GUILD_ANCHOR`
- 从第二个项目建筑开始，图片 3 可附上一张已通过的项目建筑。

### 6.1 共用提示词骨架

```text
Use case: stylized-concept
Asset type: isolated modular project building for a game map
Input images: Image 1 is the approved world style anchor; Image 2 is the approved guild anchor; use them for visual style, material, scale language, camera angle, lighting direction, and detail density
Primary request: create one isolated [BUILDING TYPE] for the same papercraft adventure town
Subject: [BUILDING DETAILS]
Style/medium: matching handcrafted folded-paper architecture and cut-paper collage; matte card stock; visible folds, tabs, layered edges, and restrained printed ink details
Composition/framing: one complete compact building, centered, the same isometric three-quarter top-down camera as the references, at least 15 percent empty padding
Lighting/mood: the same soft upper-left daylight as the references
Color palette: cream and charcoal dominate; [ACCENT COLOR RULE]
Scene/backdrop: perfectly flat solid #0000FF chroma-key background for later background removal
Constraints: one building only; no characters; no ground scene; no cast shadow; no reflection; no readable text; no letters; no numbers; no logo; no watermark; do not use #0000FF anywhere on the building
Avoid: glossy plastic, clay render, realistic brick texture, generic mobile-game house, inconsistent perspective, overly childish proportions
```

替换项：

| 编号 | BUILDING TYPE | BUILDING DETAILS | ACCENT COLOR RULE |
|---|---|---|---|
| P01 | community project workshop | broad worktables hinted through windows, folded awning, blank project notice panel, practical collaborative feeling | coral yellow appears only on the awning and entrance marker |
| P02 | technology research laboratory | angular folded roof, paper antenna shapes, layered circular window, compact experimental annex | pale green appears only on the laboratory status light |
| P03 | creative media studio | taller facade, folded-paper light rig silhouette, small blank poster frames, expressive but orderly roofline | coral red appears sparingly on one poster frame |
| P04 | local market project shop | friendly shopfront, folded canopy, display windows made from translucent-looking paper layers, blank hanging sign | coral yellow marks the canopy edge |
| P05 | public community hall | wider civic building, open front steps, blank bulletin panels, welcoming symmetrical composition | pale green marks only the open entrance |
| P06 | completed project memorial pavilion | compact celebratory pavilion, folded ribbon shapes, small paper pennants without writing, closed project archive chest | coral yellow appears as a restrained completion ribbon |

第一版不必生成更多类型。网页通过换色、层数、烟囱、旗帜和招牌组合扩展项目数量。

## 7. 第四步：技能集市

技能摊位需要比项目建筑更轻、更密集。第一版只生成三个原型：

- S01：创意与内容摊位
- S02：技术与开发摊位
- S03：运营与商业摊位

### 7.1 技能摊位共用提示词

```text
Use case: stylized-concept
Asset type: isolated modular skill-market stall for a game map
Input images: Image 1 is the approved world style anchor; Image 2 is the approved guild anchor; use them for the same papercraft material, camera angle, lighting direction, scale language, and restrained color system
Primary request: create one isolated [SKILL CATEGORY] service stall for the skill market of the same adventure town
Subject: a compact open-front paper stall with a folded canopy, a blank hanging sign for later HTML text, one small counter, a few abstract paper tools suggesting [TOOLS], and a clear place where one cat assistant can stand
Style/medium: handcrafted folded-paper stall, cut-paper collage, matte card stock, visible tabs and layered edges, clean readable silhouette
Composition/framing: one complete stall, centered, same isometric three-quarter top-down camera as the references, at least 20 percent empty padding
Lighting/mood: same soft upper-left daylight
Color palette: cream and charcoal dominate; [ACCENT COLOR RULE]
Scene/backdrop: perfectly flat solid #0000FF chroma-key background for later background removal
Constraints: one stall only; no character; no ground scene; no cast shadow; no reflection; no readable text; no letters; no numbers; no logo; no watermark; do not use #0000FF anywhere in the stall
Avoid: medieval weapon shop, fantasy potion store, dense merchandise, glossy plastic, generic ecommerce booth, inconsistent perspective
```

替换项：

| 编号 | SKILL CATEGORY | TOOLS | ACCENT COLOR RULE |
|---|---|---|---|
| S01 | creative and content | editing frames, camera aperture shapes, paper and pencil silhouettes | coral yellow marks the canopy |
| S02 | technology and development | code-block shapes without text, circuit-like paper strips, compact tool modules | pale green marks one status tab |
| S03 | operations and business | planning cards, simple chart blocks without numbers, megaphone silhouette | coral red appears only on one small marker |

档期状态不要重新生图，由网页显示：

- 空闲中：蓝灰小旗。
- 可接单：绿色灯牌。
- 爆单啦：黄色排队牌。
- 休息中：灰色闭店帘。

## 8. 第五步：环境装饰图集

环境道具允许一次生成在同一张图中，因为它们不是主视觉，裁切后轻微差异可以被接受。

```text
Use case: stylized-concept
Asset type: papercraft game environment prop sheet
Input images: Image 1 is the approved world style anchor; Image 2 is the approved guild anchor; preserve their paper material, camera angle, lighting direction, outline language, and restrained palette
Primary request: create a clean collection of twelve separate small environment props for the same papercraft adventure town
Subject: one blank wooden-paper notice board, one folded street lamp, one small fountain, one bench, one mailbox, one stack of parcels, one directional sign with blank panels, one planter, one paper tree, one shrub, one tiny bridge segment, and one empty market crate
Style/medium: handcrafted folded-paper and cut-paper collage; matte card stock; visible layered edges; simple readable silhouettes
Composition/framing: organized 4 by 3 prop sheet, every object completely separated with generous equal spacing, consistent isometric three-quarter top-down angle, no overlaps
Lighting/mood: same soft upper-left daylight as the references
Color palette: cream, charcoal, kraft paper, restrained coral yellow and pale green accents
Scene/backdrop: perfectly flat solid #0000FF chroma-key background for later background removal
Constraints: exactly twelve separate props; no characters; no text; no letters; no numbers; no logos; no cast shadows; no watermark; do not use #0000FF inside any prop
Avoid: decorative clutter, photorealistic wood, glossy plastic, inconsistent camera angles, touching or overlapping objects
```

## 9. 小助手方案

第一版优先使用仓库现有呆猫素材，不立即生成人物图集。

地图移动角色使用一个统一的简化纸片猫身体，用户差异由网页叠加：

- 用户头像圆形胸牌。
- 社区颜色围巾。
- 项目参与者携带三角任务徽章。
- 围观者携带眼睛徽章。
- 技能提供者携带工具徽章。
- 头顶显示“用户名 · 小助手”。

只有当统一角色在地图中明显不成立时，再生成角色母版；不要提前制作几十个角色。

### 9.1 可选角色母版提示词

```text
Use case: stylized-concept
Asset type: isolated game character anchor
Input images: Image 1 is the approved world style anchor; Image 2 is the approved guild anchor; match their paper material, palette, lighting direction, and level of detail
Primary request: create one friendly generic cat-shaped AI adventurer assistant for the same papercraft town
Subject: a compact full-body black-and-cream paper cat character, simple upright pose, small blank circular chest badge for a later user avatar overlay, short paper scarf, no weapons, helpful and curious personality
Style/medium: layered cut-paper character with folded-paper limbs, matte card stock, subtle ink details, clean silhouette, restrained charm
Composition/framing: one full-body character centered, slight three-quarter view matching the town camera, generous padding
Lighting/mood: same soft upper-left daylight
Scene/backdrop: perfectly flat solid #0000FF chroma-key background for later background removal
Constraints: one character only; no cast shadow; no text; no letters; no numbers; no logo; no watermark; do not use #0000FF on the character; readable at 48 pixels tall
Avoid: anime person, realistic cat fur, mascot costume, glossy toy, chibi overload, complex clothing, fantasy weapon
```

## 10. 文件命名

建议生成后按以下名字保存原图：

```text
art/source/project-workshop-anchor-v01.png
art/source/guild-anchor-v01.png
art/source/project-lab-v01.png
art/source/project-media-studio-v01.png
art/source/project-market-shop-v01.png
art/source/project-community-hall-v01.png
art/source/project-memorial-v01.png
art/source/skill-creative-v01.png
art/source/skill-technology-v01.png
art/source/skill-operations-v01.png
art/source/environment-props-v01.png
art/source/assistant-anchor-v01.png
```

不要覆盖旧图，修改后增加 `v02`、`v03`。

最终抠图与裁切资产放在：

```text
public/assets/town/papercraft/
```

## 11. 每张图的通用验收清单

- 视角与参考图一致。
- 光源方向一致。
- 奶油纸和深灰黑仍是主色。
- 材质能看出纸张、折痕和层叠边缘。
- 没有塑料感、黏土感和通用手游感。
- 单体轮廓清楚，缩小后仍可识别。
- 没有文字、乱码、数字和水印。
- 四周有足够留白，没有被裁切。
- 抠图背景是完全平整的纯色。
- 没有落地阴影；阴影由网页统一生成。

如果一张图有两个以上明显问题，废弃并重新生成；如果只有一个问题，使用参考图进行单变量编辑。

## 12. 第一轮最小交付

为了尽快得到可汇报画面，第一轮只需要生成：

1. 孤立项目工坊风格母版。
2. 冒险家公会。
3. 技术实验室。
4. 社区会馆。
5. 一个技能摊位。
6. 环境道具图集。

地图灰盒应当先于这些资产开始搭建。完成这 6 项后替换灰盒占位建筑并截图验收；确认方向成立，再补其他项目建筑和技能摊位，避免在视觉方向未锁定时浪费生成次数。
