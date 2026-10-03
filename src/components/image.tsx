import type { ImageProps as UnpicImageProps } from "@unpic/react";
import { Image as BaseImage, type ImageProps as BaseImageProps } from "@unpic/react/base";
import type { CSSProperties } from "react";
import { getProviderForUrl, getTransformerForCdn, type ImageCdn } from "unpic";

export type ImageProps = UnpicImageProps & { style?: CSSProperties };

// Hosts with no image CDN unpic recognises get resized by Cloudflare Image Transformations, once enabled on the zone.
const cloudflareDomain = import.meta.env.VITE_CF_IMAGE_DOMAIN;
const defaultFallback: ImageCdn | undefined = cloudflareDomain ? "cloudflare" : undefined;
const defaultOptions = cloudflareDomain ? { cloudflare: { domain: cloudflareDomain } } : {};

/**
 * Unpic `<Image>`. Built on `@unpic/react/base` because the auto entry returns props untouched for
 * unknown hosts, which drops `priority`, lazy loading and `sizes`. `unstyled`: Tailwind classes own sizing.
 */
export default function Image({ cdn, fallback, operations, options, ...props }: ImageProps) {
  const provider = cdn ?? (getProviderForUrl(props.src) || fallback || defaultFallback);
  const providerOptions = { ...defaultOptions, ...options } as Record<string, unknown>;
  const baseProps = {
    unstyled: true,
    ...props,
    transformer: getTransformerForCdn(provider),
    operations: provider ? operations?.[provider] : undefined,
    options: provider ? providerOptions[provider] : undefined,
  };
  // A missing transformer is supported at runtime (no srcset); the base types just don't admit it.
  return <BaseImage {...(baseProps as unknown as BaseImageProps<object, unknown>)} />;
}
