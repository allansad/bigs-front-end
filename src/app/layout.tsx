import type { Metadata } from "next";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "게시판",
  description: "(주)빅스홀딩스 기업과제입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body>{children}</body>
    </html>
  );
}
