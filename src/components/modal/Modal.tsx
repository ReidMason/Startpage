import { Dialog } from "@headlessui/react";
import type { ReactNode, UIEvent } from "react";
import { m, AnimatePresence } from "framer-motion";

interface ModalProps {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
  onScroll?: (e: UIEvent<HTMLDivElement>) => void;
}

export default function Modal({
  open,
  children,
  onClose,
  onScroll,
}: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog className="relative z-10" onClose={onClose} open={open}>
          <m.div
            key="backdrop"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1 },
              collapsed: { opacity: 0 },
            }}
            transition={{ duration: 0.15 }}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-xl" />
          </m.div>

          <m.div
            className="fixed inset-0 m-4 flex items-center justify-center"
            key="panel"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { scale: 1, opacity: 1 },
              collapsed: { scale: 0, opacity: 0 },
            }}
            transition={{ duration: 0.2 }}
          >
            <Dialog.Panel
              className="flex max-h-full max-w-full flex-col overflow-y-scroll rounded-lg p-4 shadow-xl glassy:backdrop-blur-3xl dark:bg-primary-800 dark:text-primary-50 dark:glassy:bg-primary-800/30"
              onScroll={onScroll}
            >
              {children}
            </Dialog.Panel>
          </m.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
