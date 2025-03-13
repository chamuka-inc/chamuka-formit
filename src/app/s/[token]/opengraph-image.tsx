import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const alt = "Chamuka FormIt - Form";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/jpeg";

export default async function Image({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Fetch form data
  const form = await db.form.findUnique({
    where: { publicShareToken: token },
    select: {
      title: true,
      description: true,
    },
  });

  if (!form) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          <h1 style={{ fontSize: 64 }}>Form Not Found</h1>
        </div>
      ),
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          color: "#000",
          padding: 40,
        }}
      >
        <h1 style={{ fontSize: 64, marginBottom: 20 }}>{form.title}</h1>
        {form.description && (
          <p style={{ fontSize: 32, textAlign: "center" }}>
            {form.description}
          </p>
        )}
        <p style={{ fontSize: 24, marginTop: "auto", color: "#666" }}>
          Created with Chamuka FormIt
        </p>
      </div>
    ),
  );
}
