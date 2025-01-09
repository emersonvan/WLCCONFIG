import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueSummary from "./IssueSummary";
import ConfigComparison from "./ConfigComparison";
import NetworkInfo from "./NetworkInfo";
import FileUpload from "./FileUpload";
import { parseConfigurationFile } from "@/lib/configParser";
import type { NetworkData, ConfigItem } from "@/types/config";

interface AnalysisState {
  status: "idle" | "uploading" | "analyzing" | "complete";
  fileName?: string;
}

interface AnalysisDashboardProps {
  initialState?: AnalysisState;
}

const defaultState: AnalysisState = {
  status: "idle",
};

const AnalysisDashboard = ({
  initialState = defaultState,
}: AnalysisDashboardProps) => {
  const [analysisState, setAnalysisState] =
    useState<AnalysisState>(initialState);
  const [activeTab, setActiveTab] = useState("upload");
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [configIssues, setConfigIssues] = useState<ConfigItem[]>([]);
  const [error, setError] = useState("");

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setError("");
      setAnalysisState({
        status: "analyzing",
        fileName: file.name,
      });
      setActiveTab("analysis");

      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
      });

      const { networkData: parsedData, configIssues: issues } =
        parseConfigurationFile(content);

      setNetworkData(parsedData);
      setConfigIssues(issues);
      setAnalysisState({
        status: "complete",
        fileName: file.name,
      });
    } catch (err) {
      console.error("Error processing file:", err);
      setError(err instanceof Error ? err.message : "Error processing file");
      setAnalysisState({
        status: "idle",
      });
      setNetworkData(null);
      setConfigIssues([]);
    }
  }, []);

  const handleConfigSelect = useCallback((itemId: string) => {
    // Handle config selection if needed
    console.log("Selected config item:", itemId);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#005073]">
            WLC 9800 Configuration Analyzer
          </h1>
        </div>

        <Card className="p-6 bg-white">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="upload">File Upload</TabsTrigger>
              <TabsTrigger
                value="analysis"
                disabled={analysisState.status === "idle"}
              >
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <div className="py-4 flex justify-center">
                <FileUpload onFileSelect={handleFileSelect} error={error} />
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-0">
              <div className="space-y-6">
                {analysisState.fileName && (
                  <div className="text-sm text-gray-600">
                    {analysisState.status === "analyzing"
                      ? "Analyzing: "
                      : "Analysis complete: "}
                    {analysisState.fileName}
                  </div>
                )}

                <IssueSummary issues={configIssues} />

                <Tabs defaultValue="network" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="network">
                      Network Information
                    </TabsTrigger>
                    <TabsTrigger value="issues">
                      Configuration Issues
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="network" className="mt-0">
                    <NetworkInfo data={networkData} />
                  </TabsContent>

                  <TabsContent value="issues" className="mt-0">
                    <ConfigComparison
                      configItems={configIssues}
                      onConfigSelect={handleConfigSelect}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
