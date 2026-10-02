/* ==========================================
   QR CODE IMAGES
   THE SCAN TARGET IS THE PAYMENT URL, SO A
   CAMERA OPENS THE BKASH CHECKOUT DIRECTLY

   TO SWAP THE PROVIDER LATER CHANGE ONLY
   `QR_PROVIDER` AND THE MATCHING BUILDER
   NOTHING IN THE UI DEPENDS ON THE SERVICE
   ========================================== */

export type QrProvider = "qrserver" | "quickchart";

export const QR_PROVIDER: QrProvider = "qrserver";

/*  EVERY BUILDER MUST RETURN A PNG SO A PLAIN
    IMG RENDERS IT WITH NO CANVAS WORK  */

const builders: Record<QrProvider, (value: string, size: number) => string> = {
  qrserver: (value, size) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&format=png&ecc=M&margin=8&data=${encodeURIComponent(
      value,
    )}`,

  quickchart: (value, size) =>
    `https://quickchart.io/qr?size=${size}&format=png&ecLevel=M&margin=2&text=${encodeURIComponent(
      value,
    )}`,
};

/**
 * Builds the image URL that renders `value` as a QR code.
 * Returns null for an empty value so callers can skip the image.
 */
export const buildQrImageUrl = (
  value: string | null | undefined,
  size = 320,
): string | null => {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  return builders[QR_PROVIDER](trimmed, size);
};
