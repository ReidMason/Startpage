import { Theme } from "@/services/config/schemas";

interface ThemeColoursProps {
  theme: Theme;
}

export default function ThemeColours({ theme }: ThemeColoursProps) {
  return (
    <div>
      <h1>Theme Colours</h1>
      {Object.keys(theme).map((colour) => (
        <div className="flex justify-between gap-4">
          <h2 className="shrink-0">{colour.replace("bg-", "")}</h2>
          <input type="color" value="#ffffff" className="w-full max-w-24" />
        </div>
      ))}
    </div>
  );
}
