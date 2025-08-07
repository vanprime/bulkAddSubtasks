import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import "./index.css";

function Options() {
  const [configs, setConfigs] = useState([]);
  const [newConfig, setNewConfig] = useState({ url: "", containerId: "" });
  const [includeReporter, setIncludeReporter] = useState(false);

  useEffect(() => {
    // Load configs from storage
    browser.storage.sync.get(["configs", "includeReporter"]).then((result) => {
      if (result.configs) {
        setConfigs(result.configs);
      }
      if (result.includeReporter) {
        setIncludeReporter(result.includeReporter);
      }
    });
  }, []);

  const handleNewConfigChange = (e) => {
    setNewConfig({ ...newConfig, [e.target.name]: e.target.value });
  };

  const handleAddConfig = () => {
    if (newConfig.url && newConfig.containerId) {
      const updatedConfigs = [...configs, newConfig];
      setConfigs(updatedConfigs);
      setNewConfig({ url: "", containerId: "" });
      browser.storage.sync.set({ configs: updatedConfigs });
    }
  };

  const handleRemoveConfig = (index) => {
    const updatedConfigs = configs.filter((_, i) => i !== index);
    setConfigs(updatedConfigs);
    browser.storage.sync.set({ configs: updatedConfigs });
  };

  const handleIncludeReporterChange = (e) => {
    setIncludeReporter(e.target.checked);
    browser.storage.sync.set({ includeReporter: e.target.checked });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Jira Bulk Options</h1>

      {/* URL Configuration */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">URL Configuration</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            name="url"
            placeholder="URL (e.g., jira.example.com)"
            value={newConfig.url}
            onChange={handleNewConfigChange}
            className="flex-grow rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          />
          <input
            type="text"
            name="containerId"
            placeholder="Container ID"
            value={newConfig.containerId}
            onChange={handleNewConfigChange}
            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          />
          <button
            onClick={handleAddConfig}
            className="h-9 px-4 py-2 bg-muted rounded-md text-sm font-medium"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {configs.map((config, index) => (
            <li key={index} className="flex items-center justify-between p-2 rounded-md bg-slate-100">
              <div>
                <span className="font-medium">{config.url}</span> -{" "}
                <span className="text-slate-600">{config.containerId}</span>
              </div>
              <button
                onClick={() => handleRemoveConfig(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Field Configuration */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Field Configuration</h2>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeReporter"
            checked={includeReporter}
            onChange={handleIncludeReporterChange}
            className="h-4 w-4"
          />
          <label htmlFor="includeReporter">Include Reporter Field</label>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Options />);
