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
        ops: {
          bg: '#0f172a',
          surface: '#1e293b',
          'surface-raised': '#334155',
          border: '#475569',
        },
        status: {
          available: '#22c55e',
          busy: '#f59e0b',
          offline: '#6b7280',
        },
      },
    },
  },
  plugins: [],
};

export default config;
