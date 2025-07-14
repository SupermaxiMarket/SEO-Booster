import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#38bdf8', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#34d399', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <path d="M24.0002 4L4.00018 24L10.0002 30L24.0002 16.8V4Z" fill="url(#logoGradient)"/>
            <path d="M24.0002 44L44.0002 24L38.0002 18L24.0002 31.2V44Z" fill="url(#logoGradient)"/>
            <path d="M12.0002 31.2L22.8002 42L30.0002 34.8L19.2002 24L12.0002 31.2Z" fill="url(#logoGradient)" fillOpacity="0.6"/>
        </svg>
        <span className="text-xl font-bold tracking-tight text-white">SEO Booster</span>
    </div>
  );
};