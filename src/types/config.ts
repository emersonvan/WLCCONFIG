export interface NetworkData {
  ssids?: Array<{
    id: string;
    name: string;
    authType: string;
    security: string;
    vlan: number;
    status: "enabled" | "disabled";
    policyProfile: string;
  }>;
  flexConnectGroups?: Array<{
    name: string;
    primaryController: string;
    apsCount: number;
    status: "enabled" | "disabled";
  }>;
  apGroups?: Array<{
    name: string;
    description: string;
    apsCount: number;
    siteTag: string;
    rfProfile: string;
  }>;
  policyProfiles?: Array<{
    name: string;
    type: string;
    vlan: number;
    qos: string;
    aaa: string;
  }>;
  policyTags?: Array<{
    name: string;
    description: string;
    policies: string[];
  }>;
}

export interface ConfigItem {
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
