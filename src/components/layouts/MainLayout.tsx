import { LazyMotion } from "framer-motion";
import Image from "next/future/image";
import type { Config } from "../../backend/routers/config/schemas";
import backgroundImage from "../../../public/static/background.png";
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
        alt="background image"
        src={backgroundImage}
        className="object-cover"
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
