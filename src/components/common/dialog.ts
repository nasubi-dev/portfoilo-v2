import { dialogAnatomy } from "@ark-ui/react/dialog";
import { sva } from "@styled-system/css";

export const svaDialog = sva({
  className: "dialog",
  slots: dialogAnatomy.keys(),
  base: {
    content: {
      position: "fixed",
      inset: "0",
      zIndex: "100",
    },
  },
});
