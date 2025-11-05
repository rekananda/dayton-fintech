import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';

type TailwindColorsTuples = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  "6": string;
  "7": string;
  "8": string;
  "9": string;
  DEFAULT: string;
}

const mantineColor: Record<string, TailwindColorsTuples> = {
  "primary": {
    "0": "#fff4e1",
    "1": "#ffe7cc",
    "2": "#ffce9a",
    "3": "#ffb364",
    "4": "#fe9d37",
    "5": "#fe8e1b",
    "6": "#ff8200",
    "7": "#e37300",
    "8": "#cb6600",
    "9": "#b15600",
    "DEFAULT": "#ff8200"
  },
  "dark": {
    "0": "#C1C2C5",
    "1": "#A6A7AB",
    "2": "#909296",
    "3": "#5C5F66",
    "4": "#373A40",
    "5": "#2C2E33",
    "6": "#25262B",
    "7": "#1A1B1E",
    "8": "#141517",
    "9": "#101113",
    "DEFAULT": "#2C2E33"
  },
  "gray": {
    "0": "#F8F9FA",
    "1": "#F1F3F5",
    "2": "#E9ECEF",
    "3": "#DEE2E6",
    "4": "#CED4DA",
    "5": "#ADB5BD",
    "6": "#868E96",
    "7": "#495057",
    "8": "#343A40",
    "9": "#212529",
    "DEFAULT": "#ADB5BD"
  },
  "red": {
    "0": "#FFF5F5",
    "1": "#FFE3E3",
    "2": "#FFC9C9",
    "3": "#FFA8A8",
    "4": "#FF8787",
    "5": "#FF6B6B",
    "6": "#FA5252",
    "7": "#F03E3E",
    "8": "#E03131",
    "9": "#C92A2A",
    "DEFAULT": "#FF6B6B"
  },
  "pink": {
    "0": "#FFF0F6",
    "1": "#FFDEEB",
    "2": "#FCC2D7",
    "3": "#FAA2C1",
    "4": "#F783AC",
    "5": "#F06595",
    "6": "#E64980",
    "7": "#D6336C",
    "8": "#C2255C",
    "9": "#A61E4D",
    "DEFAULT": "#F06595"
  },
  "grape": {
    "0": "#F8F0FC",
    "1": "#F3D9FA",
    "2": "#EEBEFA",
    "3": "#E599F7",
    "4": "#DA77F2",
    "5": "#CC5DE8",
    "6": "#BE4BDB",
    "7": "#AE3EC9",
    "8": "#9C36B5",
    "9": "#862E9C",
    "DEFAULT": "#CC5DE8"
  },
  "violet": {
    "0": "#F3F0FF",
    "1": "#E5DBFF",
    "2": "#D0BFFF",
    "3": "#B197FC",
    "4": "#9775FA",
    "5": "#845EF7",
    "6": "#7950F2",
    "7": "#7048E8",
    "8": "#6741D9",
    "9": "#5F3DC4",
    "DEFAULT": "#845EF7"
  },
  "indigo": {
    "0": "#EDF2FF",
    "1": "#DBE4FF",
    "2": "#BAC8FF",
    "3": "#91A7FF",
    "4": "#748FFC",
    "5": "#5C7CFA",
    "6": "#4C6EF5",
    "7": "#4263EB",
    "8": "#3B5BDB",
    "9": "#364FC7",
    "DEFAULT": "#5C7CFA"
  },
  "blue": {
    "0": "#E7F5FF",
    "1": "#D0EBFF",
    "2": "#A5D8FF",
    "3": "#74C0FC",
    "4": "#4DABF7",
    "5": "#339AF0",
    "6": "#228BE6",
    "7": "#1C7ED6",
    "8": "#1971C2",
    "9": "#1864AB",
    "DEFAULT": "#339AF0"
  },
  "cyan": {
    "0": "#E3FAFC",
    "1": "#C5F6FA",
    "2": "#99E9F2",
    "3": "#66D9E8",
    "4": "#3BC9DB",
    "5": "#22B8CF",
    "6": "#15AABF",
    "7": "#1098AD",
    "8": "#0C8599",
    "9": "#0B7285",
    "DEFAULT": "#22B8CF"
  },
  "teal": {
    "0": "#E6FCF5",
    "1": "#C3FAE8",
    "2": "#96F2D7",
    "3": "#63E6BE",
    "4": "#38D9A9",
    "5": "#20C997",
    "6": "#12B886",
    "7": "#0CA678",
    "8": "#099268",
    "9": "#087F5B",
    "DEFAULT": "#20C997"
  },
  "green": {
    "0": "#EBFBEE",
    "1": "#D3F9D8",
    "2": "#B2F2BB",
    "3": "#8CE99A",
    "4": "#69DB7C",
    "5": "#51CF66",
    "6": "#40C057",
    "7": "#37B24D",
    "8": "#2F9E44",
    "9": "#2B8A3E",
    "DEFAULT": "#51CF66"
  },
  "lime": {
    "0": "#F4FCE3",
    "1": "#E9FAC8",
    "2": "#D8F5A2",
    "3": "#C0EB75",
    "4": "#A9E34B",
    "5": "#94D82D",
    "6": "#82C91E",
    "7": "#74B816",
    "8": "#66A80F",
    "9": "#5C940D",
    "DEFAULT": "#94D82D"
  },
  "yellow": {
    "0": "#FFF9DB",
    "1": "#FFF3BF",
    "2": "#FFEC99",
    "3": "#FFE066",
    "4": "#FFD43B",
    "5": "#FCC419",
    "6": "#FAB005",
    "7": "#F59F00",
    "8": "#F08C00",
    "9": "#E67700",
    "DEFAULT": "#FCC419"
  },
  "orange": {
    "0": "#FFF4E6",
    "1": "#FFE8CC",
    "2": "#FFD8A8",
    "3": "#FFC078",
    "4": "#FFA94D",
    "5": "#FF922B",
    "6": "#FD7E14",
    "7": "#F76707",
    "8": "#E8590C",
    "9": "#D9480F",
    "DEFAULT": "#FF922B"
  }
}

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000",
        ...mantineColor,
      },
      screens: {
        "2xsm": "375px",
        xsm: "425px",
        "3xl": "2000px",
      },
      fontSize: {
        xxs: '.625rem',
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
        // Font Group - Headings
        'heading1': ['80px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading2': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading3': ['40px', { lineHeight: '1.2', fontWeight: '600' }],
        'heading4': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        // Font Group - Body
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-semibold': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-bold': ['1rem', { lineHeight: '1.5', fontWeight: '700' }],
      },
      fontWeight: {
        normal: '400',
        semibold: '600',
        bold: '700',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "Arial", "sans-serif", ...defaultTheme.fontFamily.sans],
        mono: ["ui-monospace", "SFMono-Regular", '"SF Mono"', "Menlo", "Consolas", '"Liberation Mono"', "monospace", ...defaultTheme.fontFamily.mono],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;

