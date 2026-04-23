import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark operations theme
        ops: {
          bg: '#0a0e14',
          surface: '#111827',
          'surface-raised': '#1a2332',
          border: '#2d3748',
          'border-light': '#374151',
        },
        // Status colors
        status: {
          pending: '#f59e0b',
          acknowledged: '#3b82f6',
          dispatched: '#8b5cf6',
          enroute: '#06b6d4',
          onscene: '#10b981',
          resolved: '#6b7280',
          cancelled: '#ef4444',
        },
        // Priority colors
        priority: {
          low: '#6b7280',
          normal: '#3b82f6',
          high: '#f59e0b',
          critical: '#ef4444',
        },
        // Emergency type colors
        emergency: {
          medical: '#ef4444',
          fire: '#f97316',
          safety: '#8b5cf6',
          security: '#3b82f6',
        },
        // Confidence indicators
        confidence: {
          high: '#10b981',
          medium: '#f59e0b',
          low: '#ef4444',
          unknown: '#6b7280',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
