import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    "./src/**/*.{js,jsx,ts,tsx,astro}",
    "./pages/**/*.{js,jsx,ts,tsx,astro}",
  ],

  // Files to exclude
  exclude: [],

  // Global CSS settings
  globalFontface: {
    "Noto Sans JP": [
      {
        fontStyle: "normal",
        fontWeight: "400",
        src: "url('/fonts/NotoSansJP-Regular.woff2') format('woff2')",
      },
      {
        fontStyle: "normal",
        fontWeight: "700",
        src: "url('/fonts/NotoSansJP-Bold.woff2') format('woff2')",
      },
    ],
    twemoji: {
      fontStyle: "normal",
      fontWeight: "400",
      src: "url('/fonts/TwitterColorEmoji-SVGinOT.ttf') format('truetype')",
    },
    "UDEV Gothic NF": {
      fontStyle: "normal",
      fontWeight: "400",
      src: "url('/fonts/UDEVGothicNF-Regular.ttf') format('truetype')",
    },
  },
  globalVars: {
    "--noto-sans-jp": " twemoji, 'Noto Sans JP', sans-serif",
    "--udev-gothic-nf": "'UDEV Gothic NF', monospace",
  },
  globalCss: {
    "html, body": {
      color: "nsb.text",
      bg: "nsb.bg-overlay",
      fontFeatureSettings: "'plat'",
      fontFamily: "var(--noto-sans-jp)",
      scrollBehavior: "smooth",
    },
    "h1, h2, h3, h4, h5, h6": {
      fontWeight: "bold",
    },
    h1: {
      fontSize: "4xl",
    },
    h2: {
      fontSize: "3xl",
    },
    h3: {
      fontSize: "2xl",
    },
    h4: {
      fontSize: "xl",
    },
    h5: {
      fontSize: "lg",
    },
    h6: {
      fontSize: "md",
    },
    p: {
      fontSize: "1.1rem",
      lineHeight: "2.2rem",
    },
    kbd: {
      fontFamily: "var(--udev-gothic-nf)",
      bg: "nsb.bg-on",
      borderRadius: "sm",
      px: "2",
      py: "0.5",
    },
    code: {
      fontFamily: "var(--udev-gothic-nf)",
      bg: "nsb.bg-on",
      borderRadius: "sm",
      px: "2",
      py: "0.5",
    },
    "pre code": {
      bg: "none",
      px: "0",
    },
    pre: {
      width: "100%",
      minWidth: "500px",
      borderRadius: "md",
      px: "5",
      py: "5",
    },
    table: {
      width: "100%",
      minWidth: "500px",
      borderSpacing: "0",
      borderRadius: "md",
    },
    thead: {
      textAlign: "center",
    },
    "th, td": {
      border: "1px solid #eaeaea",
      padding: "1rem",
      fontSize: "1.1rem",
      lineHeight: "2.2rem",
    },
    th: {
      fontWeight: "bold",
      bg: "nsb.bg-on",
      color: "nsb.text",
      fontSize: "1.2rem",
      lineHeight: "2.4rem",
    },
    "ul, ol": {
      paddingLeft: "1.5rem",
      marginY: "1rem",
      fontSize: "1.1rem",
      lineHeight: "1.3rem",
    },
    ul: {
      listStyleType: "disc",
    },
    "ul ul": {
      listStyleType: "circle",
      marginY: "0.5rem",
    },
    "ul ul ul": {
      listStyleType: "square",
      marginY: "0.5rem",
    },
    ol: {
      listStyleType: "decimal",
    },
    "ol ol": {
      listStyleType: "lower-alpha",
      marginY: "0.5rem",
    },
    "ol ol ol": {
      listStyleType: "lower-roman",
      marginY: "0.5rem",
    },
    li: {
      marginY: "0.5rem",
    },
    "li > ul, li > ol": {
      marginY: "0.5rem",
    },
    "ul.contains-task-list": {
      listStyleType: "none",
      paddingLeft: "0",
    },
    ".heading-wrapper": {
      display: "flex",
      alignItems: "center",
      marginTop: "30px",
    },
    ".anchor-icon": {
      marginLeft: "8px",
    },
    ".link-card": {
      margin: "1.5rem 0",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
      overflow: "hidden",
      width: "fit-content",
      height: "auto",
      minWidth: "300px",
      maxWidth: "1000px",
      maxHeight: "250px",
      display: "flex",
      flexDirection: "row",
      transition: "background-color 0.1s ease",
    },
    ".link-card:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    ".link-card-grid .link-card-grid-container": {
      display: "flex",
      flexDirection: "row",
      gap: "0.5rem",
      overflow: "hidden",
    },
    ".link-card-grid .link-card-image-container img": {
      width: "100%",
      height: "250px",
      objectFit: "cover",
    },
    ".youtube-embed iframe": {
      width: "100%",
      height: "100%",
      aspectRatio: "16 / 9",
      minWidth: "300px",
      maxWidth: "800px",
    },
    ".spotify-embed iframe": {
      width: "100%",
      height: "100%",
      aspectRatio: "1 / 1",
      minWidth: "300px",
      maxWidth: "800px",
    },
    ".link-card-grid .no-image": {
      backgroundColor: "#f0f0f0",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    ".link-card-content": {
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      flex: "1",
    },
    ".link-card-content h4": {
      margin: "0 0 0.5rem",
      fontSize: "1.1rem",
    },
    ".link-card-site": {
      display: "block",
      fontSize: "0.8rem",
      color: "#999",
    },
  },

  // dark mode settings
  conditions: {
    dark: ".dark &",
  },

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        fonts: {
          sans: {
            value: "var(--noto-sans-jp), sans-serif",
          },
          mono: {
            value: "monospace",
          },
        },
        colors: {
          "nsb-neutral": {
            0: { value: "#F9F2F2" },
            100: { value: "#E2DCDC" },
            300: { value: "#757575" },
            700: { value: "#2C2C2C" },
            900: { value: "#1E1E1E" },
          },
          "nsb-purple": { value: "#fb33ff" },
          "nsb-green": { value: "#7deda0" },
          // "external-link": {
          //   "zenn": { value: "#00A3FF" },
          //   "qiita": { value: "#55C500" },
          //   "github": { value: "#000000" },
          //   "twitter": { value: "#1DA1F2" },
          // }
        },
      },
      semanticTokens: {
        colors: {
          "nsb.primary": { value: "{colors.nsb-purple}" },
          "nsb.secondary": { value: "{colors.nsb-green}" },
          "nsb.text": { value: "{colors.nsb-neutral.700}" },
          "nsb.text-variant": { value: "{colors.nsb-neutral.300}" },
          "nsb.bg-overlay": { value: "{colors.nsb-neutral.0}" },
          "nsb.bg-on": { value: "{colors.nsb-neutral.100}" },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",

  jsxFramework: "react",
});
