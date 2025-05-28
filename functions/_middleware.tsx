import React from "react";
import vercelOGPagesPlugin from "@cloudflare/pages-plugin-vercel-og";

interface Props {
  title: string;
}

export const onRequest = vercelOGPagesPlugin<Props>({
  imagePathSuffix: "/og-image.png",
  component: ({ title }) => {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          border: "8px solid #fb33ff", // nsb.primary色
          position: "relative",
          padding: "40px",
        }}
      >
        {/* メインタイトル（左上） */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "60px",
            fontSize: "64px",
            fontWeight: "bold",
            color: "#1a1a1a",
          }}
        >
          {title || "nasubi.dev"}
        </div>
        
        {/* アイコンとユーザー名（左下） */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "60px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <img
            src="https://nasubi.dev/nasubi.webp"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
            }}
            alt="nasubi icon"
          />
          <span
            style={{
              fontSize: "24px",
              color: "#666",
            }}
          >
            @nasubi_dev
          </span>
        </div>
      </div>
    );
  },
  extractors: {
    on: {
      'meta[property="og:title"]': (props) => ({
        element(element) {
          props.title = element.getAttribute("content") || "";
        },
      }),
      'title': (props) => ({
        element(element) {
          if (!props.title) {
            props.title = element.textContent || "";
          }
        },
      }),
    },
  },
  options: {
    width: 1200,
    height: 630,
  },
  autoInject: {
    openGraph: true,
  },
});
