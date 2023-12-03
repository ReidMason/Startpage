import { Fragment, HTMLAttributes, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StateSetter } from "@/utils/common";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { classNames } from "@/utils/utils";

interface SettingsSidebarProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AppEditor({
  children,
  open,
  setOpen,
}: SettingsSidebarProps) {
  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="-translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="-translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute -left-14 top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-3 pb-2 ring-1 ring-white/10">
                  <form>
                    <p>Edit the app</p>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <main
        className={classNames(
          open ? "md:mr-80 md:px-4" : "",
          "transition-all ease-in-out duration-300",
        )}
      >
        {children}
      </main>
    </div>
  );
}
