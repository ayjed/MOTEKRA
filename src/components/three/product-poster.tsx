// Server-rendered visual fallback matching the exact 3D device composition.
// Eliminates layout shifts, oversized models, and visual inconsistencies.
export function ProductPoster({ compact = false }: { compact?: boolean }) {
  return (
    <figure
      className={`product-scene ${compact ? "product-scene-compact" : ""}`}
      aria-label="MOTEKRA digital product interface showcased on laptop and smartphone"
    >
      <picture className="product-poster-picture">
        <source
          media="(max-width: 767px)"
          srcSet="/assets/hero/hero-devices-mobile.webp"
          type="image/webp"
        />
        <source
          media="(min-width: 768px)"
          srcSet="/assets/hero/hero-devices-desktop.webp"
          type="image/webp"
        />
        <img
          src="/assets/hero/hero-devices-desktop.webp"
          alt="MOTEKRA digital product interface showcased on laptop and smartphone"
          width={1126}
          height={1152}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="product-poster-img"
        />
      </picture>
    </figure>
  );
}
