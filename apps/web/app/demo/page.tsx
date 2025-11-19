"use client";

import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, AlertTriangle, Server } from "lucide-react";

// Note: In a real app, you'd use react-query or fetch inside useEffect

interface Resource {
  id: string;
  name: string;
  endpoint: string;
  count: number;
  fields: { [key: string]: string };
  errorConfig?: {
    rate: number;
    code: number;
    message: string;
  };
}

interface Schema {
  resources: Resource[];
  port: number;
  chaos: {
    enabled: boolean;
  };
}

export default function App() {
  const [schema, setSchema] = useState<Schema>({ resources: [], port: 0, chaos: { enabled: false } });
  const [loading, setLoading] = useState(true);
  const [API_URL, setAPI_URL] = useState('');

  // Initialize API_URL and Fetch Schema on Load
  useEffect(() => {
    const cliHost =
      new URLSearchParams(window.location.search).get("host") ||
      "localhost:9500";
    setAPI_URL(`http://${cliHost}`);
  }, []);

  useEffect(() => {
    if (API_URL) {
      fetch(`${API_URL}/_system/schema`)
        .then((res) => res.json())
        .then((data: Schema) => {
          setSchema(data);
          setLoading(false);
        })
        .catch((err) => console.error("Ensure CLI is running!", err));
    }
  }, [API_URL]);

  const handleSave = async () => {
    await fetch(`${API_URL}/_system/schema`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schema),
    });
    alert("Schema Saved & Server Updated!");
  };

  const addResource = () => {
    const newRes = {
      id: crypto.randomUUID(),
      name: "New Resource",
      endpoint: "/new-endpoint",
      count: 5,
      fields: { id: "uuid", title: "sentence" },
    };
    setSchema({ ...schema, resources: [...schema.resources, newRes] });
  };

  if (loading)
    return <div className="p-10 text-center">Connecting to CLI...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800 font-sans">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Server className="text-indigo-600" /> Mock & Chaos CLI
          </h1>
          <p className="text-gray-500">Running on port {schema.port}</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all"
        >
          <Save size={18} /> Save & Hot Reload
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resources Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Active Endpoints
          </h2>

          {schema.resources.map((res, idx) => (
            <div
              key={res.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <input
                    value={res.name}
                    onChange={(e) => {
                      const newRes = [...schema.resources];
                      newRes[idx].name = e.target.value;
                      setSchema({ ...schema, resources: newRes });
                    }}
                    className="text-xl font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none"
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">
                      GET
                    </span>
                    <input
                      value={res.endpoint}
                      onChange={(e) => {
                        const newRes = [...schema.resources];
                        newRes[idx].endpoint = e.target.value;
                        setSchema({ ...schema, resources: newRes });
                      }}
                      className="text-sm text-indigo-600 font-mono bg-transparent border-b border-transparent hover:border-gray-300 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newRes = schema.resources.filter(
                      (r) => r.id !== res.id,
                    );
                    setSchema({ ...schema, resources: newRes });
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Item Count
                  </label>
                  <input
                    type="number"
                    value={res.count}
                    onChange={(e) => {
                      const newRes = [...schema.resources];
                      newRes[idx].count = parseInt(e.target.value);
                      setSchema({ ...schema, resources: newRes });
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2"
                  />
                </div>
                {/* Error Config Specific to Resource */}
                <div
                  className={`p-3 rounded border ${res.errorConfig ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                      <AlertTriangle size={12} /> Chaos Rate
                    </label>
                    <input
                      type="checkbox"
                      checked={!!res.errorConfig}
                      onChange={(e) => {
                        const newRes = [...schema.resources];
                        if (e.target.checked) {
                          newRes[idx].errorConfig = {
                            rate: 0.1,
                            code: 500,
                            message: "Error",
                          };
                        } else {
                          delete newRes[idx].errorConfig;
                        }
                        setSchema({ ...schema, resources: newRes });
                      }}
                    />
                  </div>
                  {res.errorConfig && (
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={res.errorConfig.rate}
                      onChange={(e) => {
                        const newRes = [...schema.resources];
                        if (newRes[idx].errorConfig) {
                          newRes[idx].errorConfig.rate = parseFloat(
                            e.target.value,
                          );
                        }
                        setSchema({ ...schema, resources: newRes });
                      }}
                      className="w-full accent-red-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  )}
                  {res.errorConfig && (
                    <div className="text-right text-xs text-red-600 font-bold mt-1">
                      {(res.errorConfig.rate * 100).toFixed(0)}% Fail Rate
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
                <pre>{JSON.stringify(res.fields, null, 2)}</pre>
              </div>
              <div className="mt-2 text-xs text-gray-400 text-center">
                (Edit fields directly in schema.json for now)
              </div>
            </div>
          ))}

          <button
            onClick={addResource}
            className="w-full border-2 border-dashed border-gray-300 text-gray-400 rounded-xl p-4 hover:border-indigo-400 hover:text-indigo-500 transition-all flex justify-center items-center gap-2"
          >
            <Plus size={20} /> Add New Resource Endpoint
          </button>
        </div>

        {/* Global Settings Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Global Settings
            </h2>

            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Enable Global Chaos
                </span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input
                    type="checkbox"
                    checked={schema.chaos.enabled}
                    onChange={(e) =>
                      setSchema({
                        ...schema,
                        chaos: { ...schema.chaos, enabled: e.target.checked },
                      })
                    }
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-indigo-600"
                    style={{
                      right: schema.chaos.enabled ? "0" : "auto",
                      left: schema.chaos.enabled ? "auto" : "0",
                    }}
                  />
                  <label
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${schema.chaos.enabled ? "bg-indigo-600" : "bg-gray-300"}`}
                  ></label>
                </div>
              </label>
              <p className="text-xs text-gray-400">
                If enabled, all endpoints will randomly fail based on
                configuration.
              </p>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h3 className="font-bold text-indigo-900 text-sm mb-2">
                How to use
              </h3>
              <ul className="text-xs text-indigo-800 space-y-2 list-disc pl-4">
                <li>Edit endpoints on the left.</li>
                <li>
                  Click <strong>Save & Hot Reload</strong> to update the running
                  CLI instantly.
                </li>
                <li>
                  Access data via{" "}
                  <code>http://localhost:{schema.port}/[endpoint]</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
