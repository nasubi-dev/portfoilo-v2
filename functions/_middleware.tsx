import React from "react";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";

declare global {
  interface PagesFunction<
    Env = any,
    Params extends string = any,
    Data extends Record<string, unknown> = Record<string, unknown>,
  > {
    (context: EventContext<Env, Params, Data>): Response | Promise<Response>;
  }

  interface EventContext<
    Env = any,
    Params extends string = any,
    Data extends Record<string, unknown> = Record<string, unknown>,
  > {
    request: Request;
    env: Env;
    params: Params;
    data: Data;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    waitUntil: (promise: Promise<any>) => void;
  }
}

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // OG画像のパスかどうかをチェック
  if (url.pathname.endsWith("/og-image.png")) {
    // 元のページURLからタイトルを取得するため、HTMLを取得
    const originalPath = url.pathname.replace("/og-image.png", "");
    const originalUrl = new URL(originalPath, url.origin);

    let title = "nasubi.dev";

    try {
      const response = await fetch(originalUrl.toString());
      if (response.ok) {
        const html = await response.text();

        // og:titleまたはtitleタグからタイトルを抽出
        const ogTitleMatch = html.match(
          /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i
        );
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

        if (ogTitleMatch) {
          title = ogTitleMatch[1];
        } else if (titleMatch) {
          title = titleMatch[1];
        }
      }
    } catch (error) {
      console.error("Failed to fetch page for title extraction:", error);
    }

    return new ImageResponse(
      (
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
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // OG画像のリクエストでない場合は、次のミドルウェアに進む
  return context.next();
};
