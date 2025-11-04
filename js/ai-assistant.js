// AI Assistant - DeepSeek API Integration
(function() {
  'use strict';

  const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
  
  // Get API key from global config (injected by Hexo)
  const getApiKey = () => {
    // Try to get from window config (injected by Hexo)
    if (window.AI_CONFIG && window.AI_CONFIG.api_key) {
      return window.AI_CONFIG.api_key;
    }
    return null;
  };

  // Load blog posts data
  let blogPosts = [];
  const loadBlogPosts = async () => {
    try {
      const response = await fetch('/JasmineRain.github.io/search.xml');
      if (response.ok) {
        const xml = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        
        blogPosts = Array.from(items).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
          content: item.querySelector('content')?.textContent || ''
        }));
      }
    } catch (error) {
      console.warn('Failed to load blog posts:', error);
    }
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const clearBtn = document.getElementById('clear-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Load blog posts
    loadBlogPosts();

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Clear chat
    clearBtn.addEventListener('click', function() {
      if (confirm('确定要清空所有对话吗？')) {
        chatMessages.innerHTML = `
          <div class="message system-message">
            <div class="message-content">
              <p>👋 你好！我是 AI 助手，基于 DeepSeek 模型。我可以帮助你查找和介绍博客文章，回答技术问题等。请输入你的问题！</p>
            </div>
          </div>
        `;
      }
    });

    function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      const apiKey = getApiKey();
      if (!apiKey) {
        showMessage('API Key 未配置，请联系网站管理员', 'error');
        return;
      }

      // Add user message
      addMessage('user', message);
      chatInput.value = '';
      sendBtn.disabled = true;

      // Show loading
      const loadingId = addMessage('assistant', '<div class="loading"></div> 正在思考...', true);

      // Call DeepSeek API
      callDeepSeekAPI(apiKey, message)
        .then(response => {
          removeLoadingMessage(loadingId);
          addMessage('assistant', response);
        })
        .catch(error => {
          removeLoadingMessage(loadingId);
          addMessage('assistant', `❌ 错误: ${error.message}`);
        })
        .finally(() => {
          sendBtn.disabled = false;
          chatInput.focus();
        });
    }

    function callDeepSeekAPI(apiKey, userMessage) {
      // Get conversation history
      const messages = getConversationHistory();
      
      // Add system prompt with blog context
      const systemPrompt = buildSystemPrompt();
      if (messages.length === 0) {
        messages.push({
          role: 'system',
          content: systemPrompt
        });
      } else if (messages[0].role !== 'system') {
        messages.unshift({
          role: 'system',
          content: systemPrompt
        });
      }
      
      messages.push({
        role: 'user',
        content: userMessage
      });

      return fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false
        })
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error?.message || `HTTP ${response.status}: ${response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.choices && data.choices.length > 0) {
          return data.choices[0].message.content;
        } else {
          throw new Error('API 返回格式错误');
        }
      });
    }

    function getConversationHistory() {
      const messages = [];
      const messageElements = chatMessages.querySelectorAll('.message:not(.system-message)');
      
      messageElements.forEach(el => {
        const isUser = el.classList.contains('user-message');
        const content = el.querySelector('.message-content').textContent.trim();
        if (content && !content.includes('正在思考...')) {
          messages.push({
            role: isUser ? 'user' : 'assistant',
            content: content
          });
        }
      });

      // Keep last 10 messages for context
      return messages.slice(-10);
    }

    function buildSystemPrompt() {
      let prompt = `你是一个AI助手，专门帮助用户查询和了解这个技术博客的内容。

博客信息：
- 博客名称：JasmineRain's blog
- 博客主题：技术博客，涵盖算法、数据结构、编程语言、数据库、操作系统等

你的职责：
1. 帮助用户查找和介绍博客文章
2. 回答用户关于博客内容的问题
3. 根据博客文章内容提供技术建议和帮助
4. 解释博客中提到的技术概念和代码`;

      // Add blog posts summary if available
      if (blogPosts.length > 0) {
        prompt += `\n\n当前博客有以下文章（${blogPosts.length}篇）：\n`;
        blogPosts.slice(0, 20).forEach((post, index) => {
          prompt += `${index + 1}. ${post.title}\n`;
        });
        prompt += `\n当用户询问博客文章时，你可以：
- 根据文章标题推荐相关文章
- 介绍文章内容
- 回答关于文章的问题
- 提供文章链接（格式：${window.location.origin}${post.link || ''}）`;
      }

      prompt += `\n\n请用友好、专业的语气回答用户的问题。如果用户询问博客文章，请提供文章标题和链接。`;

      return prompt;
    }

    function searchBlogPosts(query) {
      if (!query || !blogPosts.length) return [];
      
      const lowerQuery = query.toLowerCase();
      return blogPosts.filter(post => {
        const title = post.title.toLowerCase();
        const description = post.description.toLowerCase();
        const content = post.content.toLowerCase();
        return title.includes(lowerQuery) || 
               description.includes(lowerQuery) || 
               content.includes(lowerQuery);
      }).slice(0, 5);
    }

    function addMessage(role, content, isLoading = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${role}-message`;
      if (isLoading) {
        messageDiv.id = 'loading-message';
      }

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      
      // Format content (support markdown-like formatting)
      contentDiv.innerHTML = formatMessage(content);
      
      messageDiv.appendChild(contentDiv);
      chatMessages.appendChild(messageDiv);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;

      return messageDiv.id || null;
    }

    function formatMessage(content) {
      // Basic markdown formatting
      content = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/\n/g, '<br>');
      
      return content;
    }

    function removeLoadingMessage(id) {
      const loadingMsg = document.getElementById('loading-message');
      if (loadingMsg) {
        loadingMsg.remove();
      }
    }

    function showMessage(text, type = 'info') {
      // Simple notification (you can enhance this)
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s;
      `;
      notification.textContent = text;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    }
  });
})();

