import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";

interface InfoCardProps {
  title?: string;
  message: string;
  variant?: "info" | "warning";
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  message,
  variant = "info",
}) => {
  const colors = {
    info: {
      text: "text-blue-600",
      border: "border-blue-300",
    },
    warning: {
      text: "text-red-600",
      border: "border-red-300",
    },
  };

  return (
    <Card className={`border ${colors[variant].border}`}>
      <CardHeader className={`${colors[variant].text} font-semibold`}>
        {title || (variant === "warning" ? "⚠️ Warning" : "ℹ️ Info")}
      </CardHeader>
      <CardContent className={`${colors[variant].text}`}>{message}</CardContent>
    </Card>
  );
};
