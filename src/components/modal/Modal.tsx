import { Dialog } from "@headlessui/react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { m, AnimatePresence } from "framer-motion";

type StateSetter<T> = Dispatch<SetStateAction<T>>;

interface ModalProps {
  open: boolean;
  children?: ReactNode;
  onClose: () => void;
  fullWidth?: boolean;
}

export default function Modal({
  open,
  children,
  onClose,
  fullWidth,
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
            className="fixed inset-0 overflow-y-auto"
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
            <div
              className={`flex items-center justify-center p-2 sm:p-4 ${
                fullWidth ? "h-full" : ""
              }`}
            >
              <Dialog.Panel
                className={`max-w-7xl transform overflow-hidden rounded-lg text-left align-middle shadow-xl transition-all md:h-5/6 ${
                  fullWidth ? "w-full" : ""
                }`}
              >
                <div className="flex h-full glassy:backdrop-blur-3xl dark:bg-primary-800 dark:text-primary-50 dark:glassy:bg-primary-800/30">
                  {children}
                </div>
              </Dialog.Panel>
            </div>
          </m.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
