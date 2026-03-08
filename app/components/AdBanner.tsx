"use client";
import {useEffect} from 'react';

export default function AdBanner() {
    useEffect(() => {
        try {
            // Push the ad request to Google once the component mounts
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div
            className="w-full h-full bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden flex items-center justify-center p-4">
            <ins className="adsbygoogle w-full h-full"
                 style={{display: 'block'}}
                 data-ad-client="ca-pub-5009121739741215"
                 data-ad-slot="1134216011"
                 data-ad-format="auto"
                 data-full-width-responsive="true">
            </ins>
        </div>
    );
}