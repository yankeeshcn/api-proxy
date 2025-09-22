// server/routes/index.ts

import { proxyTargets } from "~/utils/proxy";

export default defineEventHandler(async (event) => {
  const homepageEnabled = process.env.HOMEPAGE_ENABLE === "true";

  if (!homepageEnabled) {
    setResponseStatus(event, 404);
    return "404 Not Found";
  }

  // Get the base URL of the current deployment
  const requestUrl = getRequestURL(event);
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

  // Generate HTML page
  const html = `
<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Proxy Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 221.2 83.2% 53.3%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96%;
      --secondary-foreground: 222.2 84% 4.9%;
      --muted: 210 40% 96%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96%;
      --accent-foreground: 222.2 84% 4.9%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 221.2 83.2% 53.3%;
      --radius: 0.5rem;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: hsl(var(--foreground));
      background-color: hsl(var(--background));
      min-height: 100vh;
      padding: 1rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 700;
      color: hsl(var(--foreground));
      margin-bottom: 0.75rem;
      letter-spacing: -0.025em;
    }

    .subtitle {
      color: hsl(var(--muted-foreground));
      font-size: 1.125rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .endpoints-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    }

    .endpoint-card {
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: calc(var(--radius) + 2px);
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      transition: all 0.2s ease-in-out;
    }

    .endpoint-card:hover {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      border-color: hsl(var(--ring));
    }

    .endpoint-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid hsl(var(--border));
    }

    .endpoint-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border-radius: 50%;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .endpoint-path {
      font-size: 1.25rem;
      font-weight: 600;
      color: hsl(var(--foreground));
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    }

    .url-section {
      margin-bottom: 1.5rem;
    }

    .url-section:last-child {
      margin-bottom: 0;
    }

    .url-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(var(--muted-foreground));
      margin-bottom: 0.5rem;
    }

    .label-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.5rem;
      border-radius: calc(var(--radius) - 2px);
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .label-badge.proxy {
      background: hsl(142.1 76.2% 36.3% / 0.1);
      color: hsl(142.1 76.2% 36.3%);
    }

    .label-badge.target {
      background: hsl(47.9 95.8% 53.1% / 0.1);
      color: hsl(47.9 95.8% 33.1%);
    }

    .url-container {
      position: relative;
      display: flex;
      align-items: center;
      background: hsl(var(--muted));
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      overflow: hidden;
    }

    .url-text {
      flex: 1;
      padding: 0.75rem 1rem;
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 0.875rem;
      background: transparent;
      border: none;
      outline: none;
      color: hsl(var(--foreground));
      overflow-x: auto;
      white-space: nowrap;
    }

    .copy-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease-in-out;
      white-space: nowrap;
      min-width: 80px;
      justify-content: center;
    }

    .copy-button:hover {
      background: hsl(var(--primary) / 0.9);
    }

    .copy-button:active {
      transform: scale(0.98);
    }

    .copy-button.success {
      background: hsl(142.1 76.2% 36.3%);
    }

    .copy-button.error {
      background: hsl(var(--destructive));
    }

    .copy-icon {
      width: 1rem;
      height: 1rem;
      fill: currentColor;
    }

    .no-endpoints {
      text-align: center;
      padding: 4rem 2rem;
      color: hsl(var(--muted-foreground));
    }

    .no-endpoints-icon {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1.5rem;
      color: hsl(var(--muted-foreground));
    }

    .no-endpoints-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: hsl(var(--foreground));
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem 0;
      }

      .title {
        font-size: 2rem;
      }

      .endpoints-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .endpoint-card {
        padding: 1rem;
      }

      .endpoint-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .url-container {
        flex-direction: column;
      }

      .copy-button {
        width: 100%;
        border-radius: 0 0 calc(var(--radius) - 1px) calc(var(--radius) - 1px);
      }

      .url-text {
        border-radius: calc(var(--radius) - 1px) calc(var(--radius) - 1px) 0 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">API Proxy Dashboard</h1>
      <p class="subtitle">Manage and monitor your API proxy endpoints with ease</p>
    </div>

    ${
      proxyTargets.length === 0
        ? `<div class="no-endpoints">
            <svg class="no-endpoints-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="no-endpoints-title">No Endpoints Configured</h3>
            <p>Add proxy targets to your configuration to get started.</p>
           </div>`
        : `<div class="endpoints-grid">
            ${proxyTargets
              .map(
                (target, index) => `
                <div class="endpoint-card">
                  <div class="endpoint-header">
                    <div class="endpoint-number">${index + 1}</div>
                    <div class="endpoint-path">${target.path}</div>
                  </div>

                  <div class="url-section">
                    <div class="url-label">
                      <span class="label-badge proxy">Proxy</span>
                      Endpoint URL
                    </div>
                    <div class="url-container">
                      <input class="url-text" readonly value="${baseUrl}${
                  target.path
                }" />
                      <button class="copy-button" onclick="copyToClipboard('${baseUrl}${
                  target.path
                }', this)">
                        <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>

                  <div class="url-section">
                    <div class="url-label">
                      <span class="label-badge target">Target</span>
                      Destination URL
                    </div>
                    <div class="url-container">
                      <input class="url-text" readonly value="${
                        target.target
                      }" />
                      <button class="copy-button" onclick="copyToClipboard('${
                        target.target
                      }', this)">
                        <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              `
              )
              .join("")}
           </div>`
    }
  </div>

  <script>
    async function copyToClipboard(text, button) {
      const originalContent = button.innerHTML;

      try {
        // Try using the modern Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers or non-HTTPS
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Success feedback
        button.className = 'copy-button success';
        button.innerHTML = \`
          <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        \`;

      } catch (err) {
        console.error('Failed to copy: ', err);

        // Error feedback
        button.className = 'copy-button error';
        button.innerHTML = \`
          <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Failed
        \`;
      }

      // Reset button after 2 seconds
      setTimeout(() => {
        button.className = 'copy-button';
        button.innerHTML = originalContent;
      }, 2000);
    }
  </script>
</body>
</html>
  `;

  setHeader(event, "content-type", "text/html; charset=utf-8");
  return html;
});
