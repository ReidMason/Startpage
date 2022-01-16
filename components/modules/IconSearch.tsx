import React, { useState } from 'react'
import Button from '../Button';
import { Icon } from '@iconify/react-with-api';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
import { CSSTransition } from 'react-transition-group';
import { searchIcons } from '../../services/Iconify';

const classNames = {
    enter: 'transition duration-300 transform translate-y-3 opacity-0',
    enterActive: 'transition duration-300 transform translate-y-0 opacity-100',
    enterDone: 'transition duration-300 transform translate-y-0 opacity-100',
    exit: 'transition duration-300 opacity-0',
}

interface IconSearchProps {
    className?: string;
    iconSelected: Function;
    selectedIcon?: string;
}

export default function IconSearch({ className, iconSelected, selectedIcon }: IconSearchProps) {
    const [iconName, setIconName] = useState<string>("");
    const [icons, setIcons] = useState<Array<string> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const searchForIcons = () => {
        setLoading(true);
        searchIcons(iconName).then((icons) => {
            setIcons(icons);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleFormSubmission = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        searchForIcons();
    }

    const selectIcon = (iconName: string) => {
        if (!loading)
            iconSelected(iconName);
    }

    return (
        <div className={`flex flex-col gap-4 ${className} ${icons !== null ? "" : "w-64"}`}>
            <div className="flex gap-4 items-center">
                <form onSubmit={handleFormSubmission} className="w-48">
                    <Input setValue={setIconName} defaultValue={iconName} placeholder="Icon search..." />
                </form>
                <div className="flex gap-4 mt-auto">
                    <Button className="h-[42px]" loading={loading} onClick={searchForIcons}>Search</Button>
                    {icons !== null && <Button className="h-[42px]" loading={loading} onClick={() => (setIcons(null))}>Close</Button>}
                </div>
            </div>

            {/* Icon results display */}
            {icons !== null &&
                <div className="p-4 bg-nord-2 rounded w-full h-64 overflow-y-auto overflow-x-hidden">
                    <div className="relative h-full w-full">
                        {loading &&
                            <div className="flex w-full h-full absolute justify-center items-center text-6xl">
                                <LoadingSpinner />
                            </div>
                        }
                        <div className={`${loading ? "opacity-10" : ""} transition w-full h-full`}>
                            {icons.length ?
                                <CSSTransition timeout={300} classNames={classNames}>

                                    <div className={`flex flex-wrap text-5xl mx-auto gap-2`}>
                                        {
                                            icons.map((icon) => (
                                                <div className={`${loading ? "" : "cursor-pointer hover:shadow-lg hover:bg-nord-1 focus:shadow-lg focus:bg-nord-1 focus:outline-none"} ${selectedIcon === icon ? "bg-nord-10 bg-opacity-50 shadow-lg" : ""} p-2 rounded transition text-nord-8`} onClick={() => selectIcon(icon)} key={icon}>
                                                    <Icon icon={icon} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </CSSTransition>
                                :
                                <CSSTransition timeout={300} classNames={classNames}>
                                    <div className="flex flex-col gap-2 items-center justify-center h-full text-xl">
                                        <div className="text-6xl">
                                            <Icon icon="clarity:sad-face-line" />
                                        </div>
                                        <p>No icons found</p>
                                    </div>
                                </CSSTransition>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
