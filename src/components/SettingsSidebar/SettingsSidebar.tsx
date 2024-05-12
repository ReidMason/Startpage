import { HTMLAttributes, useEffect, useState } from "react";
import { Page as Page } from "./types";
import { Config, configSchema } from "@/services/config/schemas";
import { StateSetter } from "@/utils/common";
import { useForm, useWatch } from "react-hook-form";
import { classNames } from "@/utils/utils";
import { pages } from "./pages";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import Sidebar from "../Sidebar/Sidebar";

interface SettingsSidebarProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  setOpen: (open: boolean) => void;
  config: Config;
  setConfig: StateSetter<Config>;
  saveConfig: (config: Config) => void;
}

function getPage(page: Page) {
  for (let i = 0; i < pages.length; i++) {
    const element = pages[i];
    if (element.page == page) return element;
  }

  return pages[0];
}

enum State {
  Default,
  Loading,
}

export default function SettingsSidebar({
  children,
  open,
  setOpen,
  config,
  setConfig,
  saveConfig,
}: SettingsSidebarProps) {
  const [activePage, setActivePage] = useState(Page.Home);
  const page = getPage(activePage);
  const [state, setState] = useState(State.Default);

  const form = useForm<Config>({
    resolver: zodResolver(configSchema),
    defaultValues: config,
  });

  const watcher = useWatch({
    control: form.control,
    name: ["general.searchPlaceholder", "weather.enabled", "weather.detailed"],
  });

  useEffect(() => {
    const newConfig = form.getValues();
    setConfig(newConfig);
  }, [watcher]);

  const onSubmit = (data: Config) => {
    setState(State.Loading);
    saveConfig(data);
    form.reset(data);
    setState(State.Default);
  };

  return (
    <div>
      <Sidebar open={open} setOpen={setOpen}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col justify-between"
          >
            <div>
              <page.component
                setActivePage={setActivePage}
                page={page}
                control={form.control}
                loading={state == State.Loading}
              />
            </div>

            <Button
              className="w-full"
              variant="secondary"
              disabled={!form.formState.isDirty}
              loading={state == State.Loading}
            >
              Save
            </Button>
          </form>
        </Form>
      </Sidebar>
      <main
        className={classNames(
          open ? "md:ml-80 md:px-4" : "",
          "transition-all duration-300 ease-in-out",
        )}
      >
        {children}
      </main>
    </div>
  );
}
