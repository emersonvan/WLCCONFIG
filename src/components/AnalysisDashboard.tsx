import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueSummary from "./IssueSummary";
import ConfigComparison from "./ConfigComparison";
import NetworkInfo from "./NetworkInfo";
import FileUpload from "./FileUpload";

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
  const [error, setError] = useState("");

  const handleFileSelect = (file: File) => {
    setError("");
    setAnalysisState({
      status: "analyzing",
      fileName: file.name,
    });
    setActiveTab("analysis");

    // Simulate analysis completion after 2 seconds
    setTimeout(() => {
      setAnalysisState({
        status: "complete",
        fileName: file.name,
      });
    }, 2000);
  };

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
                    Analyzing: {analysisState.fileName}
                  </div>
                )}

                <IssueSummary />

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
                    <NetworkInfo />
                  </TabsContent>

                  <TabsContent value="issues" className="mt-0">
                    <ConfigComparison />
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
