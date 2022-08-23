import useConfig from "../../hooks/useConfig";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { config } = useConfig();

  return (
    <div
      className="h-full min-h-screen bg-cover bg-fixed pt-[5%]"
      style={{
        backgroundImage:
          !config.isLoading && config.data!.appearance.backgroundEnabled
            ? `url("/static/background.png?v=${config.data!.general.cacheKey}")`
            : undefined,
      }}
    >
      {children}
    </div>
  );
}
