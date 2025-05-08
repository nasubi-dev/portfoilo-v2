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
  // globalFontface: {
  //   "Noto Sans JP": [
  //     {
  //       fontStyle: "normal",
  //       fontWeight: "400",
  //       src: "url('/fonts/NotoSansJP-Regular.woff2') format('woff2')",
  //     },
  //     {
  //       fontStyle: "normal",
  //       fontWeight: "700",
  //       src: "url('/fonts/NotoSansJP-Bold.woff2') format('woff2')",
  //     },
  //   ],
  //   twemoji: {
  //     fontStyle: "normal",
  //     fontWeight: "400",
  //     src: "url('/fonts/TwitterColorEmoji-SVGinOT.ttf') format('truetype')",
  //   },
  // },
  // globalVars: {
  //   "--font-noto-sans-jp": " twemoji, 'Noto Sans JP', sans-serif",
  // },
  // globalCss: {
  //   "html, body": {
  //     // color: "wkb.text",
  //     // bg: "wkb.bg",
  //     fontFeatureSettings: "'plat'",
  //     fontFamily: "var(--font-noto-sans-jp)",
  //     scrollBehavior: "smooth",
  //     scrollPaddingTop: "120px",
  //   },
  // },

  // dark mode settings
  // conditions: {
  //   dark: ".dark &",
  // },

  // Useful for theme customization
  theme: {
    extend: {
      // tokens: {
      //   fonts: {
      //     sans: {
      //       value: "var(--font-noto-sans-jp), sans-serif",
      //     },
      //   },
      //   colors: {
      //     "nsb-neutral": {
      //       0: { value: "#FFFFFF" },
      //       100: { value: "#F7F7F7" },
      //       300: { value: "#757575" },
      //       700: { value: "#2C2C2C" },
      //       900: { value: "#1E1E1E" },
      //     },
      //     "nsb-purple": { value: "#FF3D00" },
      //     "nsb-green": { value: "#00A3FF" },
      //     // "external-link": {
      //     //   "zenn": { value: "#00A3FF" },
      //     //   "qiita": { value: "#55C500" },
      //     //   "github": { value: "#000000" },
      //     //   "twitter": { value: "#1DA1F2" },
      //     // }
      //   },
      // },
      // semanticTokens: {
      //   colors: {
      //     "nsb.primary": { value: "{colors.nsb-purple}" },
      //     "nsb.secondary": { value: "{colors.nsb-green}" },
      //     "nsb.text": { value: "{colors.nsb-neutral.700}" },
      //     "nsb.text-variant": { value: "{colors.nsb-neutral.300}" },
      //     "nsb.bg-overlay": { value: "{colors.nsb-neutral.0}" },
      //     "nsb.bg-on": { value: "{colors.nsb-neutral.100}" },
      //   },
      // },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",

  // jsxFramework: "react",
});
