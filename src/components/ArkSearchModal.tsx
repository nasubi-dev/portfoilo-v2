import { svaDialog } from "./common/dialog";
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { css } from "@styled-system/css";
import { HStack, styled as p, VStack } from "@styled-system/jsx";
import { useEffect, useState } from "react";


function Content({ onClose }: { onClose: () => void }) {
  const handleContentClick = (e: React.MouseEvent) => {
    // Dialog.Content自体がクリックされた場合のみ閉じる
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Dialog.Content
      className={css(svaDialog.raw().content, {
        position: "fixed",
        inset: "0",
        zIndex: "100",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pt: "20",
        "& > *": {
          zIndex: "100",
        },
      })}
      onClick={handleContentClick}
    >
      <VStack
        bg={"nsb.bg-overlay"}
        color="nsb.text"
        gap="2em"
        padding="2em"
        rounded={"md"}
        width={{ base: "90%", sm: "50%" }}
        maxWidth="600px"
        boxShadow="md"
      >
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

  // ESCキーでモーダルを閉じる
  const handleOpenChange = (details: { open: boolean }) => {
    setIsOpen(details.open);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Portal>
        <Dialog.Backdrop className={css(svaDialog.raw().backdrop)} />
        <Dialog.Positioner>
          <Content onClose={() => setIsOpen(false)} />
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
