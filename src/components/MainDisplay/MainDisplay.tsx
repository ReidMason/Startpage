"use client";

import { Config } from "@/services/config/schemas";
import React, { useState } from "react";
import AppsGrid from "../Apps/AppsGrid";
import Searchbar from "../Searchbar/Searchbar";
import Greeting from "../Greeting/Greeting";

interface MainDisplayProps {
  config: Config;
}

export default function MainDisplay({ config }: MainDisplayProps) {
  const [filter, setFilter] = useState("");

  return (
    <div className="container mx-auto mb-20 flex flex-col gap-8 p-8 text-primary-300 transition bg-primary-transparent-900 glassy:backdrop-blur-xl dark:text-primary-100 sm:p-16 sm:glassy:rounded-2xl">
      <Searchbar config={config} setAppFilter={setFilter} />
      <div>
        <Greeting config={config} />
      </div>
      <AppsGrid config={config} appFilter={filter} />
    </div>
  );
}
