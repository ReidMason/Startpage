import React, { useContext, useRef } from 'react'
import Button from '../../components/Button';
import ProviderForm from '../../components/ProviderForm';
import { generateUuid } from '../../utils';
import { SettingsContext } from './settingsContext';

export default function ProviderSettings() {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;
    const endingElement = useRef<HTMLDivElement>(null);

    const removeProvider = (providerId: string) => {
        modifiedConfig!.providers = modifiedConfig!.providers.filter((provider) => (provider.id !== providerId))
        setModifiedConfig({ ...modifiedConfig! });
    }

    const createNewProvider = () => {
        modifiedConfig!.providers.push({ id: generateUuid(), name: "", baseUrl: "", prefix: "", searchUrl: "" });
        setModifiedConfig({ ...modifiedConfig! });
        setTimeout(scrollToBottom, 100);
    }

    const scrollToBottom = () => {
        endingElement.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div>
            <div className="flex gap-4 bg-nord-1 p-4 w-full sticky top-0 z-50 border-t border-opacity-60 shadow-lg">
                <Button onClick={createNewProvider} colour="green">New provider</Button>
                <Button onClick={scrollToBottom}>Scroll to bottom</Button>
            </div>
            <div className="flex flex-col max-w-5xl p-4">
                <div className="flex flex-col gap-4">
                    {modifiedConfig!.providers.map((provider) => (
                        <div className="flex flex-col gap-4 border border-nord-4 border-opacity-40 rounded p-2" key={provider.id}>
                            <div className="col-span-2">
                                <ProviderForm provider={provider} />
                            </div>
                            <div className="flex">
                                <div className="w-24">
                                    <Button onClick={() => (removeProvider(provider.id))} colour="red">Delete</Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Ending element to scroll to bottom */}
                    <div ref={endingElement}></div>
                </div>
            </div>
        </div>
    )
}
