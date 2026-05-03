import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #fdf8f3, #f6ebe0)",
          borderRadius: 40,
          color: "#6e3f26",
          fontSize: 96,
          fontWeight: 700,
          fontFamily: "Nunito, system-ui, sans-serif",
        }}
      >
        P
      </div>
    ),
    {
      width: 192,
      height: 192,
    },
  );
}