(function() {
  'use strict';

  // Embed configuration and utilities
  const EmbedTracker = {
    // Configuration
    config: {
      apiBaseUrl: 'http://localhost:3000/api', // Local development
      version: '1.0.0'
    },

    // Validate company token and extract company ID
    async validateCompany(embedToken) {
      try {
        const response = await fetch(`${this.config.apiBaseUrl}/embed/validate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            embedToken,
            domain: window.location.hostname,
            referrer: document.referrer 
          })
        });

        if (!response.ok) {
          throw new Error('Invalid embed token or domain not authorized');
        }

        const data = await response.json();
        return data.companyId;
      } catch (error) {
        console.error('Embed validation failed:', error);
        return null;
      }
    },

    // Create visitor entry
    async createVisitor(companyId, sessionData) {
      try {
        const response = await fetch(`${this.config.apiBaseUrl}/embed/visitor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyId,
            ...sessionData
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create visitor');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Failed to create visitor:', error);
        return null;
      }
    },

    // Get browser/session information
    getSessionData() {
      return {
        sessionId: this.generateSessionId(),
        ipAddress: '', // Will be detected server-side
        userAgent: navigator.userAgent,
        referrer: document.referrer || null,
        currentPage: window.location.href,
        utmParams: this.getUtmParams(),
        online: navigator.onLine,
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
    },

    // Extract UTM parameters from URL
    getUtmParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {};
      
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        if (urlParams.has(param)) {
          utmParams[param] = urlParams.get(param);
        }
      });
      
      return Object.keys(utmParams).length > 0 ? utmParams : null;
    },

    // Generate a unique session ID
    generateSessionId() {
      return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    },

    // Create and inject the button
    createButton(options = {}) {
      const button = document.createElement('button');
      button.id = 'embed-tracker-btn';
      button.textContent = options.text || 'Track Visit';
      button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 24px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
        z-index: 999999;
      `;

      // Add hover effects
      button.addEventListener('mouseenter', () => {
        button.style.background = '#0056b3';
        button.style.transform = 'translateY(-2px)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.background = '#007bff';
        button.style.transform = 'translateY(0)';
      });

      return button;
    },

    // Handle button click
    async handleButtonClick(companyId, embedToken) {
      const button = document.getElementById('embed-tracker-btn');
      if (!button) return;

      // Show loading state
      const originalText = button.textContent;
      button.textContent = 'Tracking...';
      button.disabled = true;
      button.style.opacity = '0.7';

      try {
        // Get session data
        const sessionData = this.getSessionData();
        
        // Create visitor entry
        const result = await this.createVisitor(companyId, sessionData);
        
        if (result) {
          button.textContent = 'Visit Tracked!';
          button.style.background = '#28a745';
          
          // Reset after 2 seconds
          setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#007bff';
            button.disabled = false;
            button.style.opacity = '1';
          }, 2000);
        } else {
          throw new Error('Failed to track visit');
        }
      } catch (error) {
        console.error('Error tracking visit:', error);
        button.textContent = 'Error - Try Again';
        button.style.background = '#dc3545';
        
        // Reset after 3 seconds
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '#007bff';
          button.disabled = false;
          button.style.opacity = '1';
        }, 3000);
      }
    },

    // Initialize the embed
    async init(options = {}) {
      const embedToken = options.token;
      
      if (!embedToken) {
        console.error('EmbedTracker: No token provided');
        return;
      }

      // Validate company token
      const companyId = await this.validateCompany(embedToken);
      if (!companyId) {
        console.error('EmbedTracker: Invalid token or company not found');
        return;
      }

      // Create and inject button
      const button = this.createButton(options);
      document.body.appendChild(button);

      // Add click handler
      button.addEventListener('click', () => {
        this.handleButtonClick(companyId, embedToken);
      });

      console.log('EmbedTracker: Initialized successfully');
    }
  };

  // Auto-initialize if script has data attributes
  const script = document.currentScript;
  if (script) {
    const token = script.getAttribute('data-token');
    const text = script.getAttribute('data-text');
    
    if (token) {
      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          EmbedTracker.init({ token, text });
        });
      } else {
        EmbedTracker.init({ token, text });
      }
    }
  }

  // Make EmbedTracker available globally for manual initialization
  window.EmbedTracker = EmbedTracker;

})();
