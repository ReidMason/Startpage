import { appSchema, type App as AppType } from "@/services/config/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "@/components/ui/input";
import App from "../Apps/App";
import Sidebar from "../Sidebar/Sidebar";

interface SettingsSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  app: AppType | null;
  saveApp: (app: AppType) => void;
}

export default function AppEditor({
  open,
  setOpen,
  app,
  saveApp,
}: SettingsSidebarProps) {
  if (!app && open) {
    setOpen(false);
    return;
  }

  return (
    <Sidebar open={open} setOpen={setOpen}>
      {!!app && <AppEdit app={app} saveApp={saveApp} />}
    </Sidebar>
  );
}

interface AppEditProps {
  app: AppType;
  saveApp: (app: AppType) => void;
}

function AppEdit({ app, saveApp }: AppEditProps) {
  const form = useForm<AppType>({
    resolver: zodResolver(appSchema),
    defaultValues: app,
  });
  const modifiedApp = form.watch();

  const onSubmit = (app: AppType) => {
    saveApp(app);
    form.reset(app);
  };

  return (
    <Form {...form}>
      <h2 className="pt-4 text-center text-xl font-semibold text-white">
        Edit App
      </h2>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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

        <button>Save</button>
      </form>
    </Form>
  );
}
