/**
 * ============================================================
 *  TechPulse · 科技动态 - PWA 版
 *  功能：实时科技新闻 | 微信分享 | PWA 安装 | 离线缓存
 * ============================================================
 */

// ==================== 配置 ====================
const CONFIG = {
  // ⬇️ 在这里填入你的 NewsAPI Key（免费申请：https://newsapi.org/register）
  NEWS_API_KEY: '035b245c3dc949b09029e56f69be97cd',
  
  // 数据源 URL（无需后端，前端直接请求）
  NEWS_API: 'https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=20&page=1',
  
  // 掘金 RSS（通过 Rsshub 中转）
  JUEJIN_RSS: 'https://rsshub.app/juejin/tag/前端',
  
  // 微博热搜 API
  WEIBO_HOT: 'https://weibo.com/ajax/side/hotSearch',
  
  // 当前选中的分类
  activeCategory: 'all'
};

// ==================== 分类定义 ====================
const CATEGORIES = [
  { id: 'all', name: '🌐 全部' },
  { id: 'ai', name: '🤖 AI' },
  { id: 'mobile', name: '📱 移动互联网' },
  { id: 'hardware', name: '💻 硬件设备' },
  { id: 'internet', name: '🌍 互联网' },
  { id: 'blockchain', name: '⛓️ 区块链' }
];

// ==================== 模拟数据（当 API Key 未配置时使用） ====================
const MOCK_NEWS = [
  {
    title: 'OpenAI 发布 GPT-5：推理能力提升 10 倍，支持多模态实时交互',
    source: 'TechCrunch',
    url: '#',
    urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    publishedAt: new Date().toISOString(),
    description: 'OpenAI 正式发布新一代大语言模型 GPT-5，在复杂推理、代码生成和多模态理解方面取得重大突破。新模型支持长达 128K 的上下文窗口，响应速度提升 40%。',
    content: '<p>OpenAI 今日正式发布了备受期待的 GPT-5 大语言模型。据官方介绍，GPT-5 在多个基准测试中均取得了突破性进展。</p><p>主要升级包括：</p><p>1. <strong>推理能力飞跃</strong>：在 MMLU 基准测试中准确率达到 92.3%，较上一代提升了近 10 个百分点。</p><p>2. <strong>多模态深度融合</strong>：支持文本、图像、音频和视频的统一理解和生成，可进行实时视频分析。</p><p>3. <strong>代码能力增强</strong>：在 HumanEval 编程测试中通过率达到 95%，几乎可以独立完成中大型项目的开发任务。</p><p>GPT-5 已向 Plus 用户开放体验，企业版 API 也同步上线。业界普遍认为这将加速 AI 在各行各业的落地应用。</p>',
    tags: ['人工智能', 'OpenAI', '大模型'],
    category: 'ai'
  },
  {
    title: '苹果 WWDC 2026 亮点汇总：iOS 20 全新设计语言 + Siri 大改版',
    source: 'The Verge',
    url: '#',
    urlToImage: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    description: '苹果年度开发者大会带来重磅更新：iOS 20 引入全新玻璃态设计语言，Siri 集成 Apple Intelligence 3.0，支持更自然的对话交互。',
    content: '<p>苹果今日凌晨召开 WWDC 2026 全球开发者大会，发布了 iOS 20、macOS 16、watchOS 13 和 visionOS 3 等一系列系统更新。</p><p><strong>iOS 20 最大亮点：</strong></p><ul><li>全新「玻璃态」设计语言，界面更加通透轻盈</li><li>Siri 全面集成 Apple Intelligence 3.0，支持跨 App 操作</li><li>控制中心重新设计，支持更多自定义模块</li><li>信息 App 支持 AI 自动摘要长对话</li></ul><p>新系统将于下周推送 Beta 测试版，正式版预计 9 月随 iPhone 18 系列一同发布。</p>',
    tags: ['苹果', 'iOS', 'WWDC'],
    category: 'mobile'
  },
  {
    title: '英伟达 RTX 5090 性能实测：光追性能翻倍，AI 渲染革命性突破',
    source: 'Digital Trends',
    url: '#',
    urlToImage: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    description: '英伟达最新旗舰显卡 RTX 5090 首批评测出炉，采用 Blackwell 架构，光线追踪性能较上代翻倍，DLSS 4.0 支持帧生成 3.0 技术。',
    content: '<p>英伟达 GeForce RTX 5090 的首批媒体评测解禁，这款基于 Blackwell 架构的旗舰显卡展现出了惊人的性能表现。</p><p><strong>关键参数：</strong></p><ul><li>GPU：GB202 核心，21760 CUDA 核心</li><li>显存：32GB GDDR7，带宽超过 1TB/s</li><li>TDP：575W（公版）</li></ul><p>在 4K 分辨率下，RTX 5090 相比 RTX 4090 平均性能提升约 55-70%，光线追踪场景下优势更为明显。DLSS 4.0 的帧生成 3.0 技术更是让游戏帧率轻松突破 200 FPS。</p>',
    tags: ['显卡', '英伟达', '硬件'],
    category: 'hardware'
  },
  {
    title: '马斯克宣布 xAI Grok-4 开源：全球首个万亿参数开源大模型',
    source: 'Wired',
    url: '#',
    urlToImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    description: '埃隆·马斯克旗下 AI 公司 xAI 宣布将 Grok-4 大模型完全开源，成为全球首个达到万亿参数级别的开源模型，对行业格局将产生深远影响。',
    content: '<p>xAI 创始人埃隆·马斯克在 X 平台宣布，Grok-4 大模型将采用 Apache 2.0 协议完全开源，任何人都可以自由使用和修改。</p><p>Grok-4 拥有 1.2 万亿参数，在多项基准测试中的成绩已经超越或持平 GPT-5 和 Claude 4 Opus。开源后，预计将有大量开发者和研究机构在此基础上进行二次创新。</p><p>这一决定被业界视为 AI 开源运动的重要里程碑，可能加速整个行业的民主化进程。</p>',
    tags: ['开源', 'xAI', '大模型'],
    category: 'ai'
  },
  {
    title: '字节跳动 Seedance 2.0 视频生成模型发布：15秒 4K 视频一键生成',
    source: '36氪',
    url: '#',
    urlToImage: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&q=80',
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    description: '字节跳动旗下火山引擎发布 Seedance 2.0 视频生成模型，支持最高 4K 分辨率、15秒时长的视频生成，画面质量接近实拍级别。',
    content: '<p>字节跳动今日正式发布 Seedance 2.0 视频生成模型，这是目前公开可用的最强中文视频生成模型之一。</p><p><strong>核心能力：</strong></p><ul><li>支持最长 15 秒、4K 分辨率的连贯视频生成</li><li>文字描述到视频的转化精度大幅提升</li><li>支持角色一致性和镜头运动的精确控制</li><li>已接入豆包 App 和即梦平台供用户免费体验</li></ul><p>该模型的推出标志着国产 AI 视频生成技术进入了一个新的阶段。</p>',
    tags: ['AI视频', '字节跳动', 'AIGC'],
    category: 'ai'
  },
  {
    title: '特斯拉 FSD V14 中国获批：全自动驾驶终于合法上路',
    source: '财新网',
    url: '#',
    urlToImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    description: '工信部正式批准特斯拉 Full Self-Driving V14 在中国部分城市开展商业化运营，这标志着 L4 级自动驾驶在中国首次获得路权许可。',
    content: '<p>工信部今日发布公告，正式批准特斯拉 FSD（Full Self-Driving）V14 版本在北京、上海、深圳、广州等一线城市开展商业化运营。</p><p>FSD V14 是特斯拉目前最先进的自动驾驶系统，采用了纯视觉方案（无激光雷达），实现了端到端的神经网络驾驶策略。根据美国测试数据，FSD V14 的干预里程已超过 1000 英里。</p><p>这一批准被视为中国智能网联汽车产业发展的标志性事件，有望推动国内自动驾驶法规的进一步完善。</p>',
    tags: ['特斯拉', '自动驾驶', '新能源车'],
    category: 'hardware'
  },
  {
    title: 'WebAssembly 3.0 标准 W3C 正式发布：浏览器运行原生应用时代来临',
    source: 'InfoQ',
    url: '#',
    urlToImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    description: 'W3C 正式发布 WebAssembly 3.0 规范，新增垃圾回收支持、线程并行和组件模型，浏览器可以直接运行 Rust/C++/Go 编写的原生级应用。',
    content: '<p>万维网联盟（W3C）今日正式推荐 WebAssembly 3.0 成为 Web 标准。这一版本带来了三个重大更新：</p><ol><li><strong>GC 支持</strong>：WebAssembly 可以直接使用垃圾回收内存管理，Rust、Go 等语言的集成更加顺畅</li><li><strong>线程并行</strong>：原生支持多线程共享内存，充分利用多核 CPU</li><li><strong>组件模型</strong>：跨语言组件互操作标准，不同语言编写的模块可以直接组合</li></ol><p>这意味着未来的 Web 应用可以达到近乎原生的性能，Chrome、Firefox、Safari 等主流浏览器均已开始实现。</p>',
    tags: ['Web技术', 'W3C', '前端'],
    category: 'internet'
  },
  {
    title: '比特币突破 $180,000：机构资金持续涌入，ETF 资产规模创历史新高',
    source: 'CoinDesk',
    url: '#',
    urlToImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80',
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
    description: '比特币价格历史性突破 18 万美元关口，现货 ETF 单周净流入超 30 亿美元，华尔街机构配置比例持续攀升。',
    content: '<p>比特币价格在北京时间今晨突破 $180,000 大关，创下历史新高。市场分析师认为，推动本轮上涨的核心因素是机构资金的持续流入。</p><p>数据显示，美国比特币现货 ETF 上周净流入超过 30 亿美元，累计资产管理规模已突破 1500 亿美元。贝莱德（BlackRock）的 IBIT 产品已成为史上增长最快的 ETF。</p><p>与此同时，MicroStrategy 再次宣布增购价值 10 亿美元的比特币，其持仓总量已达 45 万枚以上。</p>',
    tags: ['比特币', '加密货币', '金融科技'],
    category: 'blockchain'
  }
];

// 热搜模拟数据
const MOCK_HOT_SEARCH = [
  { rank: 1, word: 'GPT-5正式发布', hot: '985万' },
  { rank: 2, word: 'iOS20全新设计', hot: '852万' },
  { rank: 3, word: 'RTX5090评测', hot: '720万' },
  { rank: 4, word: '马斯克开源Grok4', hot: '658万' },
  { rank: 5, word: 'Seedance视频生成', hot: '520万' },
  { rank: 6, word: 'FSD中国获批', hot: '486万' },
  { rank: 7, word: 'WebAssembly3.0', hot: '350万' },
  { rank: 8, word: '比特币破18万', hot: '310万' }
];

// 热门话题模拟数据
const MOCK_TOPICS = [
  { emoji: '🤖', name: '人工智能', count: '2.3万讨论' },
  { emoji: '📱', name: '智能手机', count: '1.8万讨论' },
  { emoji: '💻', name: '芯片半导体', count: '1.5万讨论' },
  { emoji: '🚀', name: '商业航天', count: '9800讨论' },
  { emoji: '🔋', name: '固态电池', count: '8500讨论' },
  { emoji: '🧬', name: '基因编辑', count: '7200讨论' }
];

// ==================== 工具函数 ====================
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return `${days}天前`;
}

function showToast(msg, icon = '✅') {
  const toast = document.getElementById('toastMsg');
  document.getElementById('toastText').textContent = msg;
  document.getElementById('toastIcon').textContent = icon;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ==================== Tab 导航 ====================
function switchTab(el) {
  // 切换 tab 样式
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  
  // 切换页面
  const targetId = el.dataset.tab;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(targetId).classList.add('active');
  
  // 显示/隐藏底部操作栏
  const actionBar = document.getElementById('actionBar');
  if (actionBar) actionBar.style.display = targetId === 'pageDetail' ? 'flex' : 'none';
}

// ==================== 新闻列表渲染 ====================
function renderNewsList(news) {
  const listEl = document.getElementById('newsList');
  
  if (!news || news.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center;padding:60px 16px;color:#999;">
        <div style="font-size:48px;margin-bottom:12px;">📭</div>
        <div style="font-size:15px;">暂无新闻数据</div>
        <div style="font-size:12px;color:#bbb;margin-top:6px;">请检查网络连接或稍后再试</div>
      </div>`;
    return;
  }

  listEl.innerHTML = news.map(item => `
    <article class="news-card" onclick="openArticle(${JSON.stringify(item).replace(/"/g, '&quot;')})">
      <img class="news-card-img" src="${item.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'}" alt="" onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'" loading="lazy">
      <div class="news-card-body">
        <div class="news-card-source">${item.source?.name || item.source || 'TechPulse'}</div>
        <h3 class="news-card-title">${item.title}</h3>
        <div class="news-card-footer">
          <span class="news-time">${timeAgo(item.publishedAt)}</span>
          <span class="news-tag">${item.category || '科技'}</span>
        </div>
      </div>
    </article>
  `).join('');
}

// 渲染加载骨架屏
function renderSkeleton(count = 4) {
  const listEl = document.getElementById('newsList');
  listEl.innerHTML = Array(count).fill('').map(() => `
    <div class="sk-card"><div class="loading-skeleton sk-img"></div>
    <div class="sk-body">
      <div class="loading-skeleton sk-line short"></div>
      <div class="loading-skeleton sk-line medium"></div>
      <div class="loading-skeleton sk-line long"></div>
    </div></div>
  `).join('');
}

// ==================== 分类标签栏 ====================
function renderCategories() {
  const bar = document.getElementById('categoryBar');
  bar.innerHTML = CATEGORIES.map(cat =>
    `<button class="category-chip ${cat.id === CONFIG.activeCategory ? 'active' : ''}" 
     data-cat="${cat.id}" onclick="selectCategory(this)">${cat.name}</button>`
  ).join('');
}

function selectCategory(el) {
  CONFIG.activeCategory = el.dataset.cat;
  document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  fetchNews();
}

// ==================== 热搜条 ====================
function renderHotline() {
  const scroll = document.getElementById('hotScroll');
  scroll.innerHTML = MOCK_HOT_SEARCH.map(h => `
    <div class="hot-item"><span class="hot-num">${h.rank}</span>${h.word}</div>
  `).join('');
}

// ==================== 发现页渲染 ====================
function renderDiscoverPage() {
  // 热门话题 Grid
  document.getElementById('topicGrid').innerHTML = MOCK_TOPICS.map(t => `
    <div class="topic-item"><div class="topic-emoji">${t.emoji}</div>
    <div class="topic-name">${t.name}</div><div class="topic-count">${t.count}</div></div>
  `).join('');

  // 排行榜
  document.getElementById('rankList').innerHTML = MOCK_HOT_SEARCH.map((h, i) => `
    <div class="rank-item">
      <span class="rank-num ${i < 3 ? 'top'+(i+1) : 'normal'}">${h.rank}</span>
      <div class="rank-info">
        <div class="rank-title">${h.word}</div>
        <div class="rank-heat">热度 ${h.hot}</div>
      </div>
      ${i < 3 ? `<span class="rank-badge">热</span>` : ''}
    </div>
  `).join('');
}

// ==================== 文章详情页 ====================
let currentArticle = null;

function openArticle(article) {
  currentArticle = article;
  
  // 更新 OG 标签（用于微信分享）
  document.getElementById('og-title').setAttribute('content', article.title);
  document.getElementById('og-desc').setAttribute('content', article.description || '');
  document.getElementById('og-image').setAttribute('content', article.urlToImage || '');

  // 渲染详情
  document.getElementById('detailCover').src = article.urlToImage || '';
  
  const bodyHtml = `
    <div class="detail-meta">
      <span class="detail-source">${article.source?.name || article.source || 'TechPulse'}</span>
      <span class="detail-date">${new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>
    </div>
    <h1 class="detail-headline">${article.title}</h1>
    ${(article.tags || []).map(t => `<span class="detail-tag">#${t}</span>`).join('')}
    <div class="divider-line"></div>
    <div class="article-body">${article.content || article.description || ''}</div>
  `;
  document.getElementById('detailBody').innerHTML = bodyHtml;

  // 切换页面
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('pageDetail').classList.add('active');
  document.getElementById('actionBar').style.display = 'flex';

  // 重置点赞状态
  const likeBtn = document.getElementById('likeBtn');
  likeBtn.classList.remove('liked');
  likeBtn.querySelector('span').textContent = '点赞';
}

function goBack() {
  document.getElementById('pageDetail').classList.remove('active');
  document.getElementById('pageHome').classList.add('active');
  document.querySelector('.tab-item[data-tab="pageHome"]').classList.add('active');
  document.getElementById('actionBar').style.display = 'none';
}

function toggleLike(btn) {
  btn.classList.toggle('liked');
  btn.querySelector('span').textContent = btn.classList.contains('liked') ? '已点赞' : '点赞';
  showToast(btn.classList.contains('liked') ? '❤️ 点赞成功' : '已取消点赞', btn.classList.contains('liked') ? '❤️' : '💔');
}

// ==================== 搜索功能 ====================
function handleSearch(query) {
  if (!query.trim()) {
    renderNewsList(currentNewsData);
    return;
  }
  const filtered = (currentNewsData || MOCK_NEWS).filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    (n.description || '').toLowerCase().includes(query.toLowerCase())
  );
  renderNewsList(filtered);
}

// ==================== 分享功能 ====================
function openShareSheet() {
  document.getElementById('shareOverlay').classList.add('show');
  document.getElementById('shareSheet').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeShareSheet() {
  document.getElementById('shareOverlay').classList.remove('show');
  document.getElementById('shareSheet').classList.remove('show');
  document.body.style.overflow = '';
}

// 微信分享（微信内打开时调用 JSSDK）
function shareToWechat(scene) {
  closeShareSheet();
  
  const article = currentArticle;
  const shareData = {
    title: article.title,
    desc: article.description || '来自 TechPulse 科技动态',
    link: location.href,
    imgUrl: article.urlToImage || ''
  };

  // 检查是否在微信环境且微信 SDK 可用
  if (typeof wx !== 'undefined' && wx.ready) {
    wx.ready(function () {
      wx.onMenuShareAppMessage({
        title: shareData.title,
        desc: shareData.desc,
        link: shareData.link,
        imgUrl: shareData.imgUrl,
        success: function () { showToast('✅ 分享成功！'); }
      });
      
      if (scene === 'timeline') {
        wx.onMenuShareTimeline({
          title: shareData.title,
          link: shareData.link,
          imgUrl: shareData.imgUrl,
          success: function () { showToast('✅ 分享到朋友圈成功！'); }
        });
      }
      
      // 触发菜单
      if (scene === 'timeline') {
        wx.call({ name: 'shareTimeline' });
      } else {
        wx.call({ name: 'sendAppMessage', data: shareData });
      }
    });
  } else {
    // 非微信环境：提示引导
    showWechatGuide(scene);
  }
}

// 微信分享引导弹窗
function showWechatGuide(scene) {
  const guideText = scene === 'timeline' 
    ? '请在微信中打开此页面，点击右上角「...」→「分享到朋友圈」' 
    : '请在微信中打开此链接，即可直接分享给好友';
  
  showToast(guideText, '💡');
  
  // 同时复制链接作为备选
  copyLink();
}

// 复制链接
async function copyLink() {
  closeShareSheet();
  const text = currentArticle 
    ? `${currentArticle.title}\n${location.href}\n\n— 来自 TechPulse 科技动态`
    : location.href;
  
  try {
    await navigator.clipboard.writeText(text);
    showToast('📋 链接已复制到剪贴板', '✅');
  } catch (e) {
    // 兼容旧浏览器
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('📋 链接已复制', '✅');
  }
}

// 系统分享（iOS Safari / Android Chrome）
async function systemShare() {
  closeShareSheet();
  
  if (!navigator.share) {
    showToast('当前浏览器不支持系统分享，已复制链接', '💡');
    copyLink();
    return;
  }

  try {
    await navigator.share({
      title: currentArticle?.title || 'TechPulse 科技动态',
      text: currentArticle?.description || '',
      url: location.href
    });
  } catch (err) {
    // 用户取消分享，忽略
  }
}

// ==================== NewsAPI 真实数据请求 ====================
let currentNewsData = [];

async function fetchNews() {
  renderSkeleton(4);

  // 如果没有配置 API Key，使用模拟数据
  if (!CONFIG.NEWS_API_KEY || CONFIG.NEWS_API_KEY === 'YOUR_NEWSAPI_KEY') {
    await delay(800); // 模拟网络延迟
    
    let filtered = [...MOCK_NEWS];
    if (CONFIG.activeCategory !== 'all') {
      filtered = filtered.filter(n => n.category === CONFIG.activeCategory);
    }
    
    currentNewsData = filtered;
    renderNewsList(filtered);
    return;
  }

  // 使用真实 NewsAPI
  try {
    let apiUrl = CONFIG.NEWS_API + '&apiKey=' + CONFIG.NEWS_API_KEY;
    if (CONFIG.activeCategory !== 'all') {
      // NewsAPI 使用 technology 作为主分类，子分类通过 q 参数筛选
      apiUrl += '&q=' + getCategoryQuery(CONFIG.activeCategory);
    }

    const res = await fetch(apiUrl);
    const json = await res.json();

    if (json.status === 'ok' && json.articles) {
      currentNewsData = json.articles.map(a => ({
        ...a,
        category: guessCategory(a),
        tags: extractTags(a)
      }));
      renderNewsList(currentNewsData);
    } else {
      throw new Error(json.message || 'API 错误');
    }
  } catch (err) {
    console.warn('NewsAPI 请求失败，使用本地数据:', err.message);
    currentNewsData = MOCK_NEWS.filter(n => 
      CONFIG.activeCategory === 'all' || n.category === CONFIG.activeCategory
    );
    renderNewsList(currentNewsData);
    showToast('网络异常，显示本地缓存数据', '📡');
  }
}

function getCategoryQuery(catId) {
  const map = { ai: 'AI OR artificial intelligence', mobile: 'smartphone OR mobile', hardware: 'chip OR GPU OR hardware', internet: 'internet OR web', blockchain: 'crypto OR blockchain' };
  return map[catId] || '';
}

function guessCategory(article) {
  const text = (article.title + ' ' + (article.description || '')).toLowerCase();
  if (/ai|artificial|intelligence|gpt|llm|openai/.test(text)) return 'ai';
  if (/iphone|ios|android|mobile|phone|app/.test(text)) return 'mobile';
  if (/chip|gpu|cpu|nvidia|apple|m1|m2|m3|hardware/.test(text)) return 'hardware';
  if (/bitcoin|crypto|blockchain/.test(text)) return 'blockchain';
  return 'internet';
}

function extractTags(article) {
  const text = article.title;
  const tags = [];
  if (/AI|人工智能|GPT|LLM|大模型/i.test(text)) tags.push('人工智能');
  if (/苹果|Apple|iPhone|iOS|iPad/i.test(text)) tags.push('苹果');
  if (/安卓|Android|华为|小米/i.test(tags.join())) tags.push('移动');
  if (/芯片|NVIDIA|英伟达|GPU|显卡/i.test(text)) tags.push('硬件');
  if (/加密货币|比特币|区块链/i.test(text)) tags.push('区块链');
  if (tags.length === 0) tags.push('科技');
  return tags.slice(0, 3);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ==================== 刷新功能 ====================
async function refreshNews() {
  showToast('正在刷新...', '🔄');
  await fetchNews();
  await fetchWeiboHot(); // 同时刷新热搜
  showToast('✅ 刷新完成！');
}

// ==================== 获取微博热搜 ====================
async function fetchWeiboHot() {
  try {
    const proxyRes = await fetch('https://api.vvhan.com/api/hotlist/wbHot');
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data && data.data && Array.isArray(data.data)) {
        const hots = data.data.slice(0, 8).map((item, i) => ({
          rank: i + 1,
          word: item.title || item.word || '',
          hot: item.hot || item.hotScore || ''
        }));
        updateHotScroll(hots);
      }
    }
  } catch(e) {
    // 使用默认模拟数据
    updateHotScroll(MOCK_HOT_SEARCH);
  }
}

function updateHotScroll(hots) {
  const scroll = document.getElementById('hotScroll');
  if (!scroll) return;
  scroll.innerHTML = hots.map(h => `
    <div class="hot-item"><span class="hot-num">${h.rank}</span>${h.word}${h.hot ? ` (${h.hot})` : ''}</div>
  `).join('');
}

// ==================== PWA 安装 ====================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // 显示安装横幅
  document.getElementById('installBanner').classList.add('visible');
});

function dismissInstall() {
  document.getElementById('installBanner').classList.remove('visible');
  localStorage.setItem('techpulse_install_dismissed', 'true');
}

async function handleInstall() {
  if (!deferredPrompt) {
    // 手动引导安装
    showInstallGuide();
    return;
  }
  
  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;
  
  if (result.outcome === 'accepted') {
    showToast('🎉 安装成功！TechPulse 已添加到主屏幕', '✅');
  }
  deferredPrompt = null;
  dismissInstall();
}

function showInstallGuide() {
  let msg = '';
  const ua = navigator.userAgent;
  
  if (/iPhone|iPad|iPod/i.test(ua)) {
    msg = '📱 iPhone 安装步骤：\n1. 点击底部「分享」按钮\n2. 选择「添加到主屏幕」\n3. 点击「添加」完成安装';
  } else if (/Android/i.test(ua)) {
    msg = '🤖 Android 安装步骤：\n1. 点击地址栏右侧「+ 安装」图标\n2. 或点击菜单 →「安装应用」\n3. 确认安装';
  } else {
    msg = '💻 请使用手机浏览器访问此页面以安装为 App';
  }
  
  alert(msg);
}

// ==================== 注册 Service Worker ====================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[PWA] Service Worker 注册成功:', reg.scope))
      .catch(err => console.warn('[PWA] Service Worker 注册失败:', err));
  });
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', async () => {
  renderCategories();
  renderHotline();
  renderDiscoverPage();
  
  // 加载新闻
  await fetchNews();
  
  // 加载热搜
  await fetchWeiboHot();

  // 检查是否之前关闭了安装横幅
  if (localStorage.getItem('techpulse_install_dismissed')) {
    document.getElementById('installBanner').classList.remove('visible');
  }
});

console.log('%c🚀 TechPulse 科技动态 v1.0.0', 
  'color:#3ECFB2;font-size:16px;font-weight:bold;');
console.log('%cPWA 就绪 · 离线可用 · 支持微信分享', 
  'color:#4AB8E8;font-size:12px;');
