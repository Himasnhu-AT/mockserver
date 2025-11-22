import { Schema, FieldType } from "../types"; // Import your interfaces

/**
 * Helper to generate a dummy JSON example based on your FieldTypes
 */
const generateExample = (fields: Record<string, FieldType | any>): string => {
  const example: Record<string, any> = {};

  Object.entries(fields).forEach(([key, type]) => {
    if (typeof type !== "string") {
      example[key] = "Object"; // Handle nested objects if any
      return;
    }

    // Simple mock logic for the docs preview
    if (type === "uuid") example[key] = "a1b2c3d4-e5f6...";
    else if (type === "boolean") example[key] = true;
    else if (type.includes("integer")) example[key] = 42;
    else if (type.includes("date")) example[key] = new Date().toISOString();
    else if (type === "avatar" || type === "image")
      example[key] = "https://via.placeholder.com/150";
    else if (type.startsWith("enum"))
      example[key] = type.split(":")[1]?.split(",")[0] || "option_a";
    else example[key] = `(mock ${type})`;
  });

  return JSON.stringify(example, null, 2);
};

export const generateDocsHtml = (schema: Schema): string => {
  const baseUrl = `http://${schema.host}:${schema.port}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mock API Documentation</title>
  <style>
    :root {
      --bg-sidebar: #1e293b;
      --text-sidebar: #e2e8f0;
      --bg-main: #f8fafc;
      --primary: #3b82f6;
      --get: #0ea5e9;
      --post: #22c55e;
      --put: #f59e0b;
      --delete: #ef4444;
      --border: #e2e8f0;
    }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; display: flex; height: 100vh; background: var(--bg-main); color: #334155; }

    /* Layout */
    .sidebar { width: 280px; background: var(--bg-sidebar); color: var(--text-sidebar); overflow-y: auto; flex-shrink: 0; display: flex; flex-direction: column; }
    .content { flex-grow: 1; overflow-y: auto; padding: 40px; }

    /* Sidebar Styling */
    .brand { padding: 20px; font-size: 1.2rem; font-weight: bold; border-bottom: 1px solid #334155; }
    .nav-item { padding: 12px 20px; cursor: pointer; display: flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; transition: background 0.2s; }
    .nav-item:hover { background: #334155; }
    .nav-method { font-size: 0.7rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; width: 45px; text-align: center; }

    /* Content Styling */
    h1 { margin-top: 0; }
    .card { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 24px; margin-bottom: 24px; border: 1px solid var(--border); }
    .endpoint-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }
    .method-badge { font-size: 0.9rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; color: white; text-transform: uppercase; }
    .url { font-family: monospace; font-size: 1.1rem; color: #475569; }

    /* Config Grid */
    .config-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; }
    .config-item { background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 0.9rem; }
    .config-label { font-weight: 600; color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }

    /* Tables & JSON */
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 0.95rem; }
    th { text-align: left; color: #64748b; font-weight: 600; padding: 8px; border-bottom: 2px solid #f1f5f9; }
    td { padding: 8px; border-bottom: 1px solid #f1f5f9; font-family: monospace; }
    pre { background: #1e293b; color: #a5b4fc; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 0.9rem; }

    /* Utilities */
    .GET { background-color: var(--get); color: white; }
    .POST { background-color: var(--post); color: white; }
    .PUT, .PATCH { background-color: var(--put); color: white; }
    .DELETE { background-color: var(--delete); color: white; }

    .tag { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .tag-on { background: #dcfce7; color: #166534; }
    .tag-off { background: #f1f5f9; color: #94a3b8; }
    .tag-warn { background: #fef9c3; color: #854d0e; }

    .anchor { display: block; position: relative; top: -80px; visibility: hidden; }
  </style>
</head>
<body>

  <div class="sidebar">
    <div class="brand">Mock CLI Docs</div>
    <a href="#global-config" class="nav-item">
      <span>⚙️ Global Config</span>
    </a>
    <div style="padding: 10px 20px; font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 10px;">Endpoints</div>
    ${schema.resources
      .map(
        (r) => `
      <a href="#${r.id}" class="nav-item">
        <span class="nav-method ${r.method}">${r.method}</span>
        <span>${r.endpoint}</span>
      </a>
    `,
      )
      .join("")}
  </div>

  <div class="content">

    <div style="margin-bottom: 40px;">
      <h1>API Reference</h1>
      <p style="color: #64748b;">Base URL: <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">${baseUrl}</code></p>
    </div>

    <a id="global-config" class="anchor"></a>
    <div class="card">
      <h2 style="margin-top: 0;">Global Configuration</h2>
      <div class="config-grid">
        <div class="config-item">
          <div class="config-label">Chaos Mode</div>
          <div>
            <span class="tag ${schema.chaos.enabled ? "tag-warn" : "tag-off"}">
              ${schema.chaos.enabled ? `Active (${schema.chaos.globalErrorRate * 100}% Fail)` : "Disabled"}
            </span>
          </div>
        </div>
        <div class="config-item">
          <div class="config-label">Latency (Delay)</div>
          <div>
             ${
               schema.delay?.enabled
                 ? `${schema.delay.min}ms - ${schema.delay.max}ms`
                 : '<span class="tag tag-off">None</span>'
             }
          </div>
        </div>
        <div class="config-item">
          <div class="config-label">Authentication</div>
          <div>
             ${
               schema.auth?.enabled
                 ? `<span class="tag tag-on">${schema.auth.type.toUpperCase()}</span>`
                 : '<span class="tag tag-off">Public</span>'
             }
          </div>
        </div>
        <div class="config-item">
          <div class="config-label">Logging</div>
          <div>${schema.logging?.level || "info"}</div>
        </div>
      </div>
    </div>

    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;">

    ${schema.resources
      .map(
        (r) => `
      <a id="${r.id}" class="anchor"></a>
      <div class="card">
        <div class="endpoint-header">
          <span class="method-badge ${r.method}">${r.method}</span>
          <span class="url">${r.endpoint}</span>
        </div>

        <h3 style="font-size: 1rem; color: #475569;">Resource: ${r.name}</h3>

        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          ${
            r.pagination?.enabled
              ? `<span class="tag tag-on">Pagination: ${r.pagination.pageSize} / page</span>`
              : ""
          }
          ${
            r.errorConfig
              ? `<span class="tag tag-warn">Simulated Error: ${r.errorConfig.code} (${r.errorConfig.rate * 100}%)</span>`
              : ""
          }
        </div>

        <h4 style="margin-bottom: 8px;">Response Schema</h4>
        <table>
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Type</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(r.fields)
              .map(
                ([field, type]) => `
              <tr>
                <td>${field}</td>
                <td><span style="color: #ec4899;">${String(type).split(":")[0]}</span></td>
                <td style="color: #94a3b8; font-size: 0.8rem;">${String(type)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <h4 style="margin-top: 24px; margin-bottom: 8px;">Example Response</h4>
        <pre>${generateExample(r.fields)}</pre>
      </div>
    `,
      )
      .join("")}

    <div style="text-align: center; margin-top: 60px; color: #cbd5e1; font-size: 0.8rem;">
      Generated by Mock CLI
    </div>

  </div>

</body>
</html>
  `;
};
