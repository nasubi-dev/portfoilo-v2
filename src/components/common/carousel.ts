import { carouselAnatomy } from "@ark-ui/react/carousel";
import { sva } from "@styled-system/css";

export const svaCarousel = sva({
  className: "carousel",
  slots: carouselAnatomy.keys(),
  base: {
    root: {
      position: "relative",
      width: "100%",
      aspectRatio: "16/9",
      overflowX: "hidden",
    },
    itemGroup: {
      display: "flex",
      width: "100%",
      height: "100%",
      overflowX: "hidden",
    },
    item: {
      width: "100%",
      height: "100%",
      flexShrink: 0,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflowX: "hidden",
      "& img": {
        maxWidth: "100%",
        maxHeight: "100%",
        width: "auto",
        height: "auto",
        objectFit: "contain",
      },
    },
    control: {},
    nextTrigger: {
      zIndex: "10",
      position: "absolute",
      transform: "translateY(-50%)",
      top: "50%",
      right: "8px",
      paddingY: "48",
      paddingLeft: "16",
    },
    prevTrigger: {
      zIndex: "10",
      position: "absolute",
      transform: "translateY(-50%)",
      top: "50%",
      left: "8px",
      paddingY: "48",
      paddingRight: "16",
    },
    indicatorGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "2",
      position: "absolute",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "10",
    },
    indicator: {
      width: "10px",
      height: "10px",
      borderRadius: "full",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      cursor: "pointer",
      transition: "background-color 0.2s",
      _hover: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      },
      _current: {
        backgroundColor: "nsb.primary",
      },
    },
  },
});
