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
};

const tupleIndexes = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const createMantineColorTuple = (
  colorName: string,
  defaultIndex: (typeof tupleIndexes)[number] = "5",
): TailwindColorsTuples => {
  const entries = tupleIndexes.map<[string, string]>((index) => [
    index,
    `var(--mantine-color-${colorName}-${index})`,
  ]);

  return Object.fromEntries([
    ...entries,
    ["DEFAULT", `var(--mantine-color-${colorName}-${defaultIndex})`],
  ]) as TailwindColorsTuples;
};

const mantineColor: Record<string, TailwindColorsTuples> = {
  primary: createMantineColorTuple("primary", "6"),
  dark: createMantineColorTuple("dark"),
  gray: createMantineColorTuple("gray"),
  red: createMantineColorTuple("red"),
  pink: createMantineColorTuple("pink"),
  grape: createMantineColorTuple("grape"),
  violet: createMantineColorTuple("violet"),
  indigo: createMantineColorTuple("indigo"),
  blue: createMantineColorTuple("blue"),
  cyan: createMantineColorTuple("cyan"),
  teal: createMantineColorTuple("teal"),
  green: createMantineColorTuple("green"),
  lime: createMantineColorTuple("lime"),
  yellow: createMantineColorTuple("yellow"),
  orange: createMantineColorTuple("orange"),
};

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
        'heading5': ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        // Font Group - Body
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '300' }],
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

