import { Carousel } from "@ark-ui/react/carousel";
import { useState } from "react";
import { R2_BUCKET } from "@/consts";
import { svaCarousel } from "./common/carousel";
import { css } from "@styled-system/css";
import cleanImagePath from "@/utils/cleanImagePath";

type ArkCarouselProps = {
  images: string[];
  thumbnail: string;
};

export const ArkCarousel = ({ images, thumbnail }: ArkCarouselProps) => {
  const [page, setPage] = useState(0);
  const styles = svaCarousel.raw();

  // thumbnailを先頭に追加したimagesを作成
  const replaceImages = [cleanImagePath(thumbnail)].concat(
    images.map((image) => {
      if (image.startsWith("![")) {
        return cleanImagePath(image);
      }
      return image;
    })
  );

  return (
    <Carousel.Root
      className={css(styles.root)}
      slideCount={replaceImages.length}
      page={page}
      loop
      autoplay
      onPageChange={(e) => setPage(e.page)}
    >
      <Carousel.Control className={css(styles.control)}>
        <Carousel.AutoplayTrigger>
          <Carousel.Context>
            {({ isPlaying }) => (isPlaying ? "Pause" : "Play")}
          </Carousel.Context>
        </Carousel.AutoplayTrigger>
        <Carousel.PrevTrigger className={css(styles.prevTrigger)}>
          Previous
        </Carousel.PrevTrigger>
        <Carousel.NextTrigger className={css(styles.nextTrigger)}>
          Next
        </Carousel.NextTrigger>
      </Carousel.Control>
      <Carousel.IndicatorGroup className={css(styles.indicatorGroup)}>
        {replaceImages.map((_, index) => (
          <Carousel.Indicator
            key={index}
            index={index}
            className={css(styles.indicator)}
          />
        ))}
      </Carousel.IndicatorGroup>
      <Carousel.ItemGroup className={css(styles.itemGroup)}>
        {replaceImages.map((image, index) => (
          <Carousel.Item key={index} index={index} className={css(styles.item)}>
            <img src={`${R2_BUCKET}/${image}`} alt={`Slide ${index}`} />
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>
    </Carousel.Root>
  );
};
