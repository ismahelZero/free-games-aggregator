export const LootVaultLogo = ({className}: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{filter: 'drop-shadow(0 0 8px #10b981)'}}
    >
        {/* Outer Vault Frame */}
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        {/* Vault Handle / Play Button */}
        <path d="M10 8l6 4-6 4V8z" fill="#10b981" stroke="#10b981"/>
        {/* Mechanical Details */}
        <circle cx="12" cy="12" r="9" strokeOpacity="0.2"/>
        <path d="M3 12h3M18 12h3M12 3v3M12 18v3" strokeOpacity="0.5"/>
    </svg>
);