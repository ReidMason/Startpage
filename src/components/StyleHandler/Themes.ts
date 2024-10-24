import { ColourTheme, Themes } from "@/services/config/schemas";

export const themeColours: Record<Themes, ColourTheme> = {
  light: {
    background: "0 0% 92%",
    foreground: "0 0% 9%",

    card: "0 0% 98%",
    "card-foreground": "0 0% 25%",

    popover: "0 0% 100%",
    "popover-foreground": "222.2 84% 4.9%",

    primary: "240 5.9% 80%",
    "primary-foreground": "210 40% 98%",

    secondary: "210 40% 96.1%",
    "secondary-foreground": "222.2 47.4% 11.2%",

    muted: "210 40% 96.1%",
    "muted-foreground": "215.4 16.3% 46.9%",

    accent: "210 30% 70%",
    "accent-foreground": "214 41% 45%",

    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "210 40% 98%",

    border: "214.3 31.8% 91.4%",
    input: "214.3 31.8% 91.4%",
    ring: "222.2 84% 4.9%",
  },
  dark: {
    /* Default background color of <body />...etc */
    background: "217 33% 17%",
    foreground: "210 40% 98%",

    /* Background color for <Card /> */
    card: "221 39% 11%",
    "card-foreground": "226 64% 88%",

    /* Background color for popovers such as <DropdownMenu />, <HoverCard />, <Popover /> */
    popover: "221 39% 11%",
    "popover-foreground": "210 40% 98%",

    /* Primary colors for <Button /> */
    primary: "221 55% 62%",
    "primary-foreground": "210 40% 98%",

    /* Secondary colors for <Button /> */
    secondary: "217.2 32.6% 17.5%",
    "secondary-foreground": "210 40% 98%",

    /* Muted backgrounds such as <TabsList />, <Skeleton /> and <Switch /> */
    muted: "217.2 32.6% 17.5%",
    "muted-foreground": "215 20.2% 65.1%",

    /* Used for accents such as hover effects on <DropdownMenuItem>, <SelectItem>...etc */
    accent: "214 98% 84%",
    "accent-foreground": "214 41% 50%",

    /* Used for destructive actions such as <Button variant="destructive"> */
    destructive: "0 62.8% 30.6%",
    "destructive-foreground": "210 40% 98%",

    /* Default border color */
    border: "214 98% 84%",
    /* Border color for inputs such as <Input />, <Select />, <Textarea /> */
    input: "217.2 32.6% 17.5%",
    /* Used for focus ring */
    ring: "212.7 26.8% 83.9%",
  },
  "catpuccin-mocha": {
    border: "267 84% 81%",
    background: "240 21% 15%",
    input: "234 13.2 31.2",
    ring: "267 83.5 81",
    foreground: "226 64% 88%",
    primary: "267 84% 81%",
    "primary-foreground": "240 23% 9%",
    secondary: "233 12% 39%",
    "secondary-foreground": "226 64% 88%",
    destructive: "0 84.2% 60.2%",
    "destructive-foreground": "210 40% 98%",
    muted: "210 40% 96.1%",
    "muted-foreground": "215.4 16.3% 46.9%",
    accent: "267 84% 81%",
    "accent-foreground": "40 23% 9%",
    popover: "240 21.3 12",
    "popover-foreground": "226 63.9 88",
    card: "240 21% 12%",
    "card-foreground": "226 64% 88%",
  },
  "tokyo-night": {
    border: "230 24.2 18.6",
    background: "235 18.8 12.5",
    input: "235 18.8 12.5",
    ring: "212.7 26.8% 83.9%",
    foreground: "226 63.9 88",
    primary: "221 55% 62%",
    "primary-foreground": "210 40% 98%",
    secondary: "217.2 32.6% 17.5%",
    "secondary-foreground": "226 63.9 88",
    destructive: "349 89 71.6",
    "destructive-foreground": "210 40% 98%",
    muted: "217.2 32.6% 17.5%",
    "muted-foreground": "215 20.2% 65.1%",
    accent: "217 39.8 55.7",
    "accent-foreground": "226 63.9 88",
    popover: "240 15.4 10.2",
    "popover-foreground": "210 40% 98%",
    card: "240 17 10.4",
    "card-foreground": "226 64% 88%",
  },
  custom: {
    border: "#000000",
    background: "#000000",
    input: "#000000",
    ring: "#000000",
    foreground: "#000000",
    primary: "#000000",
    "primary-foreground": "#000000",
    secondary: "#000000",
    "secondary-foreground": "#000000",
    destructive: "#000000",
    "destructive-foreground": "#000000",
    muted: "#000000",
    "muted-foreground": "#000000",
    accent: "#000000",
    "accent-foreground": "#000000",
    popover: "#000000",
    "popover-foreground": "#000000",
    card: "#000000",
    "card-foreground": "#000000",
  },
};
