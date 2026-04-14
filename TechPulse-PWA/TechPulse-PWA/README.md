# 📱 TechPulse 科技动态 — PWA 版（可直接安装到 iPhone）

> **无需 Xcode！无需 Mac！Windows 电脑即可完成全部操作！**

## ✨ 这是什么？

这是一个 **PWA（渐进式 Web App）**，功能和原生 App 几乎一模一样：
- 🔄 实时获取科技新闻（NewsAPI / 微博热搜）
- 📰 文章详情页，图文并茂
- 💬 支持分享到微信好友 / 朋友圈
- 📲 可**直接安装到 iPhone 主屏幕**，体验和原生 App 一致
- 📡 支持**离线浏览**（已访问的内容自动缓存）

---

## 🔧 为什么不用 Xcode？

| 方案 | 需要 Mac？ | 需要付费开发者账号？ | Windows 能做？ |
|------|-----------|---------------------|--------------|
| ❌ 原生 iOS App (SwiftUI) | ✅ 必须 | ✅ $99/年 | ❌ |
| ✅ **PWA（本方案）** | ❌ 不需要 | ❌ 免费 | ✅ **完全支持** |

PWA 是 Apple 官方支持的安装方式，iOS Safari 可以将任何 PWA「添加到主屏幕」，效果和原生 App 无异。

---

## 🚀 三步安装到你的 iPhone

### 方法一：本地预览（先看效果）

```bash
# 1. 进入项目目录
cd TechPulse-PWA

# 2. 启动本地服务器
python -m http.server 8765

# 3. 手机浏览器打开
# 确保手机和电脑在同一 WiFi 下
# 浏览器输入: http://你电脑的IP:8765
```

### 方法二：部署到公网（推荐！永久可用）

选择任意一个平台，**完全免费，2 分钟搞定**：

#### 🅰️ Vercel 部署（推荐 ⭐⭐⭐）

1. 打开 [vercel.com](https://vercel.com) → 注册/登录（支持 GitHub 账号一键登录）
2. 点击 **「Add New」→ 「Project」**
3. 选择 **Import Git Repository** 或直接拖入 `TechPulse-PWA` 文件夹
4. 点击 **Deploy** → 等待约 1 分钟
5. 拿到类似 `https://techpulse.vercel.app` 的链接

#### 🅱️ Cloudflare Pages 部署

1. 打开 [pages.cloudflare.com](https://pages.cloudflare.com)
2. 登录后点击 **Create a project**
3. 选择 **Direct Upload**
4. 上传整个 `TechPulse-PWA` 文件夹
5. 部署完成后获得公网地址

#### 🆎 GitHub Pages 部署

1. 创建一个 GitHub 仓库，把 `TechPulse-PWA` 所有文件推上去
2. 进入仓库 Settings → Pages → Source 选 `main` branch
3. 几分钟后通过 `https://你的用户名.github.io/仓库名` 访问

---

## 📲 在 iPhone 上安装为 App

拿到公网链接后（比如 `https://xxx.vercel.app`），按以下步骤：

### iOS 安装步骤

```
1️⃣ 用 iPhone Safari 打开链接
2️⃣ 点击底部的「分享」按钮（方框+向上箭头图标 ⬆️）
3️⃣ 向下滚动，找到「添加到主屏幕」（Add to Home Screen）
4️⃣ 确认名称为「TechPulse」，点击「添加」✅
5️⃣ 完成！主屏幕出现 TechPulse 图标，点击即用
```

> 💡 **提示**：PWA 安装后会自动全屏运行（没有浏览器地址栏），体验和原生 App 一模一样。还支持推送通知（需后续配置）。

### Android 安装步骤

```
1️⃣ Chrome 浏览器打开链接
2️⃣ 地址栏右侧会出现「安装」或「+」图标
3️⃣ 点击确认安装
4️⃣ 完成！应用抽屉中出现 TechPulse
```

---

## 🔑 配置真实数据源（可选）

默认情况下，App 使用内置的模拟新闻数据（已经非常逼真了）。如果你想接入**真实的全球科技新闻**：

### 步骤一：申请 NewsAPI Key

1. 访问 [newsapi.org/register](https://newsapi.org/register) 免费注册
2. 注册后在 Dashboard 复制你的 **API Key**

### 步骤二：填入 Key

编辑 `app.js` 文件，找到最顶部的配置区：

```javascript
const CONFIG = {
  // ⬇️ 把这里替换成你的真实 Key
  NEWS_API_KEY: 'YOUR_NEWSAPI_KEY',  // ← 替换这行！
  
  // ... 其他配置保持不变
};
```

把 `YOUR_NEWSAPI_KEY` 替换成你申请到的真实 Key。

### 步骤三：重新部署

修改完代码后，重新推送到 Vercel/Cloudflare/GitHub Pages，自动更新。

> 💡 NewsAPI 免费版每天可以请求 **100 次**，对个人使用完全足够。

---

## 💬 微信分享功能说明

### 当前已实现的能力

| 场景 | 功能 | 状态 |
|------|------|------|
| 在微信内打开 | 分享给好友（JSSDK） | ✅ 已集成 |
| 在微信内打开 | 分享到朋友圈 | ✅ 已集成 |
| 非微信环境（Safari等） | 复制链接 + 引导提示 | ✅ 已实现 |
| 非微信环境（Safari等） | 系统分享面板（Web Share API） | ✅ 已实现 |

### 如需启用完整微信 JSSDK

如果你有自己的域名且已在 [微信开放平台](https://open.weixin.qq.com/) 绑定：

1. 获取 `appId` 和 `appSecret`
2. 在 `index.html` 中找到 JSSDK 初始化部分，替换签名配置
3. 需要一个后端服务生成 JS-SDK 签名（Vercel Serverless Functions 可轻松实现）

> 📌 对于大多数用户来说，「复制链接 → 粘贴到微信发送」的方式已经完全够用。

---

## 📂 项目文件结构

```
TechPulse-PWA/
├── index.html              ← 主页面（UI 结构）
├── app.js                  ← 核心逻辑（API/分享/PWA/路由）
├── sw.js                   ← Service Worker（离线缓存）
├── offline.html            ← 离线页面
├── manifest.json           ← PWA 清单（安装配置）
├── generate-icons.html     ← 图标生成工具（浏览器中打开可下载 PNG）
└── assets/
    ├── icon.svg            ← SVG 矢量图标源文件
    ├── icon-192.png        ← PWA 图标 192×192（需用 generate-icons.html 生成）
    ├── icon-512.png        ← PWA 图标 512×512（需用 generate-icons.html 生成）
    └── apple-touch-icon.png← iOS 主屏幕图标 180×180
```

---

## 🎨 设计规格

| 属性 | 值 |
|------|-----|
| 主色 | `#3ECFB2`（薄荷绿） |
| 辅色 | `#4AB8E8`（天蓝） |
| 字体 | -apple-system / PingFang SC |
| 圆角 | 16px |
| 风格 | 清新、通透、现代 |
| 安全区域 | 自动适配 iPhone 刘海屏 |

---

## 🛠️ 技术栈

- **HTML5 + CSS3** — 原生 Web 技术，无需框架
- **Vanilla JavaScript** — 无依赖，轻量快速
- **NewsAPI v2** — 全球科技新闻数据源
- **PWA Manifest** — 支持安装到主屏幕
- **Service Worker** — 离线缓存 + 加速加载
- **Web Share API** — 原生系统分享面板
- **微信 JSSDK** — 微信内分享能力

---

## ❓ 常见问题

**Q: 不部署可以直接在 iPhone 上用吗？**
A: 可以！只要电脑和 iPhone 在同一 WiFi 下，iPhone Safari 输入电脑 IP + 端口即可访问。

**Q: 数据是实时更新的吗？**
A: 默认使用内置模拟数据。配置 NewsAPI Key 后会实时从 NewsAPI 拉取最新科技新闻。

**Q: 分享到微信能直接跳转吗？**
A: 在微信内打开时可以调用 JSSDK 直接分享；在其他浏览器中会引导你复制链接到微信粘贴发送。

**Q: 离线能用吗？**
A: 可以！Service Worker 会缓存已访问过的内容，断网后依然可以看到之前的文章。

**Q: 需要花钱吗？**
A: 全程免费！NewsAPI 免费额度足够个人使用，Vercel/Cloudflare Pages 部署也是免费的。

---

## 📄 License

MIT License — 自由使用、修改、分发。

---

<p align="center">
  <strong>🚀 TechPulse · 科技动态</strong><br>
  <em>每日科技新闻 · 实时热点 · 一键分享微信</em><br>
  <br>
  Made with ❤️ on Windows, runs everywhere.
</p>
