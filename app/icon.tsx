import {ImageResponse} from 'next/og';

export const runtime = 'edge';
export const size = {width: 32, height: 32};
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div style={{
                background: '#0f172a',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#10b981" strokeWidth="2"/>
                    <path d="M10 8l6 4-6 4V8z" fill="#10b981" stroke="#10b981"/>
                    <circle cx="12" cy="12" r="9" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2"/>
                </svg>
            </div>
        ),
        {...size}
    );
}