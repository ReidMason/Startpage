import React from "react";

export default function HorizontalRule() {
  return (
    <div className="flex opacity-80">
      <div className="from h-1 w-1/2 bg-gradient-to-l dark:from-primary-400" />
      <div className="from h-1 w-1/2 bg-gradient-to-r dark:from-primary-400" />
    </div>
  );
}
