import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronRight, AlertCircle, AlertTriangle, Info } from "lucide-react";

interface RecommendationStep {
  step: number;
  description: string;
  command?: string;
  configContext?: string;
  relatedTo?: {
    type: "ssid" | "ap-group" | "rf-profile" | "policy";
    name: string;
  };
}

interface Recommendation {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  description: string;
  steps: RecommendationStep[];
  currentConfig?: string;
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
    currentConfig: `wlan Corporate-Main 1
  security wpa2
  security ft disable
  no security pmf
  no security wpa3`,
    steps: [
      {
        step: 1,
        description: "Navigate to Configuration > WLANs",
        command: "show wlan summary",
        relatedTo: {
          type: "ssid",
          name: "Corporate-Main",
        },
      },
      {
        step: 2,
        description: "Select the target WLAN",
        command: "config wlan disable 1",
        configContext: "Disable WLAN before making changes",
      },
      {
        step: 3,
        description: "Enable WPA3 under Security tab",
        command:
          "config wlan security wpa3 enable 1\nconfig wlan security pmf mandatory 1\nconfig wlan enable 1",
        configContext: "Enable WPA3 and PMF, then re-enable WLAN",
      },
    ],
  },
  {
    id: "2",
    title: "RF Profile Settings",
    severity: "warning",
    description: "Data rates not optimized for high-density environment",
    currentConfig: `rf-profile high-density
  data-rates 802.11a mandatory 6
  data-rates 802.11a supported 9 12 18 24 36 48 54`,
    steps: [
      {
        step: 1,
        description: "Access RF Profiles section",
        command: "show rf-profile detailed high-density",
        relatedTo: {
          type: "rf-profile",
          name: "high-density",
        },
      },
      {
        step: 2,
        description: "Adjust minimum data rate to 12 Mbps",
        command:
          "config rf-profile data-rates minimum 12Mbps profile-name high-density",
        configContext: "Update minimum data rate for better performance",
      },
    ],
  },
  {
    id: "3",
    title: "System Logging",
    severity: "info",
    description: "Syslog server not configured for external logging",
    currentConfig: `logging buffered 16384
logging console 7
no logging syslog`,
    steps: [
      {
        step: 1,
        description: "Configure syslog server settings",
        command: "config logging syslog host 192.168.1.100",
        configContext: "Add external syslog server",
      },
      {
        step: 2,
        description: "Verify connectivity",
        command: "show logging",
        configContext: "Verify syslog configuration",
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

const getSeverityColor = (severity: Recommendation["severity"]) => {
  switch (severity) {
    case "critical":
      return "text-red-500";
    case "warning":
      return "text-yellow-500";
    case "info":
      return "text-blue-500";
  }
};

const RecommendationPanel = ({
  recommendations = defaultRecommendations,
  onStepClick = () => {},
}: RecommendationPanelProps) => {
  const [selectedRec, setSelectedRec] = React.useState<Recommendation | null>(
    null,
  );

  return (
    <Card className="w-[400px] h-[600px] bg-white p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
      <ScrollArea className="flex-1">
        {recommendations.map((rec) => (
          <div key={rec.id} className="mb-6">
            <Button
              variant="ghost"
              className="w-full text-left p-3 hover:bg-gray-50"
              onClick={() => setSelectedRec(rec)}
            >
              <div className="flex items-center gap-2">
                {getSeverityIcon(rec.severity)}
                <div>
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
            </Button>
            <Separator className="mt-4" />
          </div>
        ))}
      </ScrollArea>

      <Dialog open={!!selectedRec} onOpenChange={() => setSelectedRec(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRec && getSeverityIcon(selectedRec.severity)}
              <span>{selectedRec?.title}</span>
            </DialogTitle>
            <DialogDescription>{selectedRec?.description}</DialogDescription>
          </DialogHeader>

          {selectedRec && (
            <div className="space-y-6">
              {selectedRec.currentConfig && (
                <div className="space-y-2">
                  <h4 className="font-medium">Current Configuration</h4>
                  <pre className="p-3 bg-gray-900 text-gray-100 rounded-md text-sm font-mono overflow-x-auto">
                    {selectedRec.currentConfig}
                  </pre>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-medium">Resolution Steps</h4>
                {selectedRec.steps.map((step) => (
                  <div
                    key={step.step}
                    className="space-y-2 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Step {step.step}</h5>
                      {step.relatedTo && (
                        <Badge
                          variant="outline"
                          className={getSeverityColor(selectedRec.severity)}
                        >
                          {step.relatedTo.type}: {step.relatedTo.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                    {step.configContext && (
                      <p className="text-sm text-gray-500">
                        {step.configContext}
                      </p>
                    )}
                    {step.command && (
                      <pre className="p-2 bg-gray-900 text-gray-100 rounded text-sm font-mono overflow-x-auto">
                        {step.command}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RecommendationPanel;
