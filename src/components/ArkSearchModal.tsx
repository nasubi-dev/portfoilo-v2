import { svaDialog } from "./common/dialog";
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { css } from "@styled-system/css";
import { HStack, styled as p, VStack } from "@styled-system/jsx";
import { useEffect, useState } from "react";

function Content() {
  return (
    <Dialog.Content
      className={css(svaDialog.raw().content, {
        bg: "nsb.bg-overlay",
        color: "nsb.text",
        "& > *": {
          zIndex: "100",
        },
      })}
    >
      <VStack>
        <Dialog.CloseTrigger>close</Dialog.CloseTrigger>
        <Dialog.Title>Search</Dialog.Title>
        <Dialog.Description>Search for something</Dialog.Description>
      </VStack>
    </Dialog.Content>
  );
}

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);

  // ボタンにイベントリスナーを追加
  useEffect(() => {
    const handleSearchButtonClick = () => {
      setIsOpen((prev) => !prev);
    };

    // デスクトップとモバイルの両方のボタンを取得
    const searchButton = document.getElementById("search-button");
    const searchButtonMobile = document.getElementById("search-button-mobile");

    // イベントリスナーを追加
    if (searchButton) {
      searchButton.addEventListener("click", handleSearchButtonClick);
    }
    if (searchButtonMobile) {
      searchButtonMobile.addEventListener("click", handleSearchButtonClick);
    }

    // クリーンアップ関数
    return () => {
      if (searchButton) {
        searchButton.removeEventListener("click", handleSearchButtonClick);
      }
      if (searchButtonMobile) {
        searchButtonMobile.removeEventListener(
          "click",
          handleSearchButtonClick
        );
      }
    };
  }, []);

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Content />
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
