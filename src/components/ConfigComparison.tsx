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
  },
  {
    id: "3",
    category: "System Logging",
    currentValue: "Local Only",
    bestPractice: "Syslog + Local",
    status: "mismatched",
    description: "System logs are only stored locally",
    impact: "Limited log retention and potential loss of critical event data",
    recommendation:
      "Configure external syslog server for centralized logging and long-term retention",
  },
  {
    id: "4",
    category: "DHCP",
    currentValue: "Enabled",
    bestPractice: "Enabled",
    status: "matched",
    description: "DHCP service properly configured",
    impact: "None - configuration matches best practice",
    recommendation: "No changes needed",
  },
  {
    id: "5",
    category: "Security - PMF",
    currentValue: "Disabled",
    bestPractice: "Required",
    status: "mismatched",
    description: "Protected Management Frames (PMF) not enforced",
    impact: "Vulnerable to management frame attacks",
    recommendation: "Enable PMF and set to Required for enhanced security",
  },
  {
    id: "6",
    category: "RF Management - Channel Width",
    currentValue: "20MHz",
    bestPractice: "40MHz",
    status: "mismatched",
    description: "Channel width not optimized for throughput",
    impact: "Reduced wireless throughput and performance",
    recommendation: "Configure 40MHz channel width for 5GHz radios",
  },
  {
    id: "7",
    category: "Security - FT",
    currentValue: "Disabled",
    bestPractice: "Enabled",
    status: "mismatched",
    description: "Fast Transition not enabled",
    impact: "Slower roaming transitions between APs",
    recommendation: "Enable Fast Transition for seamless roaming",
  },
  {
    id: "8",
    category: "RF Management - TPC",
    currentValue: "Manual",
    bestPractice: "Auto",
    status: "mismatched",
    description: "Transmit Power Control not set to automatic",
    impact: "Suboptimal power management and coverage",
    recommendation: "Enable automatic TPC for optimal power management",
  },
  {
    id: "9",
    category: "Security - ARP Caching",
    currentValue: "Disabled",
    bestPractice: "Enabled",
    status: "mismatched",
    description: "ARP caching not enabled",
    impact: "Increased broadcast traffic and potential security risks",
    recommendation: "Enable ARP caching to reduce broadcast traffic",
  },
  {
    id: "10",
    category: "RF Management - Load Balancing",
    currentValue: "Disabled",
    bestPractice: "Enabled",
    status: "mismatched",
    description: "Client load balancing not enabled",
    impact: "Uneven client distribution across APs",
    recommendation: "Enable client load balancing for better distribution",
  },
  {
    id: "11",
    category: "Security - Client Exclusion",
    currentValue: "Disabled",
    bestPractice: "Enabled",
    status: "mismatched",
    description: "Client exclusion policy not configured",
    impact: "No protection against authentication attacks",
    recommendation: "Enable client exclusion with appropriate timeout",
  },
  {
    id: "12",
    category: "RF Management - Band Select",
    currentValue: "Disabled",
    bestPractice: "Enabled",
    status: "mismatched",
    description: "Band selection not enabled",
    impact: "Suboptimal client distribution across bands",
    recommendation: "Enable band select to encourage 5GHz usage",
  },
  {
    id: "13",
    category: "Security - MFP",
    currentValue: "Optional",
    bestPractice: "Required",
    status: "mismatched",
    description: "Management Frame Protection not required",
    impact: "Potential vulnerability to management frame attacks",
    recommendation: "Set MFP to Required for enhanced security",
  },
  {
    id: "14",
    category: "RF Management - Coverage Hole",
    currentValue: "Default",
    bestPractice: "Custom",
    status: "mismatched",
    description: "Coverage hole detection using default settings",
    impact: "May not detect coverage issues effectively",
    recommendation: "Configure custom coverage hole thresholds",
  },
  {
    id: "15",
    category: "Security - Local Auth",
    currentValue: "Enabled",
    bestPractice: "Disabled",
    status: "mismatched",
    description: "Local authentication enabled instead of RADIUS",
    impact: "Limited authentication tracking and control",
    recommendation: "Configure RADIUS authentication for better control",
  },
  {
    id: "16",
    category: "RF Management - ED-RRM",
    currentValue: "Disabled",
    bestPractice: "Enabled",
    status: "mismatched",
    description: "Event Driven RRM not enabled",
    impact: "Slower response to interference events",
    recommendation: "Enable ED-RRM for dynamic interference management",
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
            <DialogTitle>{selectedItem?.category}</DialogTitle>
            <DialogDescription>
              Configuration Analysis Details
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium mb-2">Current Configuration</h4>
                  <p className="text-red-600">{selectedItem.currentValue}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Best Practice</h4>
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfigComparison;
