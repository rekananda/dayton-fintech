<<<<<<< HEAD
import { CSSVariablesResolver, DEFAULT_THEME, DefaultMantineColor, MantineColorsTuple, createTheme, em, mergeMantineTheme, MantineThemeOverride } from '@mantine/core';
=======
import { CSSVariablesResolver, DEFAULT_THEME, DefaultMantineColor, MantineColorsTuple, MantineTheme, createTheme, em, mergeMantineTheme, MantineThemeOverride } from '@mantine/core';
>>>>>>> origin/stagging

type ExtendedColors = "primary" | DefaultMantineColor;

declare module "@mantine/core" {
	export interface MantineThemeColorsOverride {
		colors: Record<ExtendedColors, MantineColorsTuple>;
	}
}

const defaultShades = 6;

export const mantineColor: Record<ExtendedColors, MantineColorsTuple> = {
  primary: ["#fff4e1", "#ffe7cc", "#ffce9a", "#ffb364", "#fe9d37", "#fe8e1b", "#ff8200", "#e37300", "#cb6600", "#b15600"],
  dark: ["#C1C2C5", "#A6A7AB", "#909296", "#5C5F66", "#373A40", "#2C2E33", "#25262B", "#1A1B1E", "#141517", "#101113"],
  gray: ["#F8F9FA", "#F1F3F5", "#E9ECEF", "#DEE2E6", "#CED4DA", "#ADB5BD", "#868E96", "#495057", "#343A40", "#212529"],
  red: ["#FFF5F5", "#FFE3E3", "#FFC9C9", "#FFA8A8", "#FF8787", "#FF6B6B", "#FA5252", "#F03E3E", "#E03131", "#C92A2A"],
  pink: ["#FFF0F6", "#FFDEEB", "#FCC2D7", "#FAA2C1", "#F783AC", "#F06595", "#E64980", "#D6336C", "#C2255C", "#A61E4D"],
  grape: ["#F8F0FC", "#F3D9FA", "#EEBEFA", "#E599F7", "#DA77F2", "#CC5DE8", "#BE4BDB", "#AE3EC9", "#9C36B5", "#862E9C"],
  violet: ["#F3F0FF", "#E5DBFF", "#D0BFFF", "#B197FC", "#9775FA", "#845EF7", "#7950F2", "#7048E8", "#6741D9", "#5F3DC4"],
  indigo: ["#EDF2FF", "#DBE4FF", "#BAC8FF", "#91A7FF", "#748FFC", "#5C7CFA", "#4C6EF5", "#4263EB", "#3B5BDB", "#364FC7"],
  blue: ["#E7F5FF", "#D0EBFF", "#A5D8FF", "#74C0FC", "#4DABF7", "#339AF0", "#228BE6", "#1C7ED6", "#1971C2", "#1864AB"],
  cyan: ["#E3FAFC", "#C5F6FA", "#99E9F2", "#66D9E8", "#3BC9DB", "#22B8CF", "#15AABF", "#1098AD", "#0C8599", "#0B7285"],
  teal: ["#E6FCF5", "#C3FAE8", "#96F2D7", "#63E6BE", "#38D9A9", "#20C997", "#12B886", "#0CA678", "#099268", "#087F5B"],
  green: ["#EBFBEE", "#D3F9D8", "#B2F2BB", "#8CE99A", "#69DB7C", "#51CF66", "#40C057", "#37B24D", "#2F9E44", "#2B8A3E"],
  lime: ["#F4FCE3", "#E9FAC8", "#D8F5A2", "#C0EB75", "#A9E34B", "#94D82D", "#82C91E", "#74B816", "#66A80F", "#5C940D"],
  yellow: ["#FFF9DB", "#FFF3BF", "#FFEC99", "#FFE066", "#FFD43B", "#FCC419", "#FAB005", "#F59F00", "#F08C00", "#E67700"],
  orange: ["#FFF4E6", "#FFE8CC", "#FFD8A8", "#FFC078", "#FFA94D", "#FF922B", "#FD7E14", "#F76707", "#E8590C", "#D9480F"]
}

const themeOverride: MantineThemeOverride = createTheme({
  fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  primaryColor: "primary",
  primaryShade: defaultShades,
  black: "#000",
  white: "#fff",
  colors: mantineColor,
  headings: {
    fontFamily: 'var(--font-inter), Inter, sans-serif',
    sizes: {
      h1: {
        fontSize: '80px',
        lineHeight: '1.2',
        fontWeight: '600',
      },
      h2: {
        fontSize: '48px',
        lineHeight: '1.2',
        fontWeight: '600',
      },
      h3: {
        fontSize: '40px',
        lineHeight: '1.2',
        fontWeight: '600',
      },
      h4: {
        fontSize: '32px',
        lineHeight: '1.2',
        fontWeight: '600',
      },
    },
  },
  lineHeights: {
    xs: '1.4',
    sm: '1.4',
    md: '1.4',
    lg: '1.6',
    xl: '1.65',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  breakpoints: {
    xs: em(0),
    mobile: em(480),
    sm: em(576),
    md: em(768),
    lg: em(992),
    xl: em(1200),
    '2xl': em(1400),
  }
})

export const mainTheme = mergeMantineTheme(DEFAULT_THEME, themeOverride);

export const cssVariablesResolver: CSSVariablesResolver = () => {
  return {
    variables: {
      '--main-badge-2-border-color': 'var(--mantine-color-dark-2)',
    },
    light: {
      '--mantine-color-body': '#fff',
      '--text-color': '#000',
      '--mantine-color-text': '#000',
      '--mantine-color-dark-outline': '#000',
      '--mantine-color-dark-light-color': '#000',
      '--main-badge-bg': 'transparent',
      '--main-badge-color': 'var(--mantine-color-primary-6)',
      '--main-badge-border-color': 'var(--mantine-color-primary-6)',
      '--main-badge-2-color': 'var(--mantine-color-dark-7)',
    },
    dark: {
      '--mantine-color-body': '#000',
      '--text-color': '#fff',
      '--mantine-color-text': '#fff',
      '--mantine-color-dark-outline': '#fff',
      '--mantine-color-dark-light-color': '#fff', 
      '--main-badge-bg': 'linear-gradient(91.29deg, rgba(255, 255, 255, 0.16) -7.61%, rgba(255, 255, 255, 0.04) 109.66%)',
      '--main-badge-color': '#fff',
      '--main-badge-border-color': 'var(--mantine-color-dark-2)',
      '--main-badge-2-color': '#ffffffd0',
    },
  };
};

export default mainTheme

