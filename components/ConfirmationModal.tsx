import React, { Fragment } from 'react'
import { Dialog, Transition } from "@headlessui/react";
import Button from '../components/Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    close: Function;
    title: string;
    children: React.ReactNode;
    confirmAction: Function;
    denyAction: Function;
}

export default function ConfirmationModal({ isOpen, title, children, close, confirmAction, denyAction }: ConfirmationModalProps) {
    const confirmClicked = () => {
        close();
        confirmAction();
    }

    const cancelClicked = () => {
        close();
        denyAction();
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog className="fixed inset-0 z-10 overflow-y-auto" open={isOpen} onClose={() => { }}>
                <div className="min-h-screen">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-150"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 -z-10 bg-black opacity-60" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-150"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="flex h-screen justify-center items-center">
                            <div className="bg-nord-2 w-[40rem] rounded-lg overflow-hidden text-nord-4">
                                <Dialog.Title className="bg-nord-1 p-3 text-2xl">{title}</Dialog.Title>
                                <Dialog.Description className="flex flex-col justify-between" as="div">
                                    {/* Main body */}
                                    <div className="p-6 h-28">
                                        {children}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex gap-4 bg-nord-1 p-4">
                                        <Button className="w-24" colour="green" onClick={confirmClicked}>Confirm</Button>
                                        <Button className="w-24" colour="red" onClick={cancelClicked}>Cancel</Button>
                                    </div>
                                </Dialog.Description>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}
