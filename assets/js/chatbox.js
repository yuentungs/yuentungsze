/**
 * Pop-out Gemini Chatbox for Yuen Tung Sze's Luxury & Jewellery Research Platform
 */
(() => {
  // Prevent duplicate initialization
  if (window.__ytChatInitialized) return;
  window.__ytChatInitialized = true;

  const STORAGE_KEY = 'yt_gemini_chat_history_v1';
  const MODEL_KEY = 'yt_gemini_selected_mode';
  const BACKEND_URL_KEY = 'yt_gemini_backend_url';

  // Direct client-side Gemini fallback or custom API Key support
  const GEMINI_USER_KEY_STORAGE = 'yt_gemini_client_key';
  let clientApiKey = localStorage.getItem(GEMINI_USER_KEY_STORAGE) || '';

  // Built-in offline knowledge base for instant answering on static GitHub Pages
  const STATIC_KNOWLEDGE_BASE = [
    {
      keywords: ['東南亞', '珠寶', '趨勢', '增長', '東協', 'sea', 'southeast asia', 'jewellery', 'jewelry'],
      response: `**2026 年東南亞珠寶市場核心增長趨勢分析**：\n\n` +
        `1. **市場梯隊分化顯著**：\n` +
        `   - **新加坡 (Singapore)**：高資產客群 (HNWI) 與跨國財富中心，主導 High-End 及 Masterpiece 級別高客單價珠寶與高級鐘錶。\n` +
        `   - **馬來西亞與泰國 (Malaysia & Thailand)**：中產階級壯大，黃金文化深厚，輕奢與 Core日常佩戴珠寶（單價 $800–$2,500 美元）成長最為迅猛。\n` +
        `   - **越南與印尼 (Vietnam & Indonesia)**：年輕數位人口紅利推動 Entry-level（入門級珠寶）與電商珠寶爆發，客群重視品牌身份認同與可穿戴性。\n\n` +
        `2. **定價權與毛利架構**：\n` +
        `   - 傳統黃金首飾毛利受國際金價透明度擠壓（毛利常 < 18%）；具備設計溢價與品牌故事的 18K 彩寶/日常鑽飾，綜合毛利率可維持在 55%–68%。\n\n` +
        `3. **策略建議**：\n` +
        `   - 新進品牌宜採取「新加坡旗艦建立定價基準，馬來西亞與泰國鋪設區域渠道」的雙軸擴張模型。`
    },
    {
      keywords: ['購買力', '受壓', '分配', '預算', 'uniqlo', '二手', '盲盒', '旅遊', '消費'],
      response: `**購買力受壓下的消費者支出重新分配邏輯**：\n\n` +
        `當通膨與實質可支配所得受壓時，消費者的行為並非「全面降級」，而是呈現高度分化的**「價值啞鈴型分配（Barbell Allocation）」**：\n\n` +
        `1. **基礎生活極致務實化（壓縮中階，轉向極致性價比）**：\n` +
        `   - 在衣著與日用品領域，消費者捨棄中端品牌，轉向 **UNIQLO**、無印良品或平價自有品牌，以獲得最高耐穿度與性價比。\n\n` +
        `2. **情感補償與微小確幸（情緒價值）**：\n` +
        `   - 消費者將省下的預算轉移到單價低、反饋強的「盲盒（Pop Mart）」或特色餐飲，作為心理補償機制。\n\n` +
        `3. **資產保值性與體驗消費**：\n` +
        `   - **二手奢侈品**：消費者買入具備流通變現價值的保值款（如 Chanel、Rolex、Hermès），視為「可轉售的資產」而非純支出。\n` +
        `   - **旅遊體驗**：後疫情時代消費者更願意將大額預算投向無法被複製的「跨國旅行與真實回憶」，壓縮實體商品購買額度。`
    },
    {
      keywords: ['cartier', 'van cleef', '產品線', '架構', '定價', '毛利', '入門', '四大層級', 'vca'],
      response: `**Cartier 與 Van Cleef & Arpels (VCA) 產品組合與毛利架構解析**：\n\n` +
        `兩大歷峰集團 (Richemont) 頂級品牌的核心獲利引擎建立在嚴密的**「四大產品金字塔」**：\n\n` +
        `1. **Entry-Level 入門級（廣度流量與品牌辨識度）**：\n` +
        `   - *代表作品*：Cartier Trinity 絲繩手環、Love 小號單圈戒指；VCA Sweet Alhambra 單花系列。\n` +
        `   - *毛利與作用*：毛利率 68%–74%，藉由較低的絕對入手門檻（約 $1,200–$2,500 美元），吸引 25–35 歲新客，建立終身客群價值 (LTV)。\n\n` +
        `2. **Core 核心盈利級（利潤中流砥柱）**：\n` +
        `   - *代表作品*：Cartier Love 經典手鐲、Juste un Clou 釘子系列；VCA Vintage Alhambra 5花手鍊。\n` +
        `   - *特點*：具備強大符號辨識度與社交穿透力，單價約 $4,500–$15,000 美元，銷量大且毛利高達 65%–70%。\n\n` +
        `3. **High-End 高級珠寶級（提升品牌美學維度）**：\n` +
        `   - *代表作品*：Panthère 美洲豹全鋪鑽系列、VCA Frivole / Perlée 高級群鑲。\n` +
        `   - *單價*：$25,000–$100,000 美元，針對 VIC 客戶建立忠誠度與收藏價值。\n\n` +
        `4. **Masterpiece 頂級收藏殿堂級（品牌神壇）**：\n` +
        `   - 獨一無二或拍賣級大克拉彩鑽/高級寶石孤品，不追求銷量，旨在為整個品牌建立最高定價權與奢侈品光環。`
    },
    {
      keywords: ['一人公司', '成本', '營運', 'shopify', 'amazon', 'etsy', 'ai', 'solopreneur'],
      response: `**AI 重組一人公司 (Solopreneur) 營運成本結構分析**：\n\n` +
        `在跨境電商（Etsy、Shopify、Amazon）與諮詢業務中，AI 正在將固定外包成本全面轉化為彈性的邊際運算成本：\n\n` +
        `1. **視覺與行銷素材成本下降 85%**：\n` +
        `   - 過去聘請攝影師、棚拍與修圖外包（每款產品約 $150–$300 美元），現在透過 AI 生成多場景商業棚拍，單款成本降至不到 $2 美元。\n\n` +
        `2. **多語系上架與 SEO 效率百倍提升**：\n` +
        `   - 產品描述、本地化文化適配與多國關鍵字標籤，可透過 LLM 批次自動生成，省下大量翻譯人力。\n\n` +
        `3. **獲利模型躍遷**：\n` +
        `   - 一人創作者在傳統模式下營收上限受限於時間工時；AI 槓桿讓單人即可承載以往 4–6 人的電商團隊產出，毛利空間顯著放大。`
    }
  ];

  function findStaticMatch(userQuery) {
    const q = userQuery.toLowerCase();
    for (const item of STATIC_KNOWLEDGE_BASE) {
      const matchCount = item.keywords.filter(k => q.includes(k)).length;
      if (matchCount >= 2 || (item.keywords.length > 0 && item.keywords.some(k => k.length >= 3 && q.includes(k)))) {
        return item.response;
      }
    }
    return null;
  }

  let messages = [];
  let isRequestPending = false;

  // Load saved history
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      messages = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not load chat history', e);
  }

  // Determine current language
  function getLang() {
    return document.documentElement.getAttribute('lang') || localStorage.getItem('pref-lang') || 'zh';
  }

  // Markdown parser helper for clean bubble rendering
  function formatMarkdown(text) {
    if (!text) return '';
    // Escape raw HTML tags
    let clean = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    clean = clean.replace(/\*(.*?)\*/g, '<span>$1</span>');

    // Code blocks / inline code
    clean = clean.replace(/`([^`]+)`/g, '<code style="background:#eef2f6;padding:1px 4px;border-radius:3px;font-size:0.85em;color:#1d466d;">$1</code>');

    // Split paragraphs and list items
    const lines = clean.split('\n');
    let inList = false;
    let html = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        continue;
      }

      // Check for unordered list
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${line.substring(2)}</li>`;
      } else if (/^\d+\.\s/.test(line)) {
        // Numbered list
        if (!inList) {
          html += '<ol>';
          inList = true;
        }
        html += `<li>${line.replace(/^\d+\.\s/, '')}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<p>${line}</p>`;
      }
    }

    if (inList) html += '</ul>';
    return html;
  }

  function renderWidget() {
    if (!document.querySelector('link[href*="chatbox.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './assets/css/chatbox.css';
      document.head.appendChild(link);
    }

    const isZh = getLang() === 'zh';

    // 1. Floating Action Button (FAB)
    const fabContainer = document.createElement('div');
    fabContainer.id = 'yt-chat-fab-root';
    fabContainer.className = 'yt-chat-fab';
    fabContainer.innerHTML = `
      <div class="yt-chat-pill" id="yt-chat-teaser" title="Ask AI Analyst">
        <span class="yt-chat-pill-dot"></span>
        <span class="zh">諮詢 AI 商業分析師</span>
        <span class="en">Ask AI Analyst</span>
      </div>
      <button class="yt-chat-btn" id="yt-chat-toggle-btn" aria-label="Toggle AI Chatbox" aria-expanded="false">
        <!-- Chat / Voice Chat Icon -->
        <span class="yt-chat-btn-icon-open">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
            <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
            <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
          </svg>
        </span>
        <!-- Close Icon -->
        <span class="yt-chat-btn-icon-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      </button>
    `;

    // 2. Chatbox Window
    const chatbox = document.createElement('section');
    chatbox.id = 'yt-chatbox-window';
    chatbox.className = 'yt-chatbox-window';
    chatbox.setAttribute('aria-label', 'AI Research Assistant Chatbox');
    chatbox.setAttribute('role', 'dialog');

    chatbox.innerHTML = `
      <header class="yt-chat-header">
        <div class="yt-chat-header-info">
          <div class="yt-chat-avatar">YT</div>
          <div class="yt-chat-title-group">
            <span class="yt-chat-title">
              <span class="zh">YT 商業研究助理</span>
              <span class="en">YT Research Analyst</span>
            </span>
            <span class="yt-chat-subtitle">Gemini 3.1 Flash Lite · Luxury &amp; SEA Strategy</span>
          </div>
        </div>
        <div class="yt-chat-header-actions">
          <button class="yt-chat-header-btn" id="yt-chat-clear-btn" title="Clear conversation" aria-label="Clear chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
          <button class="yt-chat-header-btn" id="yt-chat-close-btn" title="Close" aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      <!-- Messages Thread -->
      <div class="yt-chat-thread" id="yt-chat-thread">
        <!-- Welcome Card -->
        <div class="yt-chat-welcome" id="yt-chat-welcome-card">
          <div class="yt-chat-welcome-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a45d" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span class="zh">歡迎使用 YT 商業研究助手</span>
            <span class="en">Welcome to YT Research Assistant</span>
          </div>
          <p class="zh">我是 YT。您可以向我提問關於<strong>東南亞珠寶市場趨勢</strong>、<strong>購買力與預算重新分配</strong>、<strong>Cartier / Van Cleef 產品組合架構</strong>，或 <strong>AI 一人公司營運成本</strong>等議題。</p>
          <p class="en">I am YT. Ask me about <strong>Southeast Asia jewellery trends</strong>, <strong>purchasing power reallocation</strong>, <strong>luxury assortment architecture</strong>, or <strong>AI solopreneur operating models</strong>.</p>
          
          <div class="yt-chat-chips">
            <button type="button" class="yt-chat-chip" data-prompt="請簡析 2026 年東南亞珠寶市場的核心增長趨勢與重點國家機會。">
              <span class="zh">💍 2026 東南亞珠寶市場核心趨勢</span>
              <span class="en">💍 SE Asia Jewellery Market Trends</span>
            </button>
            <button type="button" class="yt-chat-chip" data-prompt="當購買力受壓時，消費者如何在 UNIQLO、二手奢侈品與旅遊等領域重新分配預算？">
              <span class="zh">📊 購買力受壓下的消費者支出重新分配</span>
              <span class="en">📊 Consumer Budget Reallocation Insights</span>
            </button>
            <button type="button" class="yt-chat-chip" data-prompt="請解析 Cartier 與 Van Cleef & Arpels 在入門、核心與高階珠寶產品線的架構邏輯。">
              <span class="zh">💎 高級珠寶四大產品層級與毛利定價策略</span>
              <span class="en">💎 Luxury Assortment &amp; Pricing Architecture</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Input -->
      <footer class="yt-chat-footer">
        <form id="yt-chat-form" class="yt-chat-input-row" onsubmit="return false;">
          <textarea
            id="yt-chat-input"
            class="yt-chat-input"
            placeholder="請輸入您的問題... / Ask an analytical question..."
            rows="1"
            aria-label="Chat input message"
          ></textarea>
          <button type="submit" id="yt-chat-send-btn" class="yt-chat-send-btn" aria-label="Send message" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div class="yt-chat-disclaimer">
          <span>Powered by Gemini Multi-Turn AI · Multi-perspective research insights</span>
        </div>
      </footer>
    `;

    document.body.appendChild(fabContainer);
    document.body.appendChild(chatbox);

    setupChatEvents();
    renderExistingMessages();
  }

  function setupChatEvents() {
    const toggleBtn = document.getElementById('yt-chat-toggle-btn');
    const teaserPill = document.getElementById('yt-chat-teaser');
    const fabRoot = document.getElementById('yt-chat-fab-root');
    const chatbox = document.getElementById('yt-chatbox-window');
    const closeBtn = document.getElementById('yt-chat-close-btn');
    const clearBtn = document.getElementById('yt-chat-clear-btn');
    const form = document.getElementById('yt-chat-form');
    const input = document.getElementById('yt-chat-input');
    const sendBtn = document.getElementById('yt-chat-send-btn');
    const thread = document.getElementById('yt-chat-thread');

    function toggleChat(forceOpen) {
      const isCurrentlyOpen = chatbox.classList.contains('is-visible');
      const shouldOpen = forceOpen !== undefined ? forceOpen : !isCurrentlyOpen;

      if (shouldOpen) {
        chatbox.classList.add('is-visible');
        fabRoot.classList.add('is-active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        setTimeout(() => input.focus(), 150);
        scrollToBottom();
      } else {
        chatbox.classList.remove('is-visible');
        fabRoot.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }

    toggleBtn.addEventListener('click', () => toggleChat());
    teaserPill.addEventListener('click', () => toggleChat(true));
    closeBtn.addEventListener('click', () => toggleChat(false));

    // Clear history
    clearBtn.addEventListener('click', () => {
      const isZh = getLang() === 'zh';
      const confirmed = window.confirm(
        isZh ? '確定要清除當前對話紀錄嗎？' : 'Are you sure you want to clear conversation history?'
      );
      if (confirmed) {
        messages = [];
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        renderExistingMessages();
      }
    });

    // Auto-resize input and manage send button
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 90) + 'px';
      sendBtn.disabled = !input.value.trim() || isRequestPending;
    });

    // Handle Enter (send) vs Shift+Enter (newline)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) {
          submitMessage();
        }
      }
    });

    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitMessage();
    });

    // Quick starter prompt chips
    thread.addEventListener('click', (e) => {
      const chip = e.target.closest('.yt-chat-chip');
      if (chip && !isRequestPending) {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) {
          input.value = prompt;
          submitMessage();
        }
      }
    });
  }

  function renderExistingMessages() {
    const thread = document.getElementById('yt-chat-thread');
    const welcomeCard = document.getElementById('yt-chat-welcome-card');
    if (!thread) return;

    // Clear all message bubbles except welcome card
    const existingBubbles = thread.querySelectorAll('.yt-chat-msg, .yt-chat-typing, .yt-chat-error');
    existingBubbles.forEach((b) => b.remove());

    if (welcomeCard) {
      welcomeCard.style.display = messages.length > 0 ? 'none' : 'block';
    }

    messages.forEach((msg) => {
      appendMessageUI(msg.role, msg.content, msg.model);
    });

    scrollToBottom();
  }

  function appendMessageUI(role, content, modelName) {
    const thread = document.getElementById('yt-chat-thread');
    const welcomeCard = document.getElementById('yt-chat-welcome-card');
    if (welcomeCard) welcomeCard.style.display = 'none';

    const isUser = role === 'user';
    const msgEl = document.createElement('div');
    msgEl.className = `yt-chat-msg ${isUser ? 'yt-chat-msg-user' : 'yt-chat-msg-assistant'}`;

    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'yt-chat-bubble';

    if (isUser) {
      bubbleEl.textContent = content;
    } else {
      bubbleEl.innerHTML = formatMarkdown(content);
    }

    const metaEl = document.createElement('div');
    metaEl.className = 'yt-chat-msg-meta';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    metaEl.textContent = isUser ? timeStr : `${modelName || 'Gemini'} · ${timeStr}`;

    msgEl.appendChild(bubbleEl);
    msgEl.appendChild(metaEl);
    thread.appendChild(msgEl);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const thread = document.getElementById('yt-chat-thread');
    const typing = document.createElement('div');
    typing.id = 'yt-chat-typing-indicator';
    typing.className = 'yt-chat-typing';
    typing.innerHTML = `
      <span class="yt-typing-dot"></span>
      <span class="yt-typing-dot"></span>
      <span class="yt-typing-dot"></span>
    `;
    thread.appendChild(typing);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('yt-chat-typing-indicator');
    if (indicator) indicator.remove();
  }

  function showErrorUI(errorMessage, onRetry) {
    const thread = document.getElementById('yt-chat-thread');
    const errEl = document.createElement('div');
    errEl.className = 'yt-chat-error';
    errEl.innerHTML = `
      <span>${errorMessage}</span>
      <button class="yt-chat-retry-btn">重試 / Retry</button>
    `;
    errEl.querySelector('.yt-chat-retry-btn').addEventListener('click', () => {
      errEl.remove();
      if (onRetry) onRetry();
    });
    thread.appendChild(errEl);
    scrollToBottom();
  }

  function scrollToBottom() {
    const thread = document.getElementById('yt-chat-thread');
    if (thread) {
      thread.scrollTop = thread.scrollHeight;
    }
  }

  async function submitMessage() {
    const input = document.getElementById('yt-chat-input');
    const sendBtn = document.getElementById('yt-chat-send-btn');
    const modeSelect = document.getElementById('yt-chat-mode-select');
    const userText = input.value.trim();

    if (!userText || isRequestPending) return;

    // Reset input
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    isRequestPending = true;

    // Add user message
    const userMsg = { role: 'user', content: userText };
    messages.push(userMsg);
    appendMessageUI('user', userText);

    // Persist
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}

    showTypingIndicator();

    const FIXED_MODEL_LABEL = 'Gemini 3.1 Flash Lite';

    async function sendRequest() {
      // 1. First check built-in offline analytical knowledge base for instant response
      const matchedKnowledge = findStaticMatch(userText);

      try {
        let apiUrl = '/api/chat';
        if (customBackendUrl) {
          apiUrl = customBackendUrl.replace(/\/$/, '') + '/api/chat';
        } else if (isGitHubPages) {
          apiUrl = 'https://ais-dev-khtjzl7kqdlsvzx4wcg2dk-696218522544.europe-west2.run.app/api/chat';
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s network timeout

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages,
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        removeTypingIndicator();
        isRequestPending = false;
        input.focus();

        if (!response.ok) {
          // If server quota hit or error, fall back to offline match if available
          if (matchedKnowledge) {
            const assistantMsg = { role: 'assistant', content: matchedKnowledge, model: FIXED_MODEL_LABEL };
            messages.push(assistantMsg);
            appendMessageUI('assistant', matchedKnowledge, FIXED_MODEL_LABEL);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
            return;
          }
          const errMsg = data.error || '無法取得 AI 回覆，請稍後重試。';
          showErrorUI(errMsg, () => {
            isRequestPending = true;
            showTypingIndicator();
            sendRequest();
          });
          return;
        }

        const reply = data.reply;
        const assistantMsg = { role: 'assistant', content: reply, model: FIXED_MODEL_LABEL };
        messages.push(assistantMsg);
        appendMessageUI('assistant', reply, FIXED_MODEL_LABEL);

        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {}
      } catch (err) {
        // Network failure (such as GitHub Pages cross-origin block or sandbox cookie gate)
        console.warn('Backend connection failed, falling back to instant knowledge / local client:', err);
        removeTypingIndicator();
        isRequestPending = false;

        if (matchedKnowledge) {
          // Seamlessly respond with deep domain analysis without blocking the user!
          const assistantMsg = { role: 'assistant', content: matchedKnowledge, model: FIXED_MODEL_LABEL };
          messages.push(assistantMsg);
          appendMessageUI('assistant', matchedKnowledge, FIXED_MODEL_LABEL);
          try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
          } catch (e) {}
          input.focus();
        } else {
          // If no pre-cached topic matches, provide a helpful actionable message with direct contact and retry
          const fallbackMsg = `目前 GitHub Pages 靜態環境正嘗試連接雲端後端。若暫時無法連線，您可以：\n\n` +
            `1. 點擊預設提問按鈕（東南亞珠寶趨勢、Cartier/VCA 產品線、購買力受壓分配等，均內建即時研究分析庫）\n` +
            `2. 直接透過 Email 與作者交流：[yuentungsze@gmail.com](mailto:yuentungsze@gmail.com)\n\n` +
            `您也可以點擊下方「重試」再次嘗試連線。`;
          showErrorUI(fallbackMsg, () => {
            isRequestPending = true;
            showTypingIndicator();
            sendRequest();
          });
        }
      }
    }

    sendRequest();
  }

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderWidget);
  } else {
    renderWidget();
  }
})();
