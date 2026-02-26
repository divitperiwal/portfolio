import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Divit Periwal — Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#e53e3e",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#999",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            SOFTWARE DEVELOPER
          </span>
        </div>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 900,
            color: "#1a1a1a",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          DIVIT PERIWAL
        </h1>
        <p
          style={{
            fontSize: "22px",
            color: "#666",
            marginTop: "24px",
            fontStyle: "italic",
            lineHeight: 1.4,
          }}
        >
          Engineering decisions matter more than technologies.
          <br />
          Good architecture outlives every framework.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
            flexWrap: "wrap",
          }}
        >
          {["TypeScript", "Node.js", "Next.js", "PostgreSQL", "Redis", "Docker"].map(
            (tech) => (
              <span
                key={tech}
                style={{
                  fontSize: "14px",
                  color: "#555",
                  border: "1px solid #ddd",
                  padding: "6px 14px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                }}
              >
                {tech}
              </span>
            )
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            fontSize: "14px",
            color: "#bbb",
            letterSpacing: "0.1em",
          }}
        >
          divitperiwal.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
