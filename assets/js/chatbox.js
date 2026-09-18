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

  // If hosted on GitHub Pages (or external static host without node backend), allow setting custom backend API or alert clearly
  const isGitHubPages = window.location.hostname.includes('github.io');
  let customBackendUrl = localStorage.getItem(BACKEND_URL_KEY) || '';

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
            <span class="yt-chat-subtitle">Gemini · Luxury, Jewellery &amp; SEA</span>
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

      <!-- Model Task Selection -->
      <div class="yt-chat-mode-bar">
        <div class="yt-chat-mode-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
          </svg>
          <span class="zh">運算模型</span>
          <span class="en">Model</span>
        </div>
        <select id="yt-chat-mode-select" class="yt-chat-mode-select" aria-label="Select AI Model">
          <option value="gemini-3.5-flash" selected>Gemini 3.5 Flash (General / 常規任務)</option>
          <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast / 快速響應)</option>
          <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Complex / 深度推理)</option>
        </select>
      </div>

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
    const modeSelect = document.getElementById('yt-chat-mode-select');
    const thread = document.getElementById('yt-chat-thread');

    // Restore saved model selection
    const savedModel = localStorage.getItem(MODEL_KEY);
    if (savedModel && modeSelect) {
      modeSelect.value = savedModel;
    }
    modeSelect?.addEventListener('change', () => {
      localStorage.setItem(MODEL_KEY, modeSelect.value);
    });

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

    const selectedModel = modeSelect ? modeSelect.value : 'gemini-3.5-flash';

    async function sendRequest() {
      try {
        let apiUrl = '/api/chat';
        if (customBackendUrl) {
          apiUrl = customBackendUrl.replace(/\/$/, '') + '/api/chat';
        } else if (isGitHubPages) {
          // Check if current host has no backend server
          const testCheck = await fetch(apiUrl, { method: 'HEAD' }).catch(() => null);
          if (!testCheck || testCheck.status === 404) {
            const promptHost = window.prompt(
              '偵測到此網站託管於 GitHub Pages 靜態環境。請輸入您的後端伺服器 URL (例如 Cloud Run 或 Node.js 伺服器網址)，以啟用 AI 助理：\n\n' +
              'Detected GitHub Pages static hosting. Please enter your backend API URL (e.g. deployed Cloud Run service URL):',
              customBackendUrl || ''
            );
            if (promptHost) {
              customBackendUrl = promptHost.trim();
              localStorage.setItem(BACKEND_URL_KEY, customBackendUrl);
              apiUrl = customBackendUrl.replace(/\/$/, '') + '/api/chat';
            } else {
              removeTypingIndicator();
              isRequestPending = false;
              showErrorUI('GitHub Pages 為純前端靜態託管，AI 對話需連線至後端服務。您可以部屬後端至 Cloud Run 或自訂伺服器。', null);
              return;
            }
          }
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages,
            model: selectedModel,
          }),
        });

        const data = await response.json();

        removeTypingIndicator();
        isRequestPending = false;
        input.focus();

        if (!response.ok) {
          const errMsg = data.error || '無法取得 AI 回覆，請稍後重試。';
          showErrorUI(errMsg, () => {
            isRequestPending = true;
            showTypingIndicator();
            sendRequest();
          });
          return;
        }

        const reply = data.reply;
        const assistantMsg = { role: 'assistant', content: reply, model: data.model || selectedModel };
        messages.push(assistantMsg);
        appendMessageUI('assistant', reply, data.model || selectedModel);

        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {}
      } catch (err) {
        removeTypingIndicator();
        isRequestPending = false;
        showErrorUI('網路連線錯誤，請檢查網路連線後重試。', () => {
          isRequestPending = true;
          showTypingIndicator();
          sendRequest();
        });
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
