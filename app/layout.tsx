import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./ui/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { Kantumruy_Pro } from "next/font/google";
import { Metadata } from "next";
const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy-pro",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "BE | MENU",
  description:
    "Admin panel for Emoji . Manage menu items, categories, and orders with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href="/logo-web.svg" type="image/x-icon" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <div className=" font-[Kantumruy_Pro]">
              {" "}
              {children}
              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
