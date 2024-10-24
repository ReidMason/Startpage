import Appearance from "./Appearance";
import { General } from "./General";
import { Home } from "./Home";
import Providers from "./Providers";
import Weather from "./Weather";
import { Page, SettingsSection } from "./types";
import {
  CloudIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export interface PageObject {
  name: string;
  page: Page;
  component: SettingsSection;
  previousPage: Page;
  icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

export const pages: PageObject[] = [
  {
    name: "Home",
    page: Page.Home,
    component: Home,
    previousPage: Page.Home,
  },
  {
    name: "General",
    page: Page.General,
    component: General,
    previousPage: Page.Home,
    icon: Cog6ToothIcon,
  },
  {
    name: "Weather",
    page: Page.Weather,
    component: Weather,
    previousPage: Page.Home,
    icon: CloudIcon,
  },
  {
    name: "Appearance",
    page: Page.Appearance,
    component: Appearance,
    previousPage: Page.Home,
    icon: PaintBrushIcon,
  },
  {
    name: "Providers",
    page: Page.Providers,
    component: Providers,
    previousPage: Page.Home,
    icon: DocumentMagnifyingGlassIcon,
  },
];
