import { Listbox } from '@headlessui/react'
import ListBoxOption from '../interfaces/ListBoxOption';


interface ListBoxProps {
    options: Array<ListBoxOption>;
    selectedValue: ListBoxOption;
    setSelectedValue: Function;
    disabled?: boolean;
    className?: string;
    label: string;
}

export default function ListBox({ className, options, selectedValue, setSelectedValue, disabled, label }: ListBoxProps) {
    const updateSelectedValue = (option: ListBoxOption) => {
        setSelectedValue(option);
    }

    return (
        <div className={`flex flex-col w-full ${className}`}>
            <label className="ml-1 mb-2 text-nord-4">{label}</label>

            <Listbox disabled={disabled} value={selectedValue} onChange={updateSelectedValue}>
                <div className="relative">
                    <Listbox.Button className="flex w-full relative justify-between text-left text-nord-0 p-2 rounded bg-nord-5 border border-nord-5 disabled:cursor-not-allowed disabled:opacity-50">
                        <span>{selectedValue.name}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </Listbox.Button>
                    <Listbox.Options className="mt-2 absolute w-full z-50">
                        <div className="text-nord-0 rounded bg-nord-5 overflow-hidden">
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.id}
                                    value={option}
                                    disabled={option.unavailable}
                                    className={`flex justify-between cursor-pointer p-2 hover:bg-nord-3 hover:bg-opacity-20 ${option.unavailable ? "bg-nord-3 bg-opacity-10 text-nord-3 text-opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {option.name}
                                    {selectedValue.id === option.id &&
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    }
                                </Listbox.Option>
                            ))}
                        </div>
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    )
}
