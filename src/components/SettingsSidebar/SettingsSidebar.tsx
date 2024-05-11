import { Fragment, HTMLAttributes, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Page as Page } from "./types";
import { Config, configSchema } from "@/services/config/schemas";
import { StateSetter } from "@/utils/common";
import { useForm, useWatch } from "react-hook-form";
import { classNames } from "@/utils/utils";
import { pages } from "./pages";
import { Button } from "../Button/Button";
import { saveConfig } from "@/services/config/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

interface SettingsSidebarProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  setOpen: (open: boolean) => void;
  config: Config;
  setConfig: StateSetter<Config>;
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
    name: [
      "general.searchPlaceholder",
      "weather.enabled",
      "weather.detailed",
      "weather.showLocation",
    ],
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
      <SidebarSlider open={open} setOpen={setOpen}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col justify-between"
          >
            <page.component
              setActivePage={setActivePage}
              page={page}
              control={form.control}
              config={config}
              setConfig={setConfig}
              register={form.register}
            />

            <div>
              <Button
                className="w-full"
                disabled={!form.formState.isDirty}
                loading={state == State.Loading}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </SidebarSlider>
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

interface SidebarSliderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

function SidebarSlider({ open, setOpen, children }: SidebarSliderProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>

              <div className="grow bg-card px-3 pb-2 ring-1 ring-white/10">
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
