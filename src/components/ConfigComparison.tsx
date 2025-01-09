import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import RecommendationPanel from "./RecommendationPanel";

interface ConfigItem {
  id: string;
  category: string;
  currentValue: string;
  bestPractice: string;
  status: "matched" | "mismatched";
  description?: string;
  impact?: string;
  recommendation?: string;
  currentConfig?: string;
  relatedTo?: {
    type: "ssid" | "ap-group" | "rf-profile" | "policy";
    name: string;
    config?: string;
  };
  currentCommand?: string;
  recommendedCommand?: string;
}

interface ConfigComparisonProps {
  configItems?: ConfigItem[];
  onConfigSelect?: (itemId: string) => void;
}

const defaultConfigItems: ConfigItem[] = [
  {
    id: "1",
    category: "Security - WPA3",
    currentValue: "WPA2",
    bestPractice: "WPA3",
    status: "mismatched",
    description:
      "Current wireless security protocol is using older WPA2 standard",
    impact: "Reduced security protection against modern wireless attacks",
    recommendation:
      "Upgrade to WPA3 for enhanced security features including SAE (Simultaneous Authentication of Equals)",
    currentConfig: `wlan Corporate-Main 1
  security wpa2
  security ft disable
  no security pmf
  no security wpa3`,
    relatedTo: {
      type: "ssid",
      name: "Corporate-Main",
      config: `wlan Corporate-Main 1
  security wpa2
  security ft disable
  no security pmf
  no security wpa3
  aaa-override
  nac
  radio policy
  session-timeout 1800
  wlan-id 1
  wlan-profile-name Corporate-Main
  service-policy input platinum-up
  service-policy output platinum`,
    },
    currentCommand: "show wlan 1 security",
    recommendedCommand:
      "config wlan security wpa3 enable 1\nconfig wlan security pmf mandatory 1",
  },
  {
    id: "2",
    category: "RF Management - Data Rate",
    currentValue: "6 Mbps",
    bestPractice: "12 Mbps",
    status: "mismatched",
    description: "Data rate set too low for optimal performance",
    impact: "Reduced network performance and increased airtime utilization",
    recommendation:
      "Increase minimum data rate to 12 Mbps to improve overall network efficiency",
    currentConfig: `rf-profile high-density
  data-rates 802.11a mandatory 6
  data-rates 802.11a supported 9 12 18 24 36 48 54`,
    relatedTo: {
      type: "rf-profile",
      name: "high-density",
      config: `rf-profile high-density
  description "High Density RF Profile"
  data-rates 802.11a mandatory 6
  data-rates 802.11a supported 9 12 18 24 36 48 54
  tx-power-min 10
  tx-power-max 17
  coverage-hole-detection enable
  coverage level global 2
  client-network-preference default`,
    },
    currentCommand: "show rf-profile detailed high-density",
    recommendedCommand:
      "config rf-profile data-rates minimum 12Mbps profile-name high-density",
  },
];

const ConfigComparison = ({
  configItems = defaultConfigItems,
  onConfigSelect = () => {},
}: ConfigComparisonProps) => {
  const [selectedItem, setSelectedItem] = useState<ConfigItem | null>(null);

  return (
    <div className="w-full h-[600px] bg-white p-4 flex gap-4">
      <Card className="flex-1 p-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Settings</TabsTrigger>
            <TabsTrigger value="mismatched">Mismatched Only</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {configItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${item.status === "mismatched" ? "border-red-200" : "border-green-200"}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{item.category}</h3>
                      <Badge
                        variant={
                          item.status === "matched" ? "success" : "destructive"
                        }
                      >
                        {item.status === "matched" ? "Matched" : "Mismatched"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Current Value
                        </p>
                        <p
                          className={`text-sm ${item.status === "mismatched" ? "text-red-600" : "text-green-600"}`}
                        >
                          {item.currentValue}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Best Practice
                        </p>
                        <p className="text-sm text-green-600">
                          {item.bestPractice}
                        </p>
                      </div>
                    </div>
                    {item.relatedTo && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-gray-600">
                          {item.relatedTo.type}: {item.relatedTo.name}
                        </Badge>
                      </div>
                    )}
                    {item.status === "mismatched" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="mismatched" className="mt-0">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {configItems
                  .filter((item) => item.status === "mismatched")
                  .map((item) => (
                    <Card
                      key={item.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow border-red-200"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.category}</h3>
                        <Badge variant="destructive">Mismatched</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Current Value
                          </p>
                          <p className="text-sm text-red-600">
                            {item.currentValue}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Best Practice
                          </p>
                          <p className="text-sm text-green-600">
                            {item.bestPractice}
                          </p>
                        </div>
                      </div>
                      {item.relatedTo && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-gray-600">
                            {item.relatedTo.type}: {item.relatedTo.name}
                          </Badge>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                      >
                        View Details
                      </Button>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>

      <RecommendationPanel />

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              {selectedItem?.category}
            </DialogTitle>
            <DialogDescription>
              Configuration Analysis Details
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium mb-2">Current Value</h4>
                  <p className="text-red-600">{selectedItem.currentValue}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recommended Value</h4>
                  <p className="text-green-600">{selectedItem.bestPractice}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Issue Description</h4>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Potential Impact</h4>
                  <p className="text-gray-600">{selectedItem.impact}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Recommendation</h4>
                  <p className="text-gray-600">{selectedItem.recommendation}</p>
                </div>

                {selectedItem.relatedTo && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Configuration Context</h4>
                      <Badge variant="outline" className="text-gray-600">
                        {selectedItem.relatedTo.type}:{" "}
                        {selectedItem.relatedTo.name}
                      </Badge>
                    </div>
                    <pre className="p-3 bg-gray-900 text-gray-100 rounded-md text-sm font-mono overflow-x-auto">
                      {selectedItem.relatedTo.config ||
                        selectedItem.currentConfig}
                    </pre>
                  </div>
                )}

                {(selectedItem.currentCommand ||
                  selectedItem.recommendedCommand) && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">WLC Commands</h4>
                    <div className="space-y-3">
                      {selectedItem.currentCommand && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Current Configuration Command:
                          </p>
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono">
                            {selectedItem.currentCommand}
                          </pre>
                        </div>
                      )}
                      {selectedItem.recommendedCommand && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Recommended Configuration Command:
                          </p>
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm font-mono whitespace-pre-wrap">
                            {selectedItem.recommendedCommand}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfigComparison;
