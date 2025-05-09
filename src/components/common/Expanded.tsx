import { cva } from "@styled-system/css"
import { styled as p } from "@styled-system/jsx"

export const cvaExpanded = cva({
  base: {
    w: "100%",
    h: "100%",
  },
  variants: {
    basedOn: {
      container: {
        w: "100%",
        h: "100%",
      },
      restOfHeader: {
        h: { base: "calc(100vh - 4rem)", lg: "calc(100vh - 5rem)" },
      },
      screen: {
        h: ["100dvh", "100vh"],
      },
    },
    items: {
      center: {
        display: "grid",
        placeItems: "center",
        alignItems: "center",
      },
    },
  },
});

export const Expanded = p("div", cvaExpanded);