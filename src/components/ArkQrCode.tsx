import { svaQrCode } from "./common/qr-code";
import { QrCode } from "@ark-ui/react/qr-code";
import { css } from "@styled-system/css";

type Props = {
  url: string;
  iconUrl?: string;
};

export const ArkQrCode = ({ url, iconUrl }: Props) => {
  const styles = svaQrCode.raw();
  return (
    <QrCode.Root
      value={url}
      encoding={{ ecc: "H" }}
      className={css(styles.root)}
    >
      <QrCode.Frame className={css(styles.frame)}>
        <QrCode.Pattern className={css(styles.pattern)} />
      </QrCode.Frame>
      {iconUrl && (
        <QrCode.Overlay className={css(styles.overlay)}>
          <img src={iconUrl} alt="Custom Icon" />
        </QrCode.Overlay>
      )}
    </QrCode.Root>
  );
};
