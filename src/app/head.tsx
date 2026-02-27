// src/app/head.tsx
export default function Head() {
  const base = "https://11-enjc.vercel.app";
  const title = "11º ENJC | Inscreva-se";
  const description =
    "Inscrições abertas para o 11º ENJC! Um encontro jovem, alegre e cheio de fé. Vem com a gente! 🙏💛";
  const ogImage = `${base}/og/cover.png`;

  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph (WhatsApp/Instagram/Facebook) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={base} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
