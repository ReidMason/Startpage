import { Dialog } from "@headlessui/react";
import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ModalProps {
  open: boolean;
  setOpen: StateSetter<boolean>;
  children?: ReactNode;
}

export default function Modal({ open, setOpen, children }: ModalProps) {
  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <Dialog className="relative z-10" onClose={closeModal} open={open}>
            <motion.div
              key="backdrop"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1 },
                collapsed: { opacity: 0 },
              }}
              transition={{ duration: 0.15, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </motion.div>

            <motion.div
              className="fixed inset-0 overflow-y-auto"
              key="panel"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { scale: 1, originY: 1, originX: 0, opacity: 1 },
                collapsed: { scale: 0, originY: 1, originX: 0, opacity: 0 },
              }}
              transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <div className="flex h-full items-center justify-center p-4">
                <Dialog.Panel className="h-5/6 w-full max-w-7xl transform overflow-hidden rounded-lg bg-primary-800 text-left align-middle shadow-xl transition-all">
                  <div className="flex h-full flex-col">
                    <div className="flex h-full">{children}</div>
                  </div>
                </Dialog.Panel>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
