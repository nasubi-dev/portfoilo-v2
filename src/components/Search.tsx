import { useEffect, useRef } from "react";

export default function Search() {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ui: any;

    const initializePagefind = async () => {
      try {
        // PagefindUIを動的にインポート
        const { PagefindUI } = await import("@pagefind/default-ui");

        if (searchRef.current) {
          ui = new PagefindUI({
            element: searchRef.current,
          });
        }
      } catch (error) {
        console.error("Failed to load PagefindUI:", error);
      }
    };

    initializePagefind();

    // クリーンアップ
    return () => {
      if (ui && typeof ui.destroy === "function") {
        ui.destroy();
      }
    };
  }, []);

  return <div ref={searchRef} />;
}
