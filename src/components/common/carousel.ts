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
      overflow: "hidden",
    },
    itemGroup: {
      display: "flex",
      width: "100%",
      height: "100%",
    },
    item: {
      width: "100%",
      height: "100%",
      flexShrink: 0,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    control: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: "10",
      width: "40px",
      height: "40px",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      color: "white",
      borderRadius: "full",
      cursor: "pointer",
      transition: "opacity 0.2s",
      _hover: {
        opacity: 0.8,
      },
    },
    nextTrigger: {
      right: "16px",
    },
    prevTrigger: {
      left: "16px",
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
        backgroundColor: "white",
      },
    },
  },
});