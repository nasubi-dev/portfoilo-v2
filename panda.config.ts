import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx,astro}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          accent: { value: "#2337ff" },
          accentDark: { value: "#000d8a" },
          black: { value: "rgb(15, 18, 25)" },
          gray: { value: "rgb(96, 115, 159)" },
          grayLight: { value: "rgb(229, 233, 240)" },
          grayDark: { value: "rgb(34, 41, 57)" },
        },
        shadows: {
          box: {
            value:
              "0 2px 6px rgba(96, 115, 159, 25%), 0 8px 24px rgba(96, 115, 159, 33%), 0 16px 32px rgba(96, 115, 159, 33%)",
          },
        },
      },
      semanticTokens: {
        colors: {
          accent: { value: "{colors.accent}" },
          accentDark: { value: "{colors.accentDark}" },
          black: { value: "{colors.black}" },
          gray: { value: "{colors.gray}" },
          grayLight: { value: "{colors.grayLight}" },
          grayDark: { value: "{colors.grayDark}" },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",

  // パターンを使用可能にする
  patterns: {
    extend: {
      flex: {
        description: "Flex layout utilities",
        properties: {
          direction: { type: "property", value: "flexDirection" },
          align: { type: "property", value: "alignItems" },
          justify: { type: "property", value: "justifyContent" },
          wrap: { type: "property", value: "flexWrap" },
          gap: { type: "property", value: "gap" },
        },
      },
    },
  },

  // Astro用の設定
  jsxFramework: "react",
});
