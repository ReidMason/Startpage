import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Extension } from '../../interfaces/Extension';

const classNames = {
    enter: 'transition duration-150 scale-0 opacity-40 origin-bottom',
    enterActive: 'transition duration-150 scale-100 opacity-100 origin-bottom',
    enterDone: '',
    exit: 'transition duration-150 opacity-0 transform -translate-y-3',
}

interface ExtensionsDisplayProps {
    extensions: Array<Extension>;
    setExtensions: Function;
}

export default function ExtensionsDisplay({ extensions, setExtensions }: ExtensionsDisplayProps) {

    const removeExtension = (extensionId: string) => {
        extensions = extensions.filter(x => x.id !== extensionId);
        setExtensions([...extensions]);
    }

    return (
        <TransitionGroup component="div" className="mt-24 flex flex-wrap gap-4">
            {extensions.map((extension) => (
                <CSSTransition timeout={150} classNames={classNames} key={extension.id} >
                    <div className="group hover:bg-nord-1 p-3 rounded relative overflow-hidden hover:shadow-md">
                        <button className="transition-all absolute opacity-0 p-0.5 group-hover:opacity-100 top-0 right-0 rounded-bl-md text-nord-4 bg-nord-11 shadow-sm hover:scale-125 hover:-translate-x-0.5 hover:translate-y-0.5" onClick={() => removeExtension(extension.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <extension.element />
                    </div>
                </CSSTransition>
            ))}
        </TransitionGroup>
    )
}
