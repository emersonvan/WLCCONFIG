import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { ConfigItem } from "@/types/config";

interface IssueSummaryProps {
  issues?: ConfigItem[];
}

interface IssueSeverityCount {
  type: "critical" | "warning" | "info";
  count: number;
  description: string;
}

const categorizeSeverity = (
  issue: ConfigItem,
): "critical" | "warning" | "info" => {
  if (issue.category.toLowerCase().includes("security")) return "critical";
  if (issue.category.toLowerCase().includes("rf")) return "warning";
  return "info";
};

const getSeverityColor = (type: IssueSeverityCount["type"]) => {
  switch (type) {
    case "critical":
      return "text-red-500";
    case "warning":
      return "text-yellow-500";
    case "info":
      return "text-blue-500";
  }
};

const getSeverityIcon = (type: IssueSeverityCount["type"]) => {
  switch (type) {
    case "critical":
      return <AlertCircle className="h-6 w-6 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    case "info":
      return <Info className="h-6 w-6 text-blue-500" />;
  }
};

const IssueSummary = ({ issues = [] }: IssueSummaryProps) => {
  const severityCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      critical: 0,
      warning: 0,
      info: 0,
    };

    issues.forEach((issue) => {
      const severity = categorizeSeverity(issue);
      counts[severity]++;
    });

    const totalIssues = issues.length;

    return [
      {
        type: "critical" as const,
        count: counts.critical,
        description: "Critical security vulnerabilities detected",
      },
      {
        type: "warning" as const,
        count: counts.warning,
        description: "Configuration warnings identified",
      },
      {
        type: "info" as const,
        count: counts.info,
        description: "Informational notices",
      },
    ];
  }, [issues]);

  const totalIssues = severityCounts.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="w-full p-6 bg-white">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Configuration Analysis Summary
          </h2>
          <span className="text-lg font-medium">
            Total Issues: {totalIssues}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {severityCounts.map((issue) => (
            <div
              key={issue.type}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                {getSeverityIcon(issue.type)}
                <span className={`font-medium ${getSeverityColor(issue.type)}`}>
                  {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-2xl font-bold">{issue.count}</span>
                <span className="text-gray-600 ml-2">issues</span>
              </div>

              <Progress
                value={totalIssues > 0 ? (issue.count / totalIssues) * 100 : 0}
                className={`h-2 ${
                  issue.type === "critical"
                    ? "bg-red-100"
                    : issue.type === "warning"
                      ? "bg-yellow-100"
                      : "bg-blue-100"
                }`}
              />

              <p className="mt-2 text-sm text-gray-600">{issue.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default IssueSummary;
