import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, AlertCircle, AlertTriangle, Info } from "lucide-react";

interface RecommendationStep {
  step: number;
  description: string;
  command?: string;
}

interface Recommendation {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  description: string;
  steps: RecommendationStep[];
}

interface RecommendationPanelProps {
  recommendations?: Recommendation[];
  onStepClick?: (recommendationId: string, step: number) => void;
}

const defaultRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "WLAN Security Configuration",
    severity: "critical",
    description: "WPA3 encryption is not enabled on all WLANs",
    steps: [
      {
        step: 1,
        description: "Navigate to Configuration > WLANs",
        command: "show wlan summary",
      },
      {
        step: 2,
        description: "Select the target WLAN",
        command: "config wlan disable 1",
      },
      {
        step: 3,
        description: "Enable WPA3 under Security tab",
        command:
          "config wlan security wpa3 enable 1\nconfig wlan security pmf mandatory 1\nconfig wlan enable 1",
      },
    ],
  },
  {
    id: "2",
    title: "RF Profile Settings",
    severity: "warning",
    description: "Data rates not optimized for high-density environment",
    steps: [
      {
        step: 1,
        description: "Access RF Profiles section",
        command: "show rf-profile summary",
      },
      {
        step: 2,
        description: "Adjust minimum data rate to 12 Mbps",
        command:
          "config rf-profile data-rates minimum 12Mbps profile-name high-density",
      },
    ],
  },
  {
    id: "3",
    title: "System Logging",
    severity: "info",
    description: "Syslog server not configured for external logging",
    steps: [
      {
        step: 1,
        description: "Configure syslog server settings",
        command: "config logging syslog host 192.168.1.100",
      },
      {
        step: 2,
        description: "Verify connectivity",
        command: "show logging",
      },
    ],
  },
];

const getSeverityIcon = (severity: Recommendation["severity"]) => {
  switch (severity) {
    case "critical":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const RecommendationPanel = ({
  recommendations = defaultRecommendations,
  onStepClick = () => {},
}: RecommendationPanelProps) => {
  const [selectedStep, setSelectedStep] = React.useState<{
    recId: string;
    step: number;
  } | null>(null);

  const handleStepClick = (recId: string, step: number) => {
    setSelectedStep({ recId, step });
    onStepClick(recId, step);
  };

  return (
    <Card className="w-[400px] h-[600px] bg-white p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
      <ScrollArea className="flex-1">
        {recommendations.map((rec) => (
          <div key={rec.id} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              {getSeverityIcon(rec.severity)}
              <h3 className="font-medium">{rec.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
            <div className="space-y-2">
              {rec.steps.map((step) => (
                <div key={step.step} className="group">
                  <Button
                    variant="outline"
                    className="w-full text-left flex items-center justify-between p-3 hover:bg-gray-50"
                    onClick={() => handleStepClick(rec.id, step.step)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Step {step.step}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                      {selectedStep?.recId === rec.id &&
                        selectedStep?.step === step.step &&
                        step.command && (
                          <pre className="mt-2 p-2 bg-gray-900 text-gray-100 rounded text-xs font-mono overflow-x-auto">
                            {step.command}
                          </pre>
                        )}
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                  </Button>
                </div>
              ))}
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
};

export default RecommendationPanel;
