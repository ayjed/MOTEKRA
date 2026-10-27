import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "MOTEKRA", short_name: "MOTEKRA", description: "Digital products for what’s next.", start_url: "/", display: "browser", background_color: "#FFFFFF", theme_color: "#08152B", icons: [{ src: "/assets/brand/motekra-mark.png", sizes: "400x400", type: "image/png" }] };
}
