import { theme, DefaultTheme } from '@chakra-ui/core'

const customTheme: DefaultTheme = {
  ...theme,
  fonts: {
    body: 'Roboto, system-ui, sans-serif',
    heading: 'Roboto, system-ui, sans-serif',
    mono: 'Menlo, monospace'
  },
  fontWeights: {
    ...theme.fontWeights,
    normal: 400,
    medium: 600,
    bold: 700,
  },
  radii: {
    ...theme.radii,
    sm: '5px',
    md: '8px',
  },
  colors: {
    ...theme.colors,
    purple: {
      ...theme.colors.purple,
      500: '#3C1691',
    },
    gray: {
      ...theme.colors.gray,
      300: '#e1e1e6',
      600: '#29292e',
      700: '#1A1C1D',
      800: '#121214'
    },
  },
}

export default customTheme;