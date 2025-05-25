import { qrCodeAnatomy } from "@ark-ui/react/qr-code";
import { sva } from "@styled-system/css";

export const svaQrCode = sva({
  className: "qr-code",
  slots: qrCodeAnatomy.keys(),
  base: {
    root: {
      display: "inline-block",
      width: "200px",
      height: "200px",
      position: "relative",
    },
    frame: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    },
    pattern: {
      width: "100%",
      height: "100%",
      display: "block",
    },
    overlay: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgColor: "white",
      padding: "8px",
      borderRadius: "full",
      width: "48px",
      height: "48px",
    },
    downloadTrigger: {
      position: "absolute",
      bottom: "8px",
      right: "8px",
      backgroundColor: "white",
      borderRadius: "full",
      padding: "2px",
      boxShadow: "md",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "gray.100",
      },
    },
  },
});
