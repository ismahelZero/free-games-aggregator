'use client'
import { useEffect, useState } from 'react'

export default function AdBanner() {
    const [isMounted, setIsMounted] = useState(false)

    // 1. Wait until hydration is complete before marking as mounted
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true)
    }, [])

    // 2. Only push the ad request after the component is safely mounted on the client
    useEffect(() => {
        if (isMounted) {
            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (err) {
                console.error('AdSense error:', err)
            }
        }
    }, [isMounted])

    if (!isMounted) {
        return <div className="w-full h-full bg-slate-900/50 border border-slate-800 rounded-3xl" />
    }

    return (
        <div className="w-full h-full bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex items-center justify-center p-4">
            <ins
                className="adsbygoogle w-full h-full"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-5009121739741215"
                data-ad-slot="1134216011"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    )
}
