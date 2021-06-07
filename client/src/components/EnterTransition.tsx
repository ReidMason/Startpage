import React, { useEffect, useState } from 'react'

interface EnterTransitionProps {
    children: React.ReactNode
}

export default function EnterTransition({ children }: EnterTransitionProps) {
    const [triggerAnimations, setTriggerAnimations] = useState<boolean>(false)

    useEffect(() => {
        setTimeout(() => (setTriggerAnimations(true)), 100);
    }, []);

    return (
        <div className={`transform duration-150 ${triggerAnimations ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {children}
        </div>
    )
}
