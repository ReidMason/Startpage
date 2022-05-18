import { Disclosure } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapseProps {
  header: React.ReactNode;
  body: React.ReactNode;
}

export default function Collapse({ header, body }: CollapseProps) {
  const [defaultOpen, setDefaultOpen] = useState<boolean>();

  useEffect(() => {
    setDefaultOpen(window.innerWidth >= 1024);
  }, []);

  return (
    <>
      defaultOpen != undefined && (
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full">
              <div className="flex items-center justify-between pr-4">
                {header}
                <div className="flex gap-1">
                  <motion.div animate={{ x: open ? "1.5rem" : 0 }}>
                    <div className="h-2 w-2 rounded-full bg-primary-100"></div>
                  </motion.div>
                  <motion.div animate={{ x: open ? "0.75rem" : 0 }}>
                    <div className="h-2 w-2 rounded-full bg-primary-100"></div>
                  </motion.div>
                  <motion.div
                    animate={{
                      scale: open ? 1.5 : 1,
                      borderRadius: "100%",
                    }}
                  >
                    <div className="h-2 w-2 rounded-full bg-primary-100"></div>
                  </motion.div>
                </div>
              </div>
            </Disclosure.Button>

            <Disclosure.Panel static>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    className="overflow-hidden"
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { height: "auto" },
                      collapsed: { height: 0 },
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                  >
                    {body}
                  </motion.div>
                )}
              </AnimatePresence>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      )
    </>
  );
}