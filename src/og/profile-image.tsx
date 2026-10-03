import { appConfig } from "root/project.config";
import { generateOgImage } from "./generator";
import { ProfileOgTemplate } from "./og-templates";
import { getRemoteImageAsBase64 } from "./utils";

/** Site-wide social card served at /opengraph-image and /twitter-image. */
export async function profileImageResponse() {
  const avatar = await getRemoteImageAsBase64(appConfig.avatar);
  return generateOgImage(<ProfileOgTemplate avatar={avatar ?? undefined} />);
}
