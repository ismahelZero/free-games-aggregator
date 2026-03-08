import type {Metadata} from "next";
import "./globals.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Script from "next/script";

export const metadata: Metadata = {
    metadataBase: new URL('https://free.myfps.app'),
    title: {
        default: "LootVault | Free PC Games Tracker",
        template: "%s | LootVault"
    },
    description: "Secure the bag. Play for free. LootVault tracks every active free game giveaway on Epic, Steam, GOG, and IndieGala.",
    keywords: ["free games", "pc games", "epic games giveaway", "steam free games", "lootvault"],
    openGraph: {
        title: "LootVault",
        description: "Never miss a free game giveaway again.",
        url: "https://free.myfps.app",
        siteName: "LootVault",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "LootVault | Free PC Games",
        description: "Secure the bag. Play for free.",
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function RootLayout({children}: { children: React.ReactNode }) {

    return (
        <html lang="en">
        <head>
            {/* Google AdSense Script */}
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5009121739741215"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
        </head>
        <body
            className={`antialiased  flex flex-col min-h-screen`}>
        <Navbar/>

        <main className="flex-grow pt-20">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}