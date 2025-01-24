import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ui/modals/ChatWidget";

export const metadata: Metadata = {
  title: "Lumos",
  description: "Liquidity pool management dapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={"bg-[#121212] text-white"}
      >
        {children}
        <ChatWidget></ChatWidget>
      </body>
    </html>
  );
}
