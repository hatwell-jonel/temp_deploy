import { TailwindIndicator } from "@/components/indicators/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";

const fontSans = Poppins({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  preload: true,
  variable: "--font-sans",
});

const fontCal = localFont({
  src: "../styles/calsans.ttf",
  variable: "--font-cal",
  display: "swap",
});

const title = site.name;
const description = site.description;

export const metadata: Metadata = {
  title,
  description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body
        className={cn(
          fontSans.variable,
          fontCal.variable,
          "bg-background font-sans antialiased",
        )}
      >
        {children}
        <TailwindIndicator />
        <Toaster />
      </body>
    </html>
  );
}
