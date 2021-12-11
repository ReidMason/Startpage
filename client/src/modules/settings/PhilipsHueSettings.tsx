import React, { useContext, useState } from 'react'
import Button from '../../components/Button';
import TextInput from '../../components/TextInput'
import { connect } from '../../services/HueService';
import { SettingsContext } from './settingsContext';

var pairingInterval: NodeJS.Timeout | null = null;

export default function PhilipsHueSettings() {
    const { modifiedConfig } = useContext(SettingsContext)!;
    const [pairing, setPairing] = useState(false);
    const [testing, setTesting] = useState(false);
    const [connected, setConnected] = useState<null | boolean>(null);

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
        modifiedConfig!.philipsHue.ip = newIp;
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
                console.log(connected);
                if (connected) {
                    cancelPairing();
                    setConnected(connected);
                }
            });
        }, 1000)
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl text-nord-4 semibold">Philips hue settings</h2>

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
        </div>
    )
}
