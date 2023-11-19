import type { Config } from "@/services/config/schemas";
import GreetingText from "./GreetingText";
import { ReactNode } from "react";
import { Suspense } from "react";

interface GreetingProps {
  config: Config;
  weather: ReactNode;
}

export default function Greeting({ config, weather }: GreetingProps) {
  return (
    <div className="flex flex-col">
      <div className="sm:flex">
        <GreetingText config={config} />
        {config.weather.enabled && (
          <div className="ml-auto">
            <Suspense
              fallback={
                <div className="flex h-[100px] animate-pulse space-x-4">
                  <div className="flex h-full items-center">
                    <div className="h-16 w-16 rounded-full bg-primary-200 dark:bg-primary-700/40" />
                  </div>
                  <div className="flex w-36 flex-col gap-2">
                    <div className="h-6 rounded-xl bg-primary-200 dark:bg-primary-700/40" />
                    <div className="h-16 rounded-xl bg-primary-200 dark:bg-primary-700/40" />
                  </div>
                </div>
              }
            >
              {weather}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
