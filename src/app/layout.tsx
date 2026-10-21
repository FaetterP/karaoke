import type { Metadata } from "next";
import "./global.css"

export const metadata: Metadata = {
  title: "Караоке",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
