import type { Metadata } from "next"; import "./globals.css";
export const metadata: Metadata = { title: "VOX SMM — Social growth, redefined.", description: "Plan, manage, and measure legitimate social advertising campaigns with VOX SMM." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
