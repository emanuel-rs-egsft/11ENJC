import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "11º ENJC",
    short_name: "11º ENJC",
    description:
      "Inscrições abertas para o 11º ENJC! Um encontro jovem, alegre e cheio de fé. 🙏💛",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#F29500",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
