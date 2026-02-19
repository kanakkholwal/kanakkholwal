export async function getRemoteImageAsBase64(url: string) {
  try {
    // 1. Fetch the image with Next.js caching enabled
    const res = await fetch(url, {
      cache: "force-cache", // Cache this so we don't hit the CDN every time
      headers: {
        // Some CDNs (like GitHub) require a User-Agent
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);

    // 2. Convert to Buffer -> Base64
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");

    // 3. Return the Data URL
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching remote image:", error);
    return null;
  }
}
