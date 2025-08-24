'use client';

import React, { memo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = memo(() => {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle-btn"
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      <div className="toggle-container">
        <div className="toggle-icon">
          {isDark ? (
            // Icono de sol para modo claro
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            // Icono de luna para modo oscuro
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </div>
        <span className="toggle-text">
          {isDark ? 'Claro' : 'Oscuro'}
        </span>
      </div>

      <style jsx>{`
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 2px solid var(--border-color, #e2e8f0);
          border-radius: 8px;
          background: var(--bg-secondary, #ffffff);
          color: var(--text-primary, #1a202c);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 500;
          min-width: 100px;
        }

        .theme-toggle-btn:hover {
          background: var(--bg-hover, #f7fafc);
          border-color: var(--border-hover, #cbd5e0);
          transform: translateY(-1px);
        }

        .theme-toggle-btn:active {
          transform: translateY(0);
        }

        .toggle-container {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .toggle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }

        .toggle-text {
          font-size: 14px;
          font-weight: 500;
        }

        /* Modo oscuro */
        [data-theme='dark'] .theme-toggle-btn {
          --bg-secondary: #2d3748;
          --text-primary: #f7fafc;
          --border-color: #4a5568;
          --bg-hover: #4a5568;
          --border-hover: #718096;
        }
      `}</style>
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;