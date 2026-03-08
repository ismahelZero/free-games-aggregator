import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css"; // Ensure your global styles are imported

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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

// This is the missing part that Next.js is asking for
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}