// @ts-check
import { defineConfig } from "astro/config";
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

    visit(tree, "link", (node) => {
      const url = node.url;

      // リンクのテキスト（タイトル）を取得
      const linkTitle =
        node.children && node.children[0] && node.children[0].value
          ? node.children[0].value
          : "";

      // YouTube
      if (
        url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
      ) {
        const youtubeId = url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
        )[1];
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
      }

      // Twitter
      // else if (url.match(/twitter\.com\/.*\/status\/(\d+)/)) {
      //   const tweetId = url.match(/twitter\.com\/.*\/status\/(\d+)/)[1];
      //   node.type = "html";
      //   node.value = `<div class="tweet-embed" data-tweet-id="${tweetId}">
      //     <blockquote class="twitter-tweet" data-dnt="true">
      //       <a href="${url}" title="${
      //     linkTitle || "Tweet"
      //   }">Loading Tweet...</a>
      //     </blockquote>
      //     <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      //   </div>`;
      // }

      // Zenn, Qiita, その他のリンク（OGP取得）
      else if (url.startsWith("http")) {
        const promise = (async () => {
          let ogpData;

          if (cache.has(url)) {
            ogpData = cache.get(url);
          } else {
            ogpData = await fetchOGP(url);
            cache.set(url, ogpData);
          }

          const title = ogpData.title || node.children[0]?.value || url;
          const description = ogpData.description || "";
          const site = ogpData.site_name;
          const imageHtml = ogpData.image
            ? `<div class="link-card-image"><img src="${ogpData.image}" alt="${title}" loading="lazy" /></div>`
            : "";

          // 内部リンクかどうかを判定
          const isInternal = url.includes("nasubi.dev");

          // Zenn, Qiitaなど特定サイトに対するクラス名
          let siteClass = "external";
          if (url.includes("zenn.dev")) siteClass = "zenn";
          else if (url.includes("qiita.com")) siteClass = "qiita";
          else if (isInternal) siteClass = "internal";

          node.type = "html";
          node.value = `<div class="link-card ${siteClass}">
            <a href="${url}" ${!isInternal ? 'target="_blank"' : ""}>
              ${imageHtml}
              <div class="link-card-content">
                <h4>${title}</h4>
                ${
                  description
                    ? `<p>${description.substring(0, 100)}${
                        description.length > 100 ? "..." : ""
                      }</p>`
                    : ""
                }
                <span class="link-card-site">${site}</span>
              </div>
            </a>
          </div>`;
        })();

        promises.push(promise);
      }
    });

    // すべての非同期処理を待機
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
  integrations: [sitemap()],
  image: {
    domains: ["content.nasubi.dev"],
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
