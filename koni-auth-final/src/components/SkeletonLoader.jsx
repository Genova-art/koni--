import { COLORS } from "../data/constants";

const shimmerStyle = {
  background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 75%)",
  backgroundSize: "200% 100%",
  animation: "skeletonShimmer 1.4s infinite",
  borderRadius: 8,
};

export function SkeletonBox({ w = "100%", h = 20, r = 8, style = {} }) {
  return <div style={{ ...shimmerStyle, width: w, height: h, borderRadius: r, ...style }} />;
}

export function SkeletonCard() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "1.5rem",
      display: "flex", flexDirection: "column", gap: "0.75rem",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 4 }}>
        <SkeletonBox w={48} h={48} r={12} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <SkeletonBox w="70%" h={14} />
          <SkeletonBox w="40%" h={10} />
        </div>
      </div>
      <SkeletonBox w="100%" h={12} />
      <SkeletonBox w="85%" h={12} />
      <SkeletonBox w="60%" h={12} />
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <SkeletonBox w={80} h={28} r={100} />
        <SkeletonBox w={60} h={28} r={100} />
      </div>
    </div>
  );
}

export function SkeletonBerita() {
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(0,0,0,0.06)",
      borderRadius: 12, overflow: "hidden",
    }}>
      <div style={{ ...shimmerStyle, height: 160, borderRadius: 0, background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%", animation: "skeletonShimmerLight 1.4s infinite" }} />
      <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ ...shimmerStyle, background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%", animation: "skeletonShimmerLight 1.4s infinite", height: 10, width: "30%", borderRadius: 4 }} />
        <div style={{ ...shimmerStyle, background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%", animation: "skeletonShimmerLight 1.4s infinite", height: 18, borderRadius: 4 }} />
        <div style={{ ...shimmerStyle, background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%", animation: "skeletonShimmerLight 1.4s infinite", height: 12, width: "80%", borderRadius: 4 }} />
        <div style={{ ...shimmerStyle, background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%", animation: "skeletonShimmerLight 1.4s infinite", height: 12, width: "60%", borderRadius: 4 }} />
      </div>
    </div>
  );
}
