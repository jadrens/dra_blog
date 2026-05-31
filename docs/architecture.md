# 项目架构文档

## 项目概述

这是一个基于 **Next.js 16 + React 19 + TypeScript** 构建的个人博客系统，支持中英文双语、Markdown/LaTeX 渲染、代码高亮、主题切换、文章搜索、目录导航等特性。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16.2.4, React 19.2.4, TypeScript 5 |
| 样式 | Tailwind CSS v4, MUI (Material-UI) v9 |
| 动画 | Framer Motion, Matter.js (物理引擎) |
| Markdown | react-markdown, remark-math, remark-gfm, rehype-katex, rehype-highlight, rehype-raw |
| 代码高亮 | Shiki |
| 数学公式 | KaTeX |
| 字体 | Nunito, Inter, JetBrains Mono, MiSans |
| 数据存储 | sql.js (浏览器内 SQLite) |
| 构建工具 | Bun (bun.lock) |

---

## 目录结构

```
├── content/posts/          # Markdown 博客文章
│   ├── en/                 # 英文文章
│   └── zh/                 # 中文文章
├── data/                   # 运行时数据
│   ├── search-index/       # 文章搜索索引 (JSON)
│   ├── views.db            # SQLite 浏览量数据库
│   └── pinyin_map.csv      # 拼音映射表
├── docs/                   # 项目文档
├── public/                 # 静态资源
│   ├── backgrounds/        # 首页物理背景 SVG 素材
│   ├── fonts/              # MiSans 字体文件
│   └── avatar.png          # 头像
├── scripts/
│   └── deploy.sh           # 部署脚本
├── src/
│   ├── app/                # Next.js App Router 页面
│   ├── components/         # React 组件
│   ├── hooks/              # 自定义 React Hooks
│   └── lib/                # 工具库、配置、数据层
├── next.config.ts          # Next.js 配置
├── postcss.config.mjs      # PostCSS 配置
├── eslint.config.mjs       # ESLint 配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 依赖管理
└── bun.lock                # Bun 锁文件
```

---

## 配置文件详解

### `next.config.ts`
Next.js 配置文件，仅配置了 `distDir: "build"`，指定构建输出目录为 `build/`。

### `tsconfig.json`
TypeScript 配置：
- `target: "ES2017"`, `jsx: "react-jsx"`
- `paths`: 配置 `@/*` 别名指向 `./src/*`
- `moduleResolution: "bundler"`
- `strict: true`

### `postcss.config.mjs`
PostCSS 配置，使用 `@tailwindcss/postcss` 插件处理 Tailwind CSS v4。

### `eslint.config.mjs`
ESLint 配置，使用 Next.js 内置的 ESLint 规则 (`eslint-config-next`)。

### `package.json`
项目依赖管理：
- `scripts.dev`: `next dev` — 开发服务器
- `scripts.build`: `next build` — 生产构建
- `scripts.start`: `next start` — 生产服务器
- `scripts.lint`: `eslint` — 代码检查

---

## `src/app/` — 页面路由 (App Router)

### `layout.tsx`
**根布局**，所有页面的外层包装：
- 加载 Google Fonts: Nunito (600/700), Inter (600/700)
- 加载 JetBrains Mono 字体和全局 CSS (`globals.css`, `katex.min.css`)
- 注入 `ThemeRegistry` (MUI 主题) 和 `I18nProvider` (国际化)
- 注入 `LoadingBar` (页面切换加载条)
- 设置站点 metadata (标题、描述)

### `page.tsx`
**首页 `/`**：
- 展示头像 + 彩色名字 (`StylizedName`)
- 背景是 `ConfettiBackground` (Matter.js 物理飘带)
- 包含 `Navbar` 和 `Footer`

### `about/page.tsx`
**关于页面 `/about`**：
- 展示个人头像、简介
- 社交链接列表 (GitHub, YouTube, Bilibili, Telegram, Email)
- 每个社交卡片带颜色主题和悬停动效

### `blog/[locale]/page.tsx`
**文章列表页 `/blog/en` 或 `/blog/zh`**：
- Server Component，接收 `locale` 参数 (`en` | `zh`)
- `generateMetadata`: 动态生成页面标题和描述
- `dynamic = "force-dynamic"`: 强制动态渲染
- 获取文章列表、浏览量、标签，传给 `BlogContent`

### `blog/[locale]/[slug]/page.tsx`
**文章详情页 `/blog/en/slug`**：
- Server Component，接收 `locale` 和 `slug` 参数
- `generateMetadata`: 从文章元数据生成标题
- 并行获取文章内容和浏览量 (`Promise.all`)
- 传给 `PostClient` 进行客户端渲染

### `blog/[locale]/[slug]/PostClient.tsx`
**文章详情客户端组件**：
- 展示文章标题、日期(相对时间)、浏览量、字数、标签
- 面包屑导航 (返回文章列表)
- 调用 `MarkdownContent` 渲染正文
- 集成 TOC 组件 (`TableOfContents`, `TableOfContentsDrawer`, `FloatingTOCButton`)
- 集成阅读进度 (`ReadingProgressBar`, `ReadingProgressProvider`)
- 集成返回顶部按钮 (`BackToTopButton`)
- 底部 "Edit on GitHub" 链接
- 页面加载时自动递增浏览量

### `blog/BlogContent.tsx`
**文章列表客户端组件**：
- 搜索框 (实时过滤标题/内容/标签)
- 排序切换 (最新/最旧)
- 标签筛选 (Popover 多选)
- 文章卡片列表 (Framer Motion 入场/退场动画)
- 搜索关键词高亮
- 展示日期、浏览量、标签

### `blog/actions.ts`
**Server Actions**：
- `getPosts(locale)` — 获取所有文章
- `getPostView(slug)` — 获取单篇文章浏览量
- `getAllViews()` — 获取所有文章浏览量
- `incrementView(slug)` — 递增浏览量
- 作为 `app/` 和 `lib/db.ts` 之间的桥梁，使客户端组件能调用数据层

### `api/search/route.ts`
**搜索 API 路由** (`GET /api/search?q=...&locale=...`)：
- 接收搜索关键词和语言参数
- 从搜索索引中按标题和标签过滤文章
- 返回匹配结果和全部标签列表
- 空查询时返回空结果和标签

### `robots.ts`
**SEO: robots.txt**
- 允许所有爬虫访问
- 指向 sitemap.xml

### `sitemap.ts`
**SEO: sitemap.xml**
- 动态生成站点地图
- 包含首页、关于页、各语言文章列表页、每篇文章详情页

### `error.tsx`
**错误页面**
- 捕获路由错误，显示彩色状态码 (Google 配色风格)
- 根据错误消息提取 HTTP 状态码
- 提供 "返回首页" 和 "重试" 按钮

### `not-found.tsx`
**404 页面**
- 类似 error.tsx 的视觉风格
- 显示 404 彩色数字
- "返回首页" 按钮

### `globals.css`
**全局样式**
- 导入 Tailwind CSS v4 (`@import "tailwindcss"`)
- 导入 `@tailwindcss/typography` 插件
- 定义 CSS 变量 (背景色、前景色) 和暗色模式
- 全局 `html` / `body` / `a` / `code` 样式
- 自定义滚动条样式 (MUI 组件中定义更详细的)
- 文字选中高亮样式

### `misans.css`
**MiSans 字体定义**
- 定义 `MiSans` 字体族的 9 个 weight (100~900)
- 使用 `woff2` 格式，带 `font-display: swap`

---

## `src/components/` — 组件

### `home/ConfettiBackground.tsx`
**首页物理飘带背景**
- 使用 **Matter.js** 物理引擎创建无重力环境
- 加载 24 种 SVG 图形 (线条、圆形、菱形、三角形)
- 每个图形作为一个刚体，带随机漂移和鼠标排斥效果
- Canvas 2D 渲染，全屏固定背景 (`z-0`)
- 窗口 resize 时自动调整

### `home/StylizedName.tsx`
**首页彩色名字**
- 将 "Jadren Rayne" 每个字母渲染为不同颜色
- 使用两组配色数组循环着色

### `content/MarkdownContent.tsx`
**Markdown 渲染器**
- 使用 `react-markdown` + `remark-math` + `remark-gfm` + `rehype-katex` + `rehype-highlight` + `rehype-raw`
- 自定义 heading 组件：带锚点 ID、点击平滑滚动、H1~H6 标签指示器
- 提取 heading 结构传给 `ReadingProgressContext`
- 监听滚动更新当前激活 heading
- 处理 URL hash 跳转
- MUI `Box` sx 样式定义了完整的 Markdown 排版样式

### `content/CodeBlock.tsx`
**代码块组件**
- 带语言标识图标 (MDI 图标，支持 TS/JS/Python/Rust/Go/Java/C/C++/Bash/HTML/CSS/JSON)
- 语言颜色区分 (亮色/暗色两套配色)
- 一键复制代码功能
- 自定义高亮 token 颜色 (VS Code 暗色风格)
- 代码区域最大高度 500px，支持横向滚动

### `layout/Navbar.tsx`
**导航栏**
- AppBar 固定顶部，毛玻璃背景
- 左侧：头像链接到首页
- 右侧(桌面端)：搜索框(⌘K 快捷键)、导航链接、语言切换、主题切换
- 右侧(移动端)：主题切换、语言切换、菜单按钮 → Drawer
- 搜索框：实时调用 `/api/search`，下拉结果列表，支持 Esc 关闭
- Drawer (移动端)：包含搜索框、带图标的导航列表、底部主题/语言切换

### `layout/Footer.tsx`
**页脚**
- 居中布局：头像(悬停放大)、版权信息、备案链接、GitHub 链接
- 邮箱 Chip 可点击
- 底部挂载 `BouncingAvatar` (彩蛋)

### `layout/LoadingBar.tsx`
**页面切换加载条**
- 监听 `usePathname` 变化
- 顶部 3px 渐变条，带滑入动画
- 300ms 后自动消失

### `layout/BouncingAvatar.tsx`
**页脚彩蛋**
- 点击页脚头像后触发
- 使用 Matter.js 创建一个圆形刚体(头像图片)
- 带重力，从页脚头像位置掉落，在屏幕内弹跳
- 点击头像附近可施加推力
- Canvas 全屏覆盖 (`z-[9999]`, `pointer-events: none`)

### `layout/Utils.tsx`
**工具组件**
- 仅有一个 `Text` 组件，给文字加 `text` className

### `layout/ThemeRegistry/ThemeRegistry.tsx`
**MUI 主题注册**
- 包裹 `ThemeProvider` (自定义) → `MuiThemeProvider` (MUI) → `CssBaseline`
- 定义完整的 light 和 dark 两套 MUI 主题配色
- 自定义滚动条样式 (hover 时显示，平时透明)
- 字体统一为 Nunito

### `layout/ThemeRegistry/ThemeProvider.tsx`
**主题状态管理**
- Context: `theme` (light/dark), `toggleTheme`
- 从 `localStorage` 读取主题偏好，回退到系统暗色模式
- 切换时同步到 `localStorage` 和 `document.documentElement[data-theme]`
- 未挂载时隐藏内容防止闪烁

### `navigation/LocaleSwitcher.tsx`
**语言切换器**
- IconButton + Menu 下拉
- 支持 `en` / `zh` 切换
- 如果在文章页，自动导航到对应语言版本的文章列表

### `navigation/ThemeToggle.tsx`
**主题切换按钮**
- IconButton，太阳/月亮图标
- Framer Motion `AnimatePresence` 切换动画 (旋转+缩放)

### `toc/TableOfContents.tsx`
**桌面端目录 (Sticky Sidebar)**
- 从 `ReadingProgressContext` 读取 heading 树
- 递归渲染可折叠的目录项
- 当前激活 heading 高亮
- sticky 定位在左侧，滚动时自动调整 top
- 智能展开：根据可用高度自动决定展开哪些层级
- 仅在桌面端显示 (`sm:` breakpoint)

### `toc/TableOfContentsDrawer.tsx`
**移动端目录抽屉**
- 左侧 Drawer，仅移动端显示
- 顶部 AppBar 带标题和关闭按钮
- 递归可折叠目录树
- 点击目录项后自动关闭 Drawer

### `toc/FloatingTOCButton.tsx`
**移动端浮动目录按钮**
- 固定在右下角 (bottom: 80, right: 24)
- 仅移动端显示
- 点击打开 `TableOfContentsDrawer`

### `reading/ReadingProgressBar.tsx`
**阅读进度条**
- 固定在页面右侧 (3px 宽)
- 从 `ReadingProgressContext` 读取进度百分比
- 高度随滚动实时变化

### `reading/ReadingProgressContext.tsx`
**阅读进度 Context**
- 管理 heading 树结构、当前激活 heading ID、阅读进度百分比
- `slugify()`: 将 heading 文本转为 URL-safe ID
- `extractHeadings()`: 从 Markdown 内容提取 H1~H3 层级树
- 激活 heading 时自动更新 URL hash (无刷新)

### `reading/BackToTopButton.tsx`
**返回顶部按钮**
- 滚动超过 400px 时显示
- MUI `Zoom` 过渡动画
- 固定在右下角 (在 TOC 按钮下方)

---

## `src/hooks/` — 自定义 Hooks

### `useScrollProgress.ts`
- 监听全局滚动，计算 `scrollTop / (docHeight - viewportHeight)`
- 将百分比写入 `ReadingProgressContext`

### `useHeadingObserver.ts`
- 使用 `IntersectionObserver` 监听 heading 元素进入视口
- rootMargin 设置 `-80px 0px -70% 0px`，确保在顶部区域触发的 heading 被识别
- 提供 `registerHeading` 方法注册要观察的元素

---

## `src/lib/` — 工具库

### `config.ts`
站点常量配置：
- `baseUrl`: 站点根 URL
- `siteName`, `description`
- `githubRepo`, `githubBranch` (用于 "Edit on GitHub" 链接)

### `posts.ts`
文章数据层：
- `getPostSlugs(locale)`: 从搜索索引获取所有文章 slug
- `getPostBySlug(slug, locale)`: 读取单个 Markdown 文件，返回完整 `Post` 对象
- `getAllPosts(locale)`: 读取所有 Markdown 文件
- 使用 `gray-matter` 解析 frontmatter

### `search-index.ts`
搜索索引管理：
- `getSearchIndex(locale, forceRefresh?)`: 获取或生成搜索索引
- 自动检测 `content/posts/` 目录修改时间，过期时重新生成
- 生成 `postsByDate` (按日期倒序) 和 `postsByTag` (标签分组)
- 索引持久化到 `data/search-index/index-{locale}.json`
- `getPostMeta`, `getPostsByTag`, `getAllTags`, `getAllPostsMeta`, `regenerateAllIndexes`

### `db.ts`
浏览量数据库：
- 使用 **sql.js** (WASM SQLite) 在服务端运行
- 数据库文件: `data/views.db`
- `getPostViews(slug)`: 获取单篇文章浏览量
- `incrementPostViews(slug)`: 递增浏览量 (INSERT 或 UPDATE)
- `getAllPostViews()`: 获取所有文章浏览量映射

### `i18n/index.tsx`
国际化 Context：
- `I18nProvider`: 管理 `locale` 状态，从 `localStorage` 读取，回退到浏览器语言
- `useI18n()`: 获取当前语言、切换函数、翻译文本
- `normalizeLocale()`: `zh*` → `zh`，其他 → `en`

### `i18n/en.ts` / `i18n/zh.ts`
翻译字典：
- 完全相同的结构，`zh.ts` 继承 `en.ts` 的类型
- 覆盖: nav, blog, theme, about, home, footer, toc, blogPage, search, notFound, error, codeBlock

---

## `content/posts/` — 博客内容

Markdown 文章存放目录，按语言分子目录：
- `en/`: 英文文章
- `zh/`: 中文文章

每篇文章是独立的 `.md` 文件，frontmatter 格式：
```yaml
---
title: "文章标题"
date: "2024-01-01"
tags: ["tag1", "tag2"]
---

正文内容...
```

文件名即 `slug`，用于 URL 路由。

---

## `data/` — 运行时数据

### `search-index/index-en.json` / `index-zh.json`
由 `search-index.ts` 自动生成的文章索引 JSON。

### `views.db`
SQLite 数据库文件，由 `db.ts` 自动生成/维护。

### `pinyin_map.csv`
中文拼音映射表，可能用于排序或搜索。

---

## `public/` — 静态资源

### `backgrounds/confetti/`
24 个 SVG 图形文件，供 `ConfettiBackground` 使用。

### `fonts/`
MiSans 字体族的 9 个 weight 的 `woff2` 文件。

### `avatar.png`
用户头像，多处引用。

---

## `scripts/deploy.sh`
部署脚本 (内容未读取，推测用于服务器部署/同步)。

---

## 数据流

```
content/posts/{locale}/*.md
         ↓
   search-index.ts  (构建/请求时生成索引)
         ↓
   posts.ts (读取 Markdown + frontmatter)
         ↓
   Server Component (page.tsx)
         ↓
   Client Component (PostClient / BlogContent)
         ↓
   MarkdownContent → react-markdown → 渲染 HTML
         ↓
   ReadingProgressContext ← heading 结构 / 滚动进度
         ↓
   TableOfContents / ReadingProgressBar
```

浏览量统计:
```
Client → Server Action (actions.ts) → db.ts (sql.js SQLite) → data/views.db
```

搜索:
```
Navbar 搜索框 → fetch /api/search → search-index.ts → 返回结果
```

---

## 开发注意事项

1. **sql.js 依赖 WASM 文件**: 部署时需确保 `node_modules/sql.js/dist/sql-wasm.wasm` 可被访问。浏览量统计仅在服务端运行时有效。

2. **搜索索引懒生成**: `search-index.ts` 只在请求时检查内容修改时间并决定是否需要重新生成索引，首次请求可能稍慢。

3. **暗色模式**: 通过 `data-theme="dark"` 属性 + MUI ThemeProvider 两套机制同时控制。`globals.css` 定义了 CSS 变量级别的暗色，`ThemeRegistry.tsx` 定义了 MUI 组件级别的暗色。

4. **Matter.js Canvas**: `ConfettiBackground` 和 `BouncingAvatar` 各使用独立的 Matter.js 引擎实例，互不影响。

5. **Tailwind CSS v4**: 使用新的 `@import "tailwindcss"` 语法和 `@theme inline` 定义变量，与 v3 不同。

6. **字体加载顺序**: `globals.css` 中 `body` 的 `font-family` 优先级：`--font-inter` > `MiSans` > `--font-nunito`。
