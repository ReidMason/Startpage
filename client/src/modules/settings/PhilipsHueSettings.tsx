import { RadioGroup } from '@headlessui/react';
import React, { useContext, useEffect, useState } from 'react'
import Button from '../../components/Button';
import TextInput from '../../components/TextInput'
import Toggle from '../../components/Toggle';
import { connect, HueGroup } from '../../services/HueService';
import { SettingsContext } from './settingsContext';
import { getGroups } from '../../services/HueService';

var pairingInterval: NodeJS.Timeout | null = null;

export default function PhilipsHueSettings() {
    const { modifiedConfig, setModifiedConfig } = useContext(SettingsContext)!;
    const [pairing, setPairing] = useState(false);
    const [testing, setTesting] = useState(false);
    const [connected, setConnected] = useState<null | boolean>(null);
    const [groups, setGroups] = useState<Array<HueGroup>>();

    const loadGroups = () => {
        getGroups().then((response) => {
            // Filter out the light groups
            const groupData = response.data.filter(x => x.type !== "LightGroup")
            setGroups(groupData);
        });
    }

    useEffect(() => {
        loadGroups();
    }, [])

    const testHueConnection = () => {
        setTesting(true);
        setConnected(null);
        connect(modifiedConfig!.philipsHue.ip).then((response) => {
            setConnected(response.data.connected);
        }).finally(() => {
            setTesting(false);
        });
    }

    const setHueIp = (newIp: string) => {
        // Clear the test result display
        if (newIp.trim() !== modifiedConfig!.philipsHue.ip)
            setConnected(null);

        modifiedConfig!.philipsHue.ip = newIp.trim();
        setModifiedConfig({ ...modifiedConfig! });
    }

    const setSelectedGroupId = (roomId: string) => {
        modifiedConfig!.philipsHue.selectedGroupId = roomId;
        setModifiedConfig({ ...modifiedConfig! });
    }

    const cancelPairing = () => {
        if (pairingInterval) {
            clearInterval(pairingInterval);
            setPairing(false);
            setConnected(null);
        }
    }

    const pair = () => {
        cancelPairing();
        setPairing(true);
        setConnected(null);
        pairingInterval = setInterval(() => {
            connect(modifiedConfig!.philipsHue.ip).then((response) => {
                const connected = response.data.connected;
                if (connected) {
                    cancelPairing();
                    setConnected(connected);
                }
            });
        }, 1000)
    }

    const updateModifiedConfig = () => {
        setModifiedConfig({ ...modifiedConfig! });
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-x-16 p-4">
            <div className="flex flex-col gap-2">
                <p className="text-nord-4">Philips Hue enabled</p>
                <div className="flex gap-2">
                    <Toggle defaultValue={modifiedConfig!.philipsHue.enabled} setter={(val: boolean) => { modifiedConfig!.philipsHue.enabled = val; updateModifiedConfig(); }} />
                    <p className="text-nord-4">{modifiedConfig!.philipsHue.enabled ? "Enabled" : "Disabled"}</p>
                </div>
            </div>

            {modifiedConfig!.philipsHue.enabled &&
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="w-52">
                            <TextInput disabled={pairing || testing} defaultValue={modifiedConfig?.philipsHue.ip} setValue={setHueIp} placeholder="Hue bridge IP" floatingLabel />
                        </div>
                    </div>

                    {pairing &&
                        <p className="text-nord-4">Press the button on top of your Hue bridge</p>
                    }
                    <div className="flex gap-4">
                        {
                            pairing ?
                                <Button className="w-24" onClick={cancelPairing}>
                                    Cancel
                                </Button>
                                :
                                <Button loading={pairing || testing} className="w-24" onClick={pair}>
                                    Pair
                                </Button>
                        }

                        <Button loading={pairing || testing} className="w-24" onClick={testHueConnection}>
                            <div className="flex gap-1">
                                <span>Test</span>
                                {
                                    connected !== null &&
                                    (connected ?
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nord-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-nord-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>)
                                }
                            </div>
                        </Button>
                    </div>
                </div >
            }

            {modifiedConfig!.philipsHue.enabled && groups &&
                <div>
                    <h3 className="text-nord-4 mb-2">Select a group to control</h3>
                    <RadioGroup className="flex flex-col gap-2" value={modifiedConfig?.philipsHue.selectedGroupId} onChange={setSelectedGroupId}>
                        {
                            groups.map((group) => (
                                <RadioGroup.Option value={group.id} key={group.id}>
                                    {({ checked }) => (
                                        <div className={` p-2 rounded text-nord-4 cursor-pointer ${checked ? "bg-nord-14 text-nord-6" : "bg-nord-2 hover:bg-nord-3"}`}>
                                            <span>{group.name}</span>
                                        </div>
                                    )}
                                </RadioGroup.Option>
                            ))
                        }
                    </RadioGroup>
                </div>
            }
        </div >
    )
}

