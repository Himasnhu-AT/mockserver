"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  Server,
  Play,
  Settings,
  GripVertical,
  ChevronRight,
  Activity,
  Clock,
  Shield,
  WifiOff, // Imported for the error screen
  RefreshCw, // Imported for the retry button
  Globe, // Imported for the network permission icon
  Database, // Imported for Data tab
  Terminal,
  ArrowRight,
} from "lucide-react";
import { DataBrowser } from "@/component/DataBrowser";
import { cn } from "@/lib/utils";

export type FieldType = string;

export interface ErrorConfig {
  rate: number;
  code: number;
  message: string;
}
export interface PaginationConfig {
  enabled: boolean;
  pageSize: number;
}
export interface DelayConfig {
  enabled: boolean;
  min: number;
  max: number;
}
export interface AuthConfig {
  enabled: boolean;
  type: "bearer" | "basic" | "apikey";
}
export interface ChaosConfig {
  enabled: boolean;
  globalErrorRate: number;
}

export interface Resource {
  id: string;
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  count: number;
  fields: Record<string, FieldType>;
  errorConfig?: ErrorConfig;
  pagination?: PaginationConfig;
}

export interface Schema {
  port: number;
  host: string;
  delay?: DelayConfig;
  chaos: ChaosConfig;
  auth?: AuthConfig;
  resources: Resource[];
}
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      "w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
      checked ? "bg-blue-600" : "bg-gray-200",
    )}
  >
    <span
      className={cn(
        "absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0",
      )}
    />
  </button>
);

const Card = ({ children, className, title, action }: any) => (
  <div
    className={cn(
      "bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden",
      className,
    )}
  >
    {(title || action) && (
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
        {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default function SchemaBuilder() {
  const [schema, setSchema] = useState<Schema>({
    port: 0,
    host: "localhost",
    chaos: { enabled: false, globalErrorRate: 0.1 },
    delay: { enabled: false, min: 100, max: 500 },
    auth: { enabled: false, type: "bearer" },
    resources: [],
  });

  const [selectedResId, setSelectedResId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false); // New state for error handling
  const [activeTab, setActiveTab] = useState<"design" | "test" | "data">(
    "design",
  );
  const [testResponse, setTestResponse] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Drag and Drop State
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const API_URL =
    typeof window !== "undefined"
      ? `http://${new URLSearchParams(window.location.search).get("host") || "localhost:9500"}`
      : "http://localhost:9500";

  // Extracted fetch logic to allow retries
  const fetchSchema = React.useCallback(() => {
    setLoading(true);
    setConnectionError(false);

    fetch(`${API_URL}/_mockserver/schema`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setSchema(data);
        if (data.resources.length > 0) setSelectedResId(data.resources[0].id);
        setLoading(false);
      })
      .catch((err) => {
        console.error("CLI not running or blocked", err);
        // Keep loading true to show the Error UI instead of the main app
        setConnectionError(true);
      });
  }, [API_URL]);

  useEffect(() => {
    // Wrap in setTimeout to avoid "setState synchronously" lint error
    const timer = setTimeout(() => {
      fetchSchema();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSchema]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/_mockserver/schema`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schema),
      });
      // Simulate network delay for UX
      setTimeout(() => setSaving(false), 600);
    } catch (e) {
      setSaving(false);
      alert("Failed to save. Check console.");
    }
  };

  const handleDragSort = () => {
    const _resources = [...schema.resources];
    const draggedItemContent = _resources[dragItem.current!];
    _resources.splice(dragItem.current!, 1);
    _resources.splice(dragOverItem.current!, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setSchema({ ...schema, resources: _resources });
  };

  const runApiTest = async (resource: Resource) => {
    setTestResponse("Loading...");
    try {
      const res = await fetch(`${API_URL}${resource.endpoint}`);
      const data = await res.json();
      setTestResponse(data);
    } catch (e) {
      setTestResponse({
        error: "Failed to fetch. Is the mock server running?",
      });
    }
  };

  const selectedResource = schema.resources.find((r) => r.id === selectedResId);

  // UPDATED LOADING & ERROR UI
  if (loading) {
    if (connectionError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
          <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <WifiOff className="text-red-500" size={32} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              Unable to Connect
            </h2>

            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              We can't detect the MockServer running at{" "}
              <code className="px-1.5 py-0.5 rounded bg-gray-100 font-mono text-sm text-slate-700">
                {API_URL}
              </code>
            </p>

            <div className="bg-slate-900 rounded-xl p-4 mb-8 text-left shadow-lg overflow-hidden relative group">
              <div className="flex items-center justify-between mb-2 opacity-50 text-xs text-white  uppercase tracking-wider font-semibold">
                <span>Fast Start</span>
                <Terminal size={12} />
              </div>
              <div className="flex items-center gap-3 font-mono text-sm text-green-400">
                <span className="shrink-0 select-none opacity-50">$</span>
                <span className="selection:bg-green-900">npx cli-mockserver start</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={fetchSchema}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <RefreshCw size={18} /> Retry Connection
              </button>

              <a
                href="/docs"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-slate-700 py-3.5 rounded-xl font-medium transition-all"
              >
                View Setup Guide <ArrowRight size={16} className="opacity-50" />
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <details className="group text-left">
                <summary className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 cursor-pointer font-medium list-none select-none">
                  <Globe size={14} />
                  <span>Troubleshoot: Browser Permissions</span>
                  <div className="grow" />
                  <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                </summary>

                <div className="mt-3 text-sm text-slate-500 pl-6 leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <p className="mb-2">
                    <strong className="text-amber-800">Local Network Access</strong>
                  </p>
                  If the server is running but you still see this, your browser might be blocking access to localhost.
                  Check your browser settings for "Local Network" permissions.
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">
        <Activity className="animate-pulse mr-2" /> Connecting to CLI...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-800 font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Server size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">MockServer</h1>
            <p className="text-xs text-gray-500 font-medium">
              Port: {schema.port} • Host: {schema.host}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-sm active:scale-95",
            saving
              ? "bg-green-100 text-green-700"
              : "bg-slate-900 text-white hover:bg-slate-800",
          )}
        >
          {saving ? (
            "Saved!"
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR: Navigation & Global Config */}
        <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto flex flex-col">
          {/* Global Config Section */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Global Configuration
            </h2>

            <div className="space-y-4">
              {/* Chaos Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "p-1.5 rounded-md",
                      schema.chaos.enabled
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-400",
                    )}
                  >
                    <AlertTriangle size={14} />
                  </div>
                  <span className="text-sm font-medium">Chaos Mode</span>
                </div>
                <Toggle
                  checked={schema.chaos.enabled}
                  onChange={(v) =>
                    setSchema({
                      ...schema,
                      chaos: { ...schema.chaos, enabled: v },
                    })
                  }
                />
              </div>

              {/* Delay Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "p-1.5 rounded-md",
                      schema.delay?.enabled
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-100 text-gray-400",
                    )}
                  >
                    <Clock size={14} />
                  </div>
                  <span className="text-sm font-medium">Latency</span>
                </div>
                <Toggle
                  checked={!!schema.delay?.enabled}
                  onChange={(v) =>
                    setSchema({
                      ...schema,
                      delay: {
                        min: 100,
                        max: 1000,
                        ...schema.delay,
                        enabled: v,
                      },
                    })
                  }
                />
              </div>

              {/* Auth Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "p-1.5 rounded-md",
                      schema.auth?.enabled
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-400",
                    )}
                  >
                    <Shield size={14} />
                  </div>
                  <span className="text-sm font-medium">Auth Guard</span>
                </div>
                <Toggle
                  checked={!!schema.auth?.enabled}
                  onChange={(v) =>
                    setSchema({
                      ...schema,
                      auth: { type: "bearer", ...schema.auth, enabled: v },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Resources List */}
          <div className="p-4 flex-1">
            <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Resources
              </h2>
              <button
                onClick={() => {
                  const newRes: Resource = {
                    id: crypto.randomUUID(),
                    name: "New Resource",
                    endpoint: "/resource",
                    method: "GET",
                    count: 10,
                    fields: { id: "uuid", name: "firstName" },
                  };
                  setSchema({
                    ...schema,
                    resources: [...schema.resources, newRes],
                  });
                  setSelectedResId(newRes.id);
                }}
                className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-1">
              {schema.resources.map((res, index) => (
                <div
                  key={res.id}
                  draggable
                  onDragStart={() => (dragItem.current = index)}
                  onDragEnter={() => (dragOverItem.current = index)}
                  onDragEnd={handleDragSort}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => setSelectedResId(res.id)}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all border border-transparent",
                    selectedResId === res.id
                      ? "bg-blue-50/80 border-blue-100 shadow-sm"
                      : "hover:bg-gray-50",
                  )}
                >
                  <GripVertical
                    size={14}
                    className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab"
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded border",
                      res.method === "GET"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : res.method === "POST"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : res.method === "DELETE"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-amber-50 text-amber-600 border-amber-100",
                    )}
                  >
                    {res.method}
                  </span>
                  <span
                    className={cn(
                      "text-sm truncate flex-1",
                      selectedResId === res.id
                        ? "font-semibold text-gray-900"
                        : "text-gray-600",
                    )}
                  >
                    {res.name}
                  </span>
                  {selectedResId === res.id && (
                    <ChevronRight size={14} className="text-blue-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#F5F5F7] p-8">
          {selectedResource ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Resource Title & Tabs */}
              <div className="flex justify-between items-end mb-6">
                <div>
                  <input
                    value={selectedResource.name}
                    onChange={(e) => {
                      const updated = schema.resources.map((r) =>
                        r.id === selectedResource.id
                          ? { ...r, name: e.target.value }
                          : r,
                      );
                      setSchema({ ...schema, resources: updated });
                    }}
                    className="bg-transparent text-3xl font-bold text-slate-900 focus:outline-none placeholder-gray-300 w-full"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      value={selectedResource.method}
                      onChange={(e) => {
                        const updated = schema.resources.map((r) =>
                          r.id === selectedResource.id
                            ? { ...r, method: e.target.value as any }
                            : r,
                        );
                        setSchema({ ...schema, resources: updated });
                      }}
                      className="bg-gray-200/50 text-xs font-bold px-2 py-1 rounded text-gray-600 border-none focus:ring-0 cursor-pointer"
                    >
                      {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                    <input
                      value={selectedResource.endpoint}
                      onChange={(e) => {
                        const updated = schema.resources.map((r) =>
                          r.id === selectedResource.id
                            ? { ...r, endpoint: e.target.value }
                            : r,
                        );
                        setSchema({ ...schema, resources: updated });
                      }}
                      className="bg-transparent font-mono text-sm text-slate-500 focus:text-blue-600 focus:outline-none w-64"
                    />
                  </div>
                </div>

                <div className="flex bg-gray-200/50 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab("design")}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                      activeTab === "design"
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    Design
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("test");
                      runApiTest(selectedResource);
                    }}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                      activeTab === "test"
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    Test <Play size={12} fill="currentColor" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("data");
                    }}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                      activeTab === "data"
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500 hover:text-gray-700",
                    )}
                  >
                    Data{" "}
                    <Database
                      size={12}
                      fill="currentColor"
                      className="opacity-50"
                    />
                  </button>
                </div>
              </div>

              {activeTab === "design" ? (
                <>
                  {/* Schema Fields Editor */}
                  <Card title="Response Schema">
                    <div className="space-y-3">
                      {Object.entries(selectedResource.fields).map(
                        ([key, type]) => (
                          <div
                            key={key}
                            className="flex gap-4 items-center group"
                          >
                            <input
                              value={key}
                              readOnly
                              className="w-1/3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-3 py-2"
                            />
                            <div className="text-gray-300 font-light">→</div>
                            <input
                              value={String(type)}
                              onChange={(e) => {
                                const newFields = {
                                  ...selectedResource.fields,
                                  [key]: e.target.value,
                                };
                                const updated = schema.resources.map((r) =>
                                  r.id === selectedResource.id
                                    ? { ...r, fields: newFields }
                                    : r,
                                );
                                setSchema({ ...schema, resources: updated });
                              }}
                              className="flex-1 text-sm font-mono text-blue-600 bg-white border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                            />
                            <button
                              onClick={() => {
                                const newFields = {
                                  ...selectedResource.fields,
                                };
                                delete newFields[key];
                                const updated = schema.resources.map((r) =>
                                  r.id === selectedResource.id
                                    ? { ...r, fields: newFields }
                                    : r,
                                );
                                setSchema({ ...schema, resources: updated });
                              }}
                              className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ),
                      )}

                      <div className="pt-4 mt-4 border-t border-gray-50 flex gap-3">
                        <input
                          id="newKey"
                          placeholder="field_name"
                          className="w-1/3 text-sm border border-gray-200 rounded px-3 py-2 bg-gray-50/50"
                        />
                        <select
                          id="newType"
                          className="flex-1 text-sm border border-gray-200 rounded px-3 py-2 bg-white"
                        >
                          <option value="uuid">uuid</option>
                          <option value="firstName">firstName</option>
                          <option value="email">email</option>
                          <option value="avatar">avatar</option>
                          <option value="boolean">boolean</option>
                          <option value="date:recent">date:recent</option>
                        </select>
                        <button
                          onClick={() => {
                            const keyInput = document.getElementById(
                              "newKey",
                            ) as HTMLInputElement;
                            const typeInput = document.getElementById(
                              "newType",
                            ) as HTMLSelectElement;
                            if (keyInput.value) {
                              const newFields = {
                                ...selectedResource.fields,
                                [keyInput.value]: typeInput.value,
                              };
                              const updated = schema.resources.map((r) =>
                                r.id === selectedResource.id
                                  ? { ...r, fields: newFields }
                                  : r,
                              );
                              setSchema({ ...schema, resources: updated });
                              keyInput.value = "";
                            }
                          }}
                          className="bg-gray-900 text-white px-4 rounded-lg text-sm font-medium hover:bg-black transition"
                        >
                          Add Field
                        </button>
                      </div>
                    </div>
                  </Card>

                  {/* Settings Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Data Count */}
                    <Card title="Generation Settings">
                      <label className="block mb-2 text-xs font-semibold text-gray-500 uppercase">
                        Item Count
                      </label>
                      <input
                        type="number"
                        value={selectedResource.count}
                        onChange={(e) => {
                          const updated = schema.resources.map((r) =>
                            r.id === selectedResource.id
                              ? { ...r, count: parseInt(e.target.value) }
                              : r,
                          );
                          setSchema({ ...schema, resources: updated });
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                      />

                      <div className="mt-6 flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Pagination
                        </label>
                        <Toggle
                          checked={!!selectedResource.pagination?.enabled}
                          onChange={(v) => {
                            const updated = schema.resources.map((r) =>
                              r.id === selectedResource.id
                                ? {
                                  ...r,
                                  pagination: v
                                    ? { enabled: true, pageSize: 10 }
                                    : undefined,
                                }
                                : r,
                            );
                            setSchema({ ...schema, resources: updated });
                          }}
                        />
                      </div>
                    </Card>

                    {/* Endpoint Specific Chaos */}
                    <Card title="Endpoint Chaos">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700">
                          Simulate Errors
                        </label>
                        <Toggle
                          checked={!!selectedResource.errorConfig}
                          onChange={(v) => {
                            const updated = schema.resources.map((r) =>
                              r.id === selectedResource.id
                                ? {
                                  ...r,
                                  errorConfig: v
                                    ? {
                                      rate: 0.1,
                                      code: 500,
                                      message: "Server Error",
                                    }
                                    : undefined,
                                }
                                : r,
                            );
                            setSchema({ ...schema, resources: updated });
                          }}
                        />
                      </div>
                      {selectedResource.errorConfig && (
                        <div className="space-y-3 bg-red-50 p-4 rounded-xl border border-red-100">
                          <div>
                            <div className="flex justify-between text-xs mb-1 text-red-800 font-medium">
                              <span>Failure Rate</span>
                              <span>
                                {(
                                  selectedResource.errorConfig.rate * 100
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={selectedResource.errorConfig.rate}
                              onChange={(e) => {
                                if (!selectedResource.errorConfig) return;
                                const updated = schema.resources.map((r) =>
                                  r.id === selectedResource.id
                                    ? {
                                      ...r,
                                      errorConfig: {
                                        ...r.errorConfig!,
                                        rate: parseFloat(e.target.value),
                                      },
                                    }
                                    : r,
                                );
                                setSchema({ ...schema, resources: updated });
                              }}
                              className="w-full h-1.5 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={selectedResource.errorConfig.code}
                              className="w-20 bg-white border border-red-200 text-red-700 text-sm rounded px-2 py-1"
                              onChange={(e) => {
                                if (!selectedResource.errorConfig) return;
                                const updated = schema.resources.map((r) =>
                                  r.id === selectedResource.id
                                    ? {
                                      ...r,
                                      errorConfig: {
                                        ...r.errorConfig!,
                                        code: parseInt(e.target.value),
                                      },
                                    }
                                    : r,
                                );
                                setSchema({ ...schema, resources: updated });
                              }}
                            />
                            <input
                              value={selectedResource.errorConfig.message}
                              onChange={(e) => {
                                if (!selectedResource.errorConfig) return;
                                const updated = schema.resources.map((r) =>
                                  r.id === selectedResource.id
                                    ? {
                                      ...r,
                                      errorConfig: {
                                        ...r.errorConfig!,
                                        message: e.target.value,
                                      },
                                    }
                                    : r,
                                );
                                setSchema({ ...schema, resources: updated });
                              }}
                              className="flex-1 bg-white border border-red-200 text-red-700 text-sm rounded px-2 py-1"
                            />
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>

                  <div className="text-center pt-8">
                    {/* ... footer or saving status ... */}
                  </div>
                </>
              ) : activeTab === "test" ? (
                // Test Tab (simplified placeholder or existing logic if I had view of it, assuming I insert after Design block end)
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">
                      API Response Preview
                    </h3>
                    <button
                      onClick={() => runApiTest(selectedResource)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-600 font-medium"
                    >
                      Re-run Request
                    </button>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    {testResponse === "Loading..." ? (
                      <div className="text-gray-400 animate-pulse">
                        Sending request to {selectedResource.endpoint}...
                      </div>
                    ) : (
                      <pre className="text-green-400">
                        {JSON.stringify(testResponse, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ) : (
                // Data Tab
                <DataBrowser
                  resourceId={selectedResource.id}
                  fields={selectedResource.fields}
                  apiUrl={API_URL}
                />
              )}
              <button
                onClick={() => {
                  const res = schema.resources.filter(
                    (r) => r.id !== selectedResource.id,
                  );
                  setSchema({ ...schema, resources: res });
                  setSelectedResId(res[0]?.id || null);
                }}
                className="text-red-400 hover:text-red-600 text-sm font-medium flex items-center gap-2 mx-auto transition-colors"
              >
                <Trash2 size={14} /> Delete Resource
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <Settings size={48} className="mb-4 text-gray-200" />
              <p>Select a resource to configure</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
