import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { NetworkData } from "@/types/config";

interface NetworkInfoProps {
  data?: NetworkData | null;
}

const NetworkInfo = ({ data }: NetworkInfoProps) => {
  if (!data) {
    return (
      <Card className="w-full bg-white p-4">
        <div className="text-center py-8 text-gray-500">
          <p>No network data available.</p>
          <p className="text-sm">
            Upload a configuration file to view network details.
          </p>
        </div>
      </Card>
    );
  }

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
            {data.ssids && data.ssids.length > 0 ? (
              <div className="space-y-4">
                {data.ssids.map((ssid) => (
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No SSIDs found in the configuration.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="flexconnect" className="mt-0">
          <ScrollArea className="h-[300px]">
            {data.flexConnectGroups && data.flexConnectGroups.length > 0 ? (
              <div className="space-y-4">
                {data.flexConnectGroups.map((group) => (
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No FlexConnect Groups found in the configuration.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="apgroups" className="mt-0">
          <ScrollArea className="h-[300px]">
            {data.apGroups && data.apGroups.length > 0 ? (
              <div className="space-y-4">
                {data.apGroups.map((group) => (
                  <Card key={group.name} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{group.name}</h3>
                      <Badge variant="secondary">{group.apsCount} APs</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Description</p>
                        <p>{group.description || "N/A"}</p>
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No AP Groups found in the configuration.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="policies" className="mt-0">
          <ScrollArea className="h-[300px]">
            {data.policyProfiles && data.policyProfiles.length > 0 ? (
              <div className="space-y-4">
                {data.policyProfiles.map((profile) => (
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No Policy Profiles found in the configuration.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tags" className="mt-0">
          <ScrollArea className="h-[300px]">
            {data.policyTags && data.policyTags.length > 0 ? (
              <div className="space-y-4">
                {data.policyTags.map((tag) => (
                  <Card key={tag.name} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{tag.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-500">Description</p>
                        <p>{tag.description || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Applied Policies</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {tag.policies.length > 0 ? (
                            tag.policies.map((policy) => (
                              <Badge key={policy} variant="outline">
                                {policy}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400">
                              No policies applied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No Policy Tags found in the configuration.</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default NetworkInfo;
