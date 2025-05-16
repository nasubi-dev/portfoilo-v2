import { cva } from "@styled-system/css";
import { styled as p } from "@styled-system/jsx";

export const cvaContentContainer = cva({
  base: {
    px: { base: "5", md: "10" },
    py: "10",
    display: "flex",
    flexDir: "column",
    alignItems: "center",
    gap: "2",
  },
  variants: {
    widthLimit: {
      true: {
        maxW: "1300px",
        mx: "auto",
      },
      about: {
        maxW: "1000px",
        mx: "auto",
      },
    },
  },
});

export const ContentContainer = p("div", cvaContentContainer);