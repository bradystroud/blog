import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Brady Stroud";
    const description = searchParams.get("description") || "";
    const coverImage = searchParams.get("coverImage") || "";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundImage: coverImage
              ? `url(${coverImage})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "80px",
          }}
        >
          {coverImage && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: 800,
                color: coverImage ? "#fff" : "#fff",
                lineHeight: 1.2,
                textShadow: coverImage ? "0 2px 10px rgba(0,0,0,0.3)" : "none",
              }}
            >
              {title}
            </div>
            {description && (
              <div
                style={{
                  fontSize: 37,
                  color: coverImage ? "#f0f0f0" : "#f0f0f0",
                  lineHeight: 1.4,
                  textShadow: coverImage
                    ? "0 2px 10px rgba(0,0,0,0.3)"
                    : "none",
                }}
              >
                {description}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: 37,
                fontWeight: 600,
                color: coverImage ? "#fff" : "#fff",
                textShadow: coverImage ? "0 2px 10px rgba(0,0,0,0.3)" : "none",
              }}
            >
              bradystroud.dev
            </div>
          </div>
        </div>
      ),
      {
        width: 1600,
        height: 836,
        headers: {
          "Cache-Control": "public, immutable, no-transform, max-age=31536000, s-maxage=31536000",
          "Content-Type": "image/png",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
