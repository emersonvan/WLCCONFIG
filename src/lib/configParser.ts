import { NetworkData, ConfigItem } from "@/types/config";
import { sampleConfig } from "./sampleConfig";

const extractSSIDs = (content: string): NetworkData["ssids"] => {
  const ssids = [];
  try {
    // Match WLAN blocks
    const wlanBlocks =
      content.match(/wlan\s+[\w-]+\s+\d+[\s\S]*?(?=\nwlan|$)/g) || [];

    for (const block of wlanBlocks) {
      const idMatch = block.match(/wlan\s+([\w-]+)\s+(\d+)/);
      if (!idMatch) continue;

      const name = idMatch[1];
      const id = idMatch[2];

      // Extract security settings
      const security =
        block.match(/security\s+(wpa\d?(?:-\w+)*|none)/i)?.[1]?.toUpperCase() ||
        "NONE";
      const authType =
        block.match(/authentication\s+(\S+)/i)?.[1]?.toUpperCase() ||
        (block.match(/mac-filtering\s+enable/) ? "MAC-FILTER" : "OPEN");

      // Extract VLAN
      const vlan = parseInt(block.match(/vlan\s+(\d+)/)?.[1] || "1");

      // Check status
      const isDisabled =
        block.includes("shutdown") || block.includes("disabled");

      // Extract policy profile
      const policyProfile =
        block.match(/policy-profile\s+([\w-]+)/)?.[1] || "default-policy";

      ssids.push({
        id,
        name,
        authType,
        security,
        vlan,
        status: isDisabled ? "disabled" : "enabled",
        policyProfile,
      });
    }
  } catch (error) {
    console.error("Error parsing SSIDs:", error);
  }
  return ssids;
};

const extractFlexConnectGroups = (
  content: string,
): NetworkData["flexConnectGroups"] => {
  const groups = [];
  try {
    // Match FlexConnect blocks
    const fcBlocks =
      content.match(
        /flexconnect\s+group\s+[\w-]+[\s\S]*?(?=\nflexconnect\s+group|$)/g,
      ) || [];

    for (const block of fcBlocks) {
      const nameMatch = block.match(/flexconnect\s+group\s+([\w-]+)/);
      if (!nameMatch) continue;

      const name = nameMatch[1];
      const primaryController =
        block.match(/primary\s+controller\s+([\w.-]+)/)?.[1] || "N/A";
      const apsCount = parseInt(
        block.match(/aps\s+count:\s*(\d+)/i)?.[1] || "0",
      );
      const isDisabled =
        block.includes("disabled") || block.includes("shutdown");

      groups.push({
        name,
        primaryController,
        apsCount,
        status: isDisabled ? "disabled" : "enabled",
      });
    }
  } catch (error) {
    console.error("Error parsing FlexConnect groups:", error);
  }
  return groups;
};

const extractAPGroups = (content: string): NetworkData["apGroups"] => {
  const groups = [];
  try {
    const apGroupBlocks =
      content.match(/ap\s+group\s+[\w-]+[\s\S]*?(?=\nap\s+group|$)/g) || [];

    for (const block of apGroupBlocks) {
      const nameMatch = block.match(/ap\s+group\s+([\w-]+)/);
      if (!nameMatch) continue;

      const name = nameMatch[1];
      const description = block.match(/description\s+"([^"]+)"/)?.[1] || "";
      const rfProfile =
        block.match(/rf-profile\s+([\w-]+)/)?.[1] || "default-rf";
      const siteTag = block.match(/site-tag\s+([\w-]+)/)?.[1] || "default-site";
      const apsCount = parseInt(
        block.match(/aps\s+count:\s*(\d+)/i)?.[1] || "0",
      );

      groups.push({
        name,
        description,
        apsCount,
        siteTag,
        rfProfile,
      });
    }
  } catch (error) {
    console.error("Error parsing AP Groups:", error);
  }
  return groups;
};

const extractPolicyProfiles = (
  content: string,
): NetworkData["policyProfiles"] => {
  const profiles = [];
  try {
    const policyBlocks =
      content.match(/policy-profile\s+[\w-]+[\s\S]*?(?=\npolicy-profile|$)/g) ||
      [];

    for (const block of policyBlocks) {
      const nameMatch = block.match(/policy-profile\s+([\w-]+)/);
      if (!nameMatch) continue;

      const name = nameMatch[1];
      const type = block.includes("central") ? "Central" : "Local";
      const vlan = parseInt(block.match(/vlan\s+(\d+)/)?.[1] || "1");
      const qos = block.match(/qos-policy\s+([\w-]+)/)?.[1] || "default";
      const aaa = block.includes("aaa-override") ? "ISE" : "Local";

      profiles.push({
        name,
        type,
        vlan,
        qos,
        aaa,
      });
    }
  } catch (error) {
    console.error("Error parsing Policy Profiles:", error);
  }
  return profiles;
};

const extractPolicyTags = (content: string): NetworkData["policyTags"] => {
  const tags = [];
  try {
    const tagBlocks =
      content.match(/policy-tag\s+[\w-]+[\s\S]*?(?=\npolicy-tag|$)/g) || [];

    for (const block of tagBlocks) {
      const nameMatch = block.match(/policy-tag\s+([\w-]+)/);
      if (!nameMatch) continue;

      const name = nameMatch[1];
      const description = block.match(/description\s+"([^"]+)"/)?.[1] || "";
      const policies = (block.match(/wlan\s+[\w-]+\s+policy\s+([\w-]+)/g) || [])
        .map((match) => match.match(/policy\s+([\w-]+)$/)?.[1])
        .filter(Boolean) as string[];

      tags.push({
        name,
        description,
        policies,
      });
    }
  } catch (error) {
    console.error("Error parsing Policy Tags:", error);
  }
  return tags;
};

export const parseConfigurationFile = (
  content: string,
): {
  networkData: NetworkData;
  configIssues: ConfigItem[];
} => {
  try {
    // If content is empty or invalid, use sample config
    if (!content || content.trim().length === 0) {
      content = sampleConfig;
    }

    // Remove any Windows line endings and normalize whitespace
    const normalizedContent = content
      .replace(/\r\n/g, "\n")
      .replace(/\s+\n/g, "\n");

    const ssids = extractSSIDs(normalizedContent);
    const flexConnectGroups = extractFlexConnectGroups(normalizedContent);
    const apGroups = extractAPGroups(normalizedContent);
    const policyProfiles = extractPolicyProfiles(normalizedContent);
    const policyTags = extractPolicyTags(normalizedContent);
    const configIssues = extractConfigurationIssues(normalizedContent);

    return {
      networkData: {
        ssids,
        flexConnectGroups,
        apGroups,
        policyProfiles,
        policyTags,
      },
      configIssues,
    };
  } catch (error) {
    console.error("Error parsing configuration:", error);
    throw new Error("Failed to parse configuration file");
  }
};

const extractConfigurationIssues = (content: string): ConfigItem[] => {
  const issues: ConfigItem[] = [];
  try {
    // WPA3 Check
    const wlanBlocks =
      content.match(/wlan\s+[\w-]+\s+\d+[\s\S]*?(?=\nwlan|$)/g) || [];
    wlanBlocks.forEach((block) => {
      const ssidMatch = block.match(/wlan\s+([\w-]+)\s+(\d+)/);
      if (!ssidMatch) return;

      const [_, ssidName, ssidId] = ssidMatch;

      // Check WPA3
      if (!block.includes("security wpa3")) {
        issues.push({
          id: `wpa3-${ssidId}`,
          category: "Security - WPA3",
          currentValue:
            block.match(/security\s+(\S+)/)?.[1]?.toUpperCase() || "NONE",
          bestPractice: "WPA3",
          status: "mismatched",
          description: `SSID ${ssidName} is not using WPA3 encryption`,
          impact: "Reduced security protection against modern wireless attacks",
          recommendation: "Enable WPA3 for enhanced security features",
          currentConfig: block.trim(),
          relatedTo: {
            type: "ssid",
            name: ssidName,
            config: block.trim(),
          },
          currentCommand: `show wlan ${ssidId} security`,
          recommendedCommand: `config wlan security wpa3 enable ${ssidId}\nconfig wlan security pmf mandatory ${ssidId}`,
        });
      }

      // Check PMF
      if (!block.includes("pmf mandatory")) {
        issues.push({
          id: `pmf-${ssidId}`,
          category: "Security - PMF",
          currentValue: block.includes("pmf disable") ? "Disabled" : "Optional",
          bestPractice: "Mandatory",
          status: "mismatched",
          description: `PMF (Protected Management Frames) not mandatory on SSID ${ssidName}`,
          impact: "Vulnerability to management frame attacks",
          recommendation: "Enable mandatory PMF for enhanced security",
          currentConfig: block.trim(),
          relatedTo: {
            type: "ssid",
            name: ssidName,
            config: block.trim(),
          },
          currentCommand: `show wlan ${ssidId} security`,
          recommendedCommand: `config wlan security pmf mandatory ${ssidId}`,
        });
      }
    });

    // RF Profile Checks
    const rfBlocks =
      content.match(/rf-profile\s+[\w-]+[\s\S]*?(?=\nrf-profile|$)/g) || [];
    rfBlocks.forEach((block) => {
      const profileMatch = block.match(/rf-profile\s+([\w-]+)/);
      if (!profileMatch) return;

      const profileName = profileMatch[1];

      // Check Data Rates
      const dataRateMatch = block.match(
        /data-rates\s+802\.11[ab]\s+mandatory\s+(\d+)/,
      );
      const dataRate = parseInt(dataRateMatch?.[1] || "6");

      if (dataRate < 12) {
        issues.push({
          id: `rf-${profileName}`,
          category: "RF Management - Data Rate",
          currentValue: `${dataRate} Mbps`,
          bestPractice: "12 Mbps",
          status: "mismatched",
          description: `RF Profile ${profileName} has low minimum data rate`,
          impact:
            "Reduced network performance and increased airtime utilization",
          recommendation: "Increase minimum data rate to 12 Mbps",
          currentConfig: block.trim(),
          relatedTo: {
            type: "rf-profile",
            name: profileName,
            config: block.trim(),
          },
          currentCommand: `show rf-profile detailed ${profileName}`,
          recommendedCommand: `config rf-profile data-rates minimum 12Mbps profile-name ${profileName}`,
        });
      }
    });
  } catch (error) {
    console.error("Error analyzing configuration:", error);
  }
  return issues;
};
