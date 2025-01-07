import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface SSID {
  id: string;
  name: string;
  authType: string;
  security: string;
  vlan: number;
  status: "enabled" | "disabled";
  policyProfile: string;
}

interface FlexConnectGroup {
  name: string;
  primaryController: string;
  apsCount: number;
  status: "enabled" | "disabled";
}

interface APGroup {
  name: string;
  description: string;
  apsCount: number;
  siteTag: string;
  rfProfile: string;
}

interface PolicyProfile {
  name: string;
  type: string;
  vlan: number;
  qos: string;
  aaa: string;
}

interface PolicyTag {
  name: string;
  description: string;
  policies: string[];
}

interface NetworkInfoProps {
  ssids?: SSID[];
  flexConnectGroups?: FlexConnectGroup[];
  apGroups?: APGroup[];
  policyProfiles?: PolicyProfile[];
  policyTags?: PolicyTag[];
}

const defaultSSIDs: SSID[] = [
  {
    id: "1",
    name: "Corporate-Main",
    authType: "802.1X",
    security: "WPA2/WPA3",
    vlan: 100,
    status: "enabled",
    policyProfile: "Employee-Policy",
  },
  {
    id: "2",
    name: "Guest-Access",
    authType: "Web-Auth",
    security: "WPA2-PSK",
    vlan: 200,
    status: "enabled",
    policyProfile: "Guest-Policy",
  },
];

const defaultFlexConnectGroups: FlexConnectGroup[] = [
  {
    name: "Branch-Office-1",
    primaryController: "WLC-1",
    apsCount: 5,
    status: "enabled",
  },
  {
    name: "Branch-Office-2",
    primaryController: "WLC-2",
    apsCount: 3,
    status: "enabled",
  },
];

const defaultAPGroups: APGroup[] = [
  {
    name: "Floor-1",
    description: "First Floor APs",
    apsCount: 10,
    siteTag: "HQ-Site",
    rfProfile: "Indoor-High-Density",
  },
  {
    name: "Floor-2",
    description: "Second Floor APs",
    apsCount: 8,
    siteTag: "HQ-Site",
    rfProfile: "Indoor-Standard",
  },
];

const defaultPolicyProfiles: PolicyProfile[] = [
  {
    name: "Employee-Policy",
    type: "Central",
    vlan: 100,
    qos: "Platinum",
    aaa: "ISE",
  },
  {
    name: "Guest-Policy",
    type: "Central",
    vlan: 200,
    qos: "Bronze",
    aaa: "Local",
  },
];

const defaultPolicyTags: PolicyTag[] = [
  {
    name: "Corporate-Tag",
    description: "Corporate Policy Set",
    policies: ["Employee-Policy", "Guest-Policy"],
  },
  {
    name: "Branch-Tag",
    description: "Branch Office Policy Set",
    policies: ["Remote-Policy"],
  },
];

const NetworkInfo = ({
  ssids = defaultSSIDs,
  flexConnectGroups = defaultFlexConnectGroups,
  apGroups = defaultAPGroups,
  policyProfiles = defaultPolicyProfiles,
  policyTags = defaultPolicyTags,
}: NetworkInfoProps) => {
  return (
    <Card className="w-full bg-white p-4">
      <Tabs defaultValue="ssids" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ssids">SSIDs</TabsTrigger>
          <TabsTrigger value="flexconnect">FlexConnect Groups</TabsTrigger>
          <TabsTrigger value="apgroups">AP Groups</TabsTrigger>
          <TabsTrigger value="policies">Policy Profiles</TabsTrigger>
          <TabsTrigger value="tags">Policy Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="ssids" className="mt-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {ssids.map((ssid) => (
                <Card key={ssid.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{ssid.name}</h3>
                    <Badge
                      variant={
                        ssid.status === "enabled" ? "success" : "secondary"
                      }
                    >
                      {ssid.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Authentication Type</p>
                      <p>{ssid.authType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Security</p>
                      <p>{ssid.security}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">VLAN</p>
                      <p>{ssid.vlan}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Policy Profile</p>
                      <p>{ssid.policyProfile}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="flexconnect" className="mt-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {flexConnectGroups.map((group) => (
                <Card key={group.name} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{group.name}</h3>
                    <Badge
                      variant={
                        group.status === "enabled" ? "success" : "secondary"
                      }
                    >
                      {group.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Primary Controller</p>
                      <p>{group.primaryController}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">APs Count</p>
                      <p>{group.apsCount}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="apgroups" className="mt-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {apGroups.map((group) => (
                <Card key={group.name} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{group.name}</h3>
                    <Badge variant="secondary">{group.apsCount} APs</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Description</p>
                      <p>{group.description}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Site Tag</p>
                      <p>{group.siteTag}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">RF Profile</p>
                      <p>{group.rfProfile}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="policies" className="mt-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {policyProfiles.map((profile) => (
                <Card key={profile.name} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{profile.name}</h3>
                    <Badge variant="secondary">{profile.type}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">VLAN</p>
                      <p>{profile.vlan}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">QoS</p>
                      <p>{profile.qos}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">AAA</p>
                      <p>{profile.aaa}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tags" className="mt-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {policyTags.map((tag) => (
                <Card key={tag.name} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{tag.name}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Description</p>
                      <p>{tag.description}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applied Policies</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {tag.policies.map((policy) => (
                          <Badge key={policy} variant="outline">
                            {policy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default NetworkInfo;
