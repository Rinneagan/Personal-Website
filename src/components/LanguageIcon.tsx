'use client';

import React from 'react';

interface LanguageIconProps {
  language: string;
  size?: number;
  className?: string;
}

export function LanguageIcon({ language, size = 16, className = '' }: LanguageIconProps) {
  const normalized = language.trim().toLowerCase();

  // Return official vector logos for each programming language
  switch (normalized) {
    case 'typescript':
    case 'ts':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          aria-hidden="true"
        >
          <rect width="100" height="100" fill="#3178c6" rx="12" />
          <text
            x="86"
            y="84"
            fill="#ffffff"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="34"
            fontWeight="bold"
            textAnchor="end"
          >
            TS
          </text>
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          aria-hidden="true"
        >
          <rect width="100" height="100" fill="#f7df1e" rx="12" />
          <text
            x="86"
            y="84"
            fill="#000000"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="36"
            fontWeight="900"
            textAnchor="end"
          >
            JS
          </text>
        </svg>
      );

    case 'python':
    case 'py':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          aria-hidden="true"
        >
          <path
            d="M11.93 2.006c-1.397.01-2.736.126-3.725.322-2.316.458-2.617 1.4-2.617 3.535v1.89h6.438v.9h-6.438C3.818 8.653 2 10.3 2 12.793c0 2.65 1.543 3.993 4.1 3.993h1.838v-2.585c0-2.327 1.83-4.225 4.125-4.225h6.438v-.954c0-2.26-.525-3.69-2.617-4.1a16.892 16.892 0 00-3.953-.915z"
            fill="#3776ab"
          />
          <path
            d="M12.07 21.994c1.396-.01 2.735-.126 3.725-.322 2.315-.458 2.616-1.4 2.616-3.535V16.25H11.97v-.9h6.439c1.768 0 3.587-1.646 3.587-4.14 0-2.65-1.543-3.993-4.1-3.993h-1.838v2.585c0 2.327-1.83 4.225-4.125 4.225H5.497v.954c0 2.26.525 3.69 2.616 4.1a16.892 16.892 0 003.954.915z"
            fill="#ffd343"
          />
          <circle cx="9.02" cy="5.25" r="1.1" fill="#fff" />
          <circle cx="14.98" cy="18.75" r="1.1" fill="#111" />
        </svg>
      );

    case 'go':
    case 'golang':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="#00ADD8"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10h-8v4" />
          <path d="M18 12h4" />
        </svg>
      );

    case 'rust':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          fill="#dea584"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="44" stroke="#dea584" strokeWidth="6" fill="none" />
          <path d="M50 8 A42 42 0 0 1 92 50 L84 50 A34 34 0 0 0 50 16 Z" opacity="0.3" />
          <text
            x="50"
            y="65"
            fontFamily="Courier, monospace"
            fontSize="45"
            fontWeight="bold"
            textAnchor="middle"
            fill="#dea584"
          >
            R
          </text>
        </svg>
      );

    case 'java':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="#b07219"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 2v4M10 1.5v4M14 2v4" />
          <path d="M18 12a6 6 0 0 1-12 0c0-2.5 2-4 4-4h4c2 0 4 1.5 4 4z" fill="#b07219" fillOpacity="0.15" />
          <path d="M3 17h18M5 21h14" />
        </svg>
      );

    case 'c++':
    case 'cpp':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          aria-hidden="true"
        >
          <path d="M50,5 L85,20 L85,60 L50,95 L15,60 L15,20 Z" fill="#00599c" />
          <text
            x="50"
            y="60"
            fill="#ffffff"
            fontFamily="Inter, sans-serif"
            fontSize="32"
            fontWeight="bold"
            textAnchor="middle"
          >
            C++
          </text>
        </svg>
      );

    case 'html':
    case 'html5':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          aria-hidden="true"
        >
          <path d="M2.37 2h19.26l-1.75 19.67L12 24.32l-7.88-2.65z" fill="#e34c26" />
          <path d="M12 3.73v17.26l6.19-2.08 1.34-15.18z" fill="#f06529" />
          <path d="M12 11.47H8.81l-.22-2.48H12V6.52H6.11l.66 7.43H12zm0 5.4l-.04.01-3.15-.85-.2-2.28H6.12l.4 4.54L12 19.63z" fill="#eaeaea" />
          <path d="M12 11.47h3.19l-.3 3.42-2.89.78V16.8l.04-.01 2.85-.77.38-4.3H12zm0-4.95v2.47h5.68l-.22 2.48H12v2.47h5.46l-.55 6.22-4.91 1.33v-1.32z" fill="#ffffff" />
        </svg>
      );

    case 'css':
    case 'css3':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          aria-hidden="true"
        >
          <path d="M2.37 2h19.26l-1.75 19.67L12 24.32l-7.88-2.65z" fill="#1572b6" />
          <path d="M12 3.73v17.26l6.19-2.08 1.34-15.18z" fill="#33a9dc" />
          <path d="M12 11.47H8.81l-.22-2.48H12V6.52H6.11l.66 7.43H12zm0 5.4l-.04.01-3.15-.85-.2-2.28H6.12l.4 4.54L12 19.63z" fill="#eaeaea" />
          <path d="M12 11.47h3.19l-.3 3.42-2.89.78V16.8l.04-.01 2.85-.77.38-4.3H12zm0-4.95v2.47h5.68l-.22 2.48H12v2.47h5.46l-.55 6.22-4.91 1.33v-1.32z" fill="#ffffff" />
        </svg>
      );

    case 'ruby':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 2L2 9.5l3.5 11h13l3.5-11z" fill="#701516" />
          <path d="M12 2L5.5 9.5H12v11l6.5-11H12z" fill="#cc342d" />
        </svg>
      );

    case 'vue':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 18.5L21.5 2h-4L12 11 6.5 2h-4z" fill="#41b883" />
          <path d="M12 18.5L17.5 2h-4L12 11 10.5 2h-4z" fill="#35495e" />
        </svg>
      );

    case 'swift':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="#F05138"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 14c-4.5 1-9-2.5-11-7a13 13 0 0 0-7 7.5" />
          <path d="M2 17c5-1.5 9-6.5 9-11.5a14 14 0 0 0-7 8" />
          <path d="M7 19c6.5-1 11-8.5 11-14a13 13 0 0 0-4 7.5" />
        </svg>
      );

    case 'kotlin':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="kotlin-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00AFFF" />
              <stop offset="50%" stopColor="#854FEB" />
              <stop offset="100%" stopColor="#F18E33" />
            </linearGradient>
          </defs>
          <path d="M90,90 L10,90 L10,10 L90,10 L50,50 Z" fill="url(#kotlin-grad)" />
        </svg>
      );

    case 'dart':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 2L2 12l10 10h8L12 12 20 2z" fill="#00b4ab" />
        </svg>
      );

    case 'shell':
    case 'bash':
    case 'sh':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="#89e051"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="18" rx="3" fill="#1e1e24" />
          <polyline points="7 9 11 12 7 15" />
        </svg>
      );

    case 'matlab':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="44" fill="#a020f0" fillOpacity="0.15" stroke="#a020f0" strokeWidth="4" />
          <path d="M25,65 Q35,30 50,55 T75,45" fill="none" stroke="#a020f0" strokeWidth="7" strokeLinecap="round" />
        </svg>
      );

    default:
      // Fallback elegant generic code/folder icon
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
  }
}
