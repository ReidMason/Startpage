import React from "react";

export default function HorizontalRule() {
  return (
    <div className="flex h-0.5 opacity-60">
      <div className="from h-full w-full bg-gradient-to-l dark:from-primary-400" />
      <div className="h-full w-11/12 flex-shrink-0 dark:bg-primary-400" />
      <div className="from h-full w-full bg-gradient-to-r dark:from-primary-400" />
    </div>
  );
}
