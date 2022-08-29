import { LazyMotion } from "framer-motion";
import useConfig from "../../hooks/useConfig";

interface MainLayoutProps {
  children: React.ReactNode;
}

const loadFramerFeatures = () =>
  import("../../../framer-features").then((res) => res.default);

export default function MainLayout({ children }: MainLayoutProps) {
  const { config } = useConfig();

  return (
    <div
      className="h-full min-h-screen bg-cover bg-fixed py-[5%]"
      style={{
        backgroundImage:
          !config.isLoading && config.data!.appearance.backgroundEnabled
            ? `url("/static/background.png?v=${config.data!.general.cacheKey}")`
            : undefined,
      }}
    >
      <LazyMotion features={loadFramerFeatures} strict>
        {children}
      </LazyMotion>
    </div>
  );
}
