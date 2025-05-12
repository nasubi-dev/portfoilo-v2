import { cva } from "@styled-system/css";
import { styled as p } from "@styled-system/jsx";

export const cvaButton = cva({
  base: {
    colorPalette: "nsb.text-variant",
    py: "2",
    px: "4",
    rounded: "md",
    cursor: "pointer",
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.4,
      _hover: {
        bg: "initial",
      },
    },
    _hover: {
      bg: "colorPalette/10",
    },
  },
  variants: {
    variant: {
      light: {
        bg: "colorPalette/5",
        color: "colorPalette",
        _enabled: { _hover: { bg: "colorPalette/10" } },
      },
      filled: {
        bg: "colorPalette",
        color: "background",
        _enabled: { _hover: { bg: "colorPalette/90" } },
      },
      outlined: {
        outline: "1px solid",
        outlineColor: "colorPalette",
        color: "colorPalette",
        _enabled: { _hover: { bg: "colorPalette/5" } },
      },
      text: {
        bg: "colorPalette/5",
        color: "colorPalette",
        _enabled: { _hover: { bg: "colorPalette/10" } },
      },
      none: {
        bg: "initial",
        color: "initial",
        _enabled: { _hover: { bg: "initial" } },
      },
    },
    size: {
      sm: {
        fontSize: "sm",
        px: "2",
        py: "1",
      },
      md: {
        fontSize: "md",
      },
    },
    animateOnHover: {
      true: {
        "& svg": {
          transition: "transform 0.2s",
        },
        "_hover": {
          "& svg": {
            transform: "translateX(1px) translateY(-1px)",
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: "light",
  },
});

export const Button = p("button", cvaButton);