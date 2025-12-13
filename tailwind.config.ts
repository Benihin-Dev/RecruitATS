
import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: "#f7671e",
                    light: "#ff8c50",
                    dark: "#d5510f",
                    gradientStart: "#f7671e",
                    gradientEnd: "#ff4500",
                },
                secondary: {
                    DEFAULT: "#6b7280",
                    light: "#f3f4f6",
                    dark: "#1f2937",
                },
                background: {
                    page: "#f8fafc",
                    card: "#ffffff",
                }
            },
            boxShadow: {
                'glow': '0 0 15px rgba(247, 103, 30, 0.5)',
                'glow-hover': '0 0 25px rgba(247, 103, 30, 0.7)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            },
            backgroundImage: {
                'primary-gradient': 'linear-gradient(135deg, #f7671e 0%, #ff4500 100%)',
                'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f7671e' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }
        },
    },
    plugins: [],
};
export default config;
