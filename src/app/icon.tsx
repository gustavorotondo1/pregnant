import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 256,
          fontWeight: 700,
          fontFamily: "Nunito, system-ui, sans-serif",
        }}
      >
        P
      </div>
    ),
    {
      ...size,
    },
  );
}