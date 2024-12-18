import { useEffect, useState } from "react";
import { ConfigSettings, configSettingsSchema, Page as Page } from "./types";
import { Config } from "@/services/config/schemas";
import { StateSetter } from "@/utils/common";
import { useForm, useWatch } from "react-hook-form";
import { pages } from "./pages";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import Sidebar from "@/components/Sidebar/Sidebar";

interface SettingsSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  config: Config;
  setConfig: StateSetter<Config>;
  saveSettings: (config: ConfigSettings) => Promise<void>;
}

function getPage(page: Page) {
  for (let i = 0; i < pages.length; i++) {
    const element = pages[i];
    if (element.page == page) return element;
  }

  return pages[0];
}

type PageState = "Default" | "Loading";

export default function SettingsSidebar({
  open,
  setOpen,
  config,
  setConfig,
  saveSettings,
}: SettingsSidebarProps) {
  const [activePage, setActivePage] = useState(Page.Home);
  const page = getPage(activePage);
  const [pageState, setPageState] = useState<PageState>("Default");

  const form = useForm<ConfigSettings>({
    resolver: zodResolver(configSettingsSchema),
    defaultValues: config,
  });

  const watcher = useWatch({
    control: form.control,
    name: ["general.searchPlaceholder", "weather", "weather", "appearance"],
  });

  useEffect(() => {
    const newConfig = form.getValues();
    setConfig(newConfig);
  }, [watcher, form, setConfig]);

  const onSubmit = (data: ConfigSettings) => {
    setPageState("Loading");
    if (data.appearance.newBackgroundImage)
      data.appearance.backgroundImageEnabled = true;

    saveSettings(data);
    data.appearance.newBackgroundImage = undefined;
    form.reset(data);
    setPageState("Default");
  };

  return (
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
              loading={pageState == "Loading"}
              register={form.register}
            />
          </div>

          <Button
            className="w-full"
            disabled={!form.formState.isDirty}
            loading={pageState == "Loading"}
          >
            Save
          </Button>
        </form>
      </Form>
    </Sidebar>
  );
}
