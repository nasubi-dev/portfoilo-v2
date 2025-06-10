import React from "react";
import vercelOGPagesPlugin from "@cloudflare/pages-plugin-vercel-og";

interface Props {
  ogTitle: string;
}

export const onRequest = vercelOGPagesPlugin<Props>({
  imagePathSuffix: "/social-image.png",
  component: ({ ogTitle }) => {
    return React.createElement("div", {}, ogTitle);
  },
  extractors: {
    on: {
      'meta[property="og:title"]': (props) => ({
        element(element: any) {
          props.ogTitle = element.getAttribute("content");
        },
      }),
    },
  },
  autoInject: {
    openGraph: true,
  },
});
