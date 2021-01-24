import React from 'react'

interface headerProps {
    title: string;
}

export default function Header({ title }: headerProps) {
    return (
        <div className="w-full h-full py-3 px-2 rounded-tr-lg shadow-sm bg-nord-2">
            <h1 className="text-2xl font-medium my-auto ml-2">{title}</h1>
        </div>
    )
}
