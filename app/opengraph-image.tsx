import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.legalTagline} en ${site.address.district}, Lima`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0B192C 0%, #1E3E62 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 26, height: 26, borderRadius: 13, background: "#00A896" }} />
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: -2 }}>
            SERME<span style={{ color: "#2DD4BF" }}>KARE</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3, maxWidth: 900 }}>
            Recupera tu movilidad y vive sin dolor articular
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#CBD5E1" }}>
            Reumatólogos certificados · Ecografía en consultorio · Teleconsulta
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#5EEAD4" }}>
          {site.legalTagline} · {site.address.district}, Lima
        </div>
      </div>
    ),
    { ...size },
  );
}
