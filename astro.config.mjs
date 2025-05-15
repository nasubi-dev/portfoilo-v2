// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { visit } from "unist-util-visit";

// OGP情報を取得するヘルパー関数
async function fetchOGP(url) {
  try {
    const response = await fetch(url, { timeout: 5000 });
    const html = await response.text();

    // DOMParserの代わりに正規表現でメタタグを抽出
    const getMetaContent = (html, property) => {
      const regex = new RegExp(
        `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
        "i"
      );
      const match = html.match(regex);
      return match ? match[1] : "";
    };

    const getTitleTag = (html) => {
      const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
      return match ? match[1] : "";
    };

    return {
      title: getMetaContent(html, "og:title") || getTitleTag(html) || "",
      description:
        getMetaContent(html, "og:description") ||
        getMetaContent(html, "description") ||
        "",
      image: getMetaContent(html, "og:image") || "",
      site_name: getMetaContent(html, "og:site_name") || new URL(url).hostname,
    };
  } catch (error) {
    console.warn(`Failed to fetch OGP for ${url}:`, error.message);
    return {
      title: "",
      description: "",
      image: "",
      site_name: new URL(url).hostname,
    };
  }
}

// 埋め込みリンク変換プラグイン
function remarkEmbedLinks() {
  const cache = new Map();

  return async (tree) => {
    const promises = [];

    // @ts-ignore
    visit(tree, "link", (node) => {
      const url = node.url;

      // リンクのテキスト（タイトル）を取得
      const linkTitle =
        node.children && node.children[0] && node.children[0].value
          ? node.children[0].value
          : "";

      // URLのタイプを判定
      let urlType = "other";
      const youtubeMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
      );

      if (youtubeMatch) {
        urlType = "youtube";
      } else if (!url.startsWith("http")) {
        // HTTPで始まらないリンクはスキップ
        return;
      } else if (url.includes("spotify.com")) {
        urlType = "spotify";
      } else if (url.includes("zenn.dev")) {
        urlType = "zenn";
      } else if (url.includes("qiita.com")) {
        urlType = "qiita";
      } else if (url.includes("github.com")) {
        urlType = "github";
      } else if (url.includes("note.com")) {
        urlType = "note";
      } else if (url.includes("soundcloud.com")) {
        urlType = "soundcloud";
      } else if (url.includes("nasubi.dev")) {
        urlType = "internal";
      }

      switch (urlType) {
        case "youtube": {
          // YouTubeの動画
          const youtubeId = youtubeMatch[1];
          node.type = "html";
          node.value = `<div class="youtube-embed">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/${youtubeId}"
              title="${linkTitle || "YouTube video"}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>`;
          break;
        }
        case "spotify": {
          // Spotifyの埋め込み
          const promise = (async () => {
            let ogpData;
            if (cache.has(url)) {
              ogpData = cache.get(url);
            } else {
              ogpData = await fetchOGP(url);
              cache.set(url, ogpData);
            }
            const title = ogpData.title || node.children[0]?.value || url;
            node.type = "html";
            node.value = `<div class="spotify-embed">
              <iframe
                src="${url.replace("open.spotify.com", "embed.spotify.com")}"
                width="300"
                height="380"
                frameborder="0"
                allowtransparency="true"
                allow="encrypted-media"
                title="${title || "Spotify Embed"}">
              </iframe>
            </div>`;
          })();
          promises.push(promise);
          break;
        }

        case "zenn":
        case "qiita":
        case "github":
        case "note":
        case "soundcloud":
        case "internal":
        case "other": {
          // その他のリンク（OGP取得）
          const promise = (async () => {
            let ogpData;
            if (cache.has(url)) {
              ogpData = cache.get(url);
            } else {
              ogpData = await fetchOGP(url);
              cache.set(url, ogpData);
            }

            const title = ogpData.title || node.children[0]?.value || url;
            const site = ogpData.site_name;
            const imageHtml = ogpData.image
              ? `<div class="link-card-image"><img src="${ogpData.image}" alt="${title}" loading="lazy" /></div>`
              : "";

            // 内部リンクかどうかを判定
            const isInternal = urlType === "internal";
            // サイトクラス名
            const siteClass = urlType !== "other" ? urlType : "external";

            node.type = "html";

            // Zenn, Qiita、または画像のあるカードの場合はグリッドレイアウトを使用
            if (urlType === "zenn" || urlType === "qiita" || ogpData.image) {
              // 画像がある場合のみ、比率判定用のクラスを追加
              const imageRatioClass = ogpData.image
                ? "link-card-with-image"
                : "";

              node.value = `<div class="link-card ${siteClass} link-card-grid ${imageRatioClass}">
                <a href="${url}" target="_blank">
                  <div class="link-card-grid-container">
                    <div class="link-card-image-container">
                      ${
                        ogpData.image
                          ? `<img src="${ogpData.image}" alt="${title}" loading="lazy" onload="this.naturalWidth > this.naturalHeight * 1.2 ? this.parentNode.parentNode.classList.add('wide-image') : ''" />`
                          : `<div class="no-image"></div>`
                      }
                    </div>
                    <div class="link-card-content">
                      <h4>${title}</h4>
                      <span class="link-card-site">${site}</span>
                    </div>
                  </div>
                </a>
              </div>`;
            } else {
              // 他のサイトは通常のレイアウト
              node.value = `<div class="link-card ${siteClass}">
                <a href="${url}" ${!isInternal ? 'target="_blank"' : ""}>
                  ${imageHtml}
                  <div class="link-card-content">
                    <h4>${title}</h4>
                    <span class="link-card-site">${site}</span>
                  </div>
                </a>
              </div>`;
            }
          })();
          promises.push(promise);
          break;
        }
      }
    })();

    await Promise.all(promises);
  };
}

// WikiLinks形式の処理プラグイン
function remarkWikiLinks() {
  // 画像/動画用: ![[xxx.webp]] - グループ1がパス
  const mediaWikiLinkRegex = /!\[\[(.*?)(?:\|(.*?))?\]\]/g;

  // 内部リンク用: [[xxx]] - グループ1がパス
  const internalWikiLinkRegex = /(?<!!)\[\[(.*?)(?:\|(.*?))?\]\]/g;

  return (tree) => {
    // メディア（画像・動画）を処理
    visit(tree, "text", (node, index, parent) => {
      if (!node.value.includes("![[")) return;

      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = mediaWikiLinkRegex.exec(node.value)) !== null) {
        // マッチ前のテキスト
        if (match.index > lastIndex) {
          parts.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        // パスとテキストを抽出 - '!'は含まない
        const [fullMatch, path, text] = match;
        const displayText = text || path;

        // パス処理の改善: assets/で始まる場合もそうでない場合も処理
        let r2Url = path;

        // assets/で始まる場合はそのまま
        if (path.startsWith("assets/")) {
          r2Url = `https://content.nasubi.dev/${path}`;
        }
        // 拡張子があり、assetsで始まらない場合はassets/を前に追加
        else if (
          path.match(/\.(jpe?g|png|gif|webp|avif|svg|mp4|webm|mov)$/i) &&
          !path.includes("/")
        ) {
          r2Url = `https://content.nasubi.dev/assets/${path}`;
        }
        // それ以外の場合（既に完全なURLの場合など）はそのまま

        if (path.match(/\.(mp4|webm|mov)$/i)) {
          // 動画
          parts.push({
            type: "html",
            value: `<video src="${r2Url}" controls width="100%" alt="${displayText}"></video>`,
          });
        } else {
          // 画像 - 直接HTMLとして出力 ASTノードが悪さをする(原因不明)
          parts.push({
            type: "html",
            value: `<img src="${r2Url}" alt="${displayText}" loading="lazy" />`,
          });
        }

        lastIndex = match.index + fullMatch.length;
      }

      // 残りのテキスト
      if (lastIndex < node.value.length) {
        parts.push({ type: "text", value: node.value.slice(lastIndex) });
      }

      // 元のノードを置き換え
      if (parts.length > 0) {
        parent.children.splice(index, 1, ...parts);
        return (index ?? 0) + parts.length;
      }
    });

    // 内部リンクを処理
    visit(tree, "text", (node, index, parent) => {
      if (!node.value.includes("[[") || node.value.includes("![[")) return;

      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = internalWikiLinkRegex.exec(node.value)) !== null) {
        // マッチ前のテキスト
        if (match.index > lastIndex) {
          parts.push({
            type: "text",
            value: node.value.slice(lastIndex, match.index),
          });
        }

        // パスとテキストを抽出
        const [, path, text] = match;
        const displayText = text || path;

        // 内部リンク
        parts.push({
          type: "link",
          url: path,
          children: [{ type: "text", value: displayText }],
        });

        lastIndex = match.index + match[0].length;
      }

      // 残りのテキスト
      if (lastIndex < node.value.length) {
        parts.push({ type: "text", value: node.value.slice(lastIndex) });
      }

      // 元のノードを置き換え
      if (parts.length > 0) {
        parent.children.splice(index, 1, ...parts);
        return index + parts.length;
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://nasubi.dev",
  prefetch: true,
  integrations: [react(), sitemap()],
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "content.nasubi.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
  markdown: {
    shikiConfig: {
      theme: "houston",
      wrap: true,
    },
    remarkPlugins: [remarkEmbedLinks, remarkWikiLinks],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "after",
          content: {
            type: "element",
            tagName: "span",
            properties: { className: ["anchor-icon"] },
            children: [{ type: "text", value: "🔗" }],
          },
          group: {
            type: "element",
            tagName: "div",
            properties: { className: ["heading-wrapper"] },
            children: [],
          },
        },
      ],
    ],
  },
});
