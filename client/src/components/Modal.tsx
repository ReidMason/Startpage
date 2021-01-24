import React from 'react'

interface ModalProps {
    header?: React.ReactNode;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    sidebar?: React.ReactNode;
}

export default function Modal({ header, children, footer, sidebar }: ModalProps) {
    return (
        <div className="flex absolute top-0 left-0 h-screen overflow-hidden w-full">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity -z-10">
                <div className="absolute inset-0 bg-black opacity-30"></div>
            </div>

            <div className="flex z-10 h-screen w-full sm:my-auto sm:h-5/6 md:mx-auto max-w-240">
                {sidebar && <div className="bg-nord-2 rounded-tl-lg rounded-bl-lg">
                    {sidebar}
                </div>}
                <div className={`bg-nord-1 max-h-screen flex flex-col w-full ${sidebar ? "rounded-tr-lg rounded-br-lg" : "rounded-lg"}`}>
                    <div>
                        {header}
                    </div>
                    <div className="flex flex-col overflow-y-auto">
                        {children}
                    </div>
                    <div className="mt-auto">
                        {footer}
                    </div>
                </div>
            </div>

        </div>
    )
}