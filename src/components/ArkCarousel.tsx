import { Carousel } from "@ark-ui/react/carousel";
import { useEffect, useState } from "react";
import { R2_BUCKET } from "@/consts";
import { svaCarousel } from "./common/carousel";
import { css } from "@styled-system/css";
import cleanAssetPath from "@/utils/cleanAssetPath";
import ArrowForward from "../../public/MaterialSymbolsArrowForwardIos.svg";
import ArrowBack from "../../public/MaterialSymbolsArrowBackIos.svg";

type ArkCarouselProps = {
  assets: string[];
  thumbnail: string;
};

export const ArkCarousel = ({ assets, thumbnail }: ArkCarouselProps) => {
  const [page, setPage] = useState(0);
  const styles = svaCarousel.raw();

  // thumbnailを先頭に追加したassetsを作成
  const replaceAssets = [cleanAssetPath(thumbnail)].concat(
    assets.map((asset) => {
      if (asset.startsWith("![")) {
        return cleanAssetPath(asset);
      }
      return asset;
    })
  );

  // 3000msごとに画像を切り替える
  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prevPage) => (prevPage + 1) % replaceAssets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [replaceAssets.length]);

  return (
    <Carousel.Root
      className={css(styles.root)}
      slideCount={replaceAssets.length}
      page={page}
      onPageChange={(details) => setPage(details.page)}
      loop
    >
      <Carousel.Control className={css(styles.control)}>
        <Carousel.PrevTrigger className={css(styles.prevTrigger)}>
          <ArrowBack />
        </Carousel.PrevTrigger>
        <Carousel.NextTrigger className={css(styles.nextTrigger)}>
          <ArrowForward />
        </Carousel.NextTrigger>
      </Carousel.Control>
      <Carousel.IndicatorGroup className={css(styles.indicatorGroup)}>
        {replaceAssets.map((_, index) => (
          <Carousel.Indicator
            key={index}
            index={index}
            className={css(styles.indicator)}
          />
        ))}
      </Carousel.IndicatorGroup>
      <Carousel.ItemGroup className={css(styles.itemGroup)}>
        {replaceAssets.map((asset, index) => (
          <Carousel.Item key={index} index={index} className={css(styles.item)}>
            {asset.endsWith(".webp") ||
            asset.endsWith(".jpeg") ||
            asset.endsWith(".png") ? (
              <img
                src={`${R2_BUCKET}/${asset}`}
                alt={`Slide ${index}: ${replaceAssets}`}
                loading="lazy"
              />
            ) : (
              <video
                src={`${R2_BUCKET}/${asset}`}
                autoPlay
                loop
                muted
                playsInline
              />
            )}
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>
    </Carousel.Root>
  );
};
