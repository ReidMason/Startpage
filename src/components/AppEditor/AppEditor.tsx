import { HTMLAttributes } from "react";
import { classNames } from "@/utils/utils";
import Sidebar from "../Sidebar/Sidebar";
import { appSchema, type App as AppType } from "@/services/config/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "@/components/ui/input";
import App from "../Apps/App";
import SettingsPanelWrapper from "../SettingsSidebar/SettingsPanelWrapper";

interface SettingsSidebarProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  setOpen: (open: boolean) => void;
  app: AppType | null;
}

export default function AppEditor({
  children,
  open,
  setOpen,
  app,
}: SettingsSidebarProps) {
  if (!app && open) {
    setOpen(false);
    return;
  }

  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        {!!app && <AppEdit app={app} />}
      </Sidebar>

      <main
        className={classNames(
          open ? "md:ml-80 md:px-4" : "",
          "transition-all duration-300 ease-in-out",
        )}
      >
        {children}
      </main>
    </>
  );
}

interface AppEditProps {
  app: AppType;
}

function AppEdit({ app }: AppEditProps) {
  const form = useForm<AppType>({
    resolver: zodResolver(appSchema),
    defaultValues: app,
  });
  const modifiedApp = form.watch();

  return (
    <Form {...form}>
      <h2 className="pt-4 text-center text-xl font-semibold text-white">
        Edit App
      </h2>
      <div className="flex flex-col gap-2">
        <App app={modifiedApp} preview />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="App name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input placeholder="App url" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input placeholder="App icon" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
