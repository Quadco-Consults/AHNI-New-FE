"use client";

import { useGetAllConfigDropdown } from "@/features/modules/controllers/config/allConfigController";

export default function TestConfigAPI() {
  const { data: allConfigData, isLoading: configLoading, error: configError } = useGetAllConfigDropdown();

  console.log("=== TEST CONFIG API PAGE ===");
  console.log("Loading:", configLoading);
  console.log("Error:", configError);
  console.log("Data:", allConfigData);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Test Config API Debug Page</h1>
      <div>
        <h2>Status:</h2>
        <p>Loading: {configLoading ? "Yes" : "No"}</p>
        <p>Has Error: {configError ? "Yes" : "No"}</p>
        {configError && (
          <div>
            <h3>Error Details:</h3>
            <pre>{JSON.stringify(configError, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h2>Data:</h2>
        {allConfigData ? (
          <div>
            <h3>Counts:</h3>
            <pre>{JSON.stringify(allConfigData.counts, null, 2)}</pre>
            <h3>Available Keys:</h3>
            <pre>{JSON.stringify(Object.keys(allConfigData.data || {}), null, 2)}</pre>
            <h3>Budget Lines Sample:</h3>
            <pre>{JSON.stringify((allConfigData.data?.budget_lines || []).slice(0, 3), null, 2)}</pre>
          </div>
        ) : (
          <p>No data received</p>
        )}
      </div>
    </div>
  );
}