import { m } from "framer-motion";

interface EntranceAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export default function PresenceAnimation({
  className,
  children,
}: EntranceAnimationProps) {
  return (
    <m.div
      className={className ?? ""}
      initial="hide"
      animate="show"
      exit="hide"
      variants={{
        show: { y: 0, opacity: 1 },
        hide: { y: "50%", opacity: 0 },
      }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </m.div>
  );
}
