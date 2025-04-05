import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import KBar from "@/components/kbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "HyperMail",
  description: "HyperMail is the ultimate AI email assistant that automates organization, prioritizes important messages, and drafts smart replies. Boost productivity and declutter your inbox with cutting-edge AI.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geist.variable} font-sans`} // Add `font-sans` to apply Avenir
        suppressHydrationWarning
      >
        <body style={{ fontFamily: "'Avenir LT Std', sans-serif" }}> {/* Apply Avenir */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <KBar>
                {children}
                <Toaster richColors />
              </KBar>
            </TRPCReactProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}