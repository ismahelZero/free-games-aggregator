import {ImageResponse} from 'next/og';

export const runtime = 'edge';
export const alt = 'LootVault - Secure the bag. Play for free.';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div style={{
                background: '#0f172a',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '12px solid #10b981',
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '40px'}}>
                    {/* Using your EXACT SVG structure */}
                    <svg
                        width="200"
                        height="200"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{display: 'flex'}}
                    >
                        {/* Outer Vault Frame */}
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#10b981" strokeWidth="1.5"/>

                        {/* Vault Handle / Play Button */}
                        <path d="M10 8l6 4-6 4V8z" fill="#10b981" stroke="#10b981" strokeWidth="1"/>

                        {/* Mechanical Details (Circle) */}
                        <circle cx="12" cy="12" r="9" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2"/>

                        {/* Crosshairs - Exact paths from your component */}
                        <path d="M3 12h3" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5"/>
                        <path d="M18 12h3" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5"/>
                        <path d="M12 3v3" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5"/>
                        <path d="M12 18v3" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5"/>
                    </svg>

                    <h1 style={{
                        fontSize: '120px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif',
                        display: 'flex'
                    }}>
                        LOOT<span style={{color: '#10b981'}}>VAULT</span>
                    </h1>
                </div>
                <p style={{color: '#94a3b8', fontSize: '32px', marginTop: '20px', fontFamily: 'sans-serif'}}>
                    Secure the bag. Play for free.
                </p>
            </div>
        ),
        {...size}
    );
}