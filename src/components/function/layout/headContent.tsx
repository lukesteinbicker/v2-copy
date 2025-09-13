import { seo } from "~/utils/seo";
import appCss from "~/styles/app.css?url";

export function HeadContent() {
  const metaTags = seo({
    title: "v.gallery",
    description: "Display your collection online",
  });

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {metaTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}
      <link rel="stylesheet" href={appCss} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" color="#fffff" />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
} 