import { LazyMotion } from "framer-motion";
import Image from "next/future/image";
import type { Config } from "../../backend/routers/config/schemas";

interface MainLayoutProps {
  children: React.ReactNode;
  config: Config;
}

const loadFramerFeatures = () =>
  import("../../../framer-features").then((res) => res.default);

export default function MainLayout({ children, config }: MainLayoutProps) {
  return (
    <div className="h-full min-h-screen">
      <Image
        className="object-cover"
        alt="background image"
        src={`/static/background.png?v=${config.general.cacheKey}`}
        fill
      />
      <div
        className={`h-full min-h-screen py-[5%] ${
          config.appearance.backgroundBlur ? "backdrop-blur-xl" : ""
        }`}
      >
        <LazyMotion features={loadFramerFeatures} strict>
          {children}
        </LazyMotion>
      </div>
    </div>
  );
}
