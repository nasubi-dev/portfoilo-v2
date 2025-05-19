import { svaDialog } from "./common/dialog";
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { css } from "@styled-system/css";
import { styled as p, VStack } from "@styled-system/jsx";
import { useEffect, useState } from "react";

function Content() {
  return (
    <Dialog.Content
      className={css(svaDialog.raw().content, {
        bg: "nsb.bg-overlay",
        color: "nsb.text",
        width: { base: "70%", sm: "50%" },
        height: "100vh",
        maxWidth: "400px",
        borderLeft: "1px solid",
        borderColor: "nsb.bg-on",
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
        boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
        margin: "0",
        padding: "0",
        pointerEvents: "auto",
        "& > *": {
          zIndex: "100",
        },
      })}
      style={{
        animation: "slideInLeft 0.1s ease-out forwards",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <VStack
        gap="2em"
        padding={{ base: "1.5em", sm: "2em" }}
        height="100%"
        justifyContent="flex-start"
        paddingTop="4em"
      >
        <VStack width="100%" gap="1em">
          <p.a
            href="/posts/"
            className={css({
              padding: "1em",
              width: "100%",
              textAlign: "center",
              fontSize: "1.5rem",
            })}
          >
            Posts
          </p.a>
          <p.a
            href="/products/"
            className={css({
              padding: "1em",
              width: "100%",
              textAlign: "center",
              fontSize: "1.5rem",
            })}
          >
            Products
          </p.a>
          <p.a
            href="/about/"
            className={css({
              padding: "1em",
              width: "100%",
              textAlign: "center",
              fontSize: "1.5rem",
            })}
          >
            About
          </p.a>
        </VStack>
      </VStack>
    </Dialog.Content>
  );
}

export function MenuModal() {
  const [isOpen, setIsOpen] = useState(false);

  // メニューボタンにイベントリスナーを追加
  useEffect(() => {
    const handleMenuButtonClick = () => {
      setIsOpen((prev) => !prev);
    };

    // メニューボタンを取得
    const menuButton = document.getElementById("menu-button");

    // イベントリスナーを追加
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    // クリーンアップ関数
    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <Portal>
        <Dialog.Backdrop
          className={css({
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            zIndex: 50,
            backdropFilter: "blur(2px)",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.3s ease",
          })}
        />
        <Dialog.Positioner
          className={css({
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "stretch",
            pointerEvents: "none",
            overflow: "hidden",
          })}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Content />
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
