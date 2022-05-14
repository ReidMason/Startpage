import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, ReactNode } from "react";

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
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="h-5/6 w-full max-w-7xl transform overflow-hidden rounded-lg bg-primary-800 text-left align-middle shadow-xl transition-all">
                <div className="flex h-full flex-col">
                  <div className="flex h-full">{children}</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
