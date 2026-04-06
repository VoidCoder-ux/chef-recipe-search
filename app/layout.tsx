import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chef's Recipe Intelligence | Professional Recipe Search",
  description:
    "Professional recipe search engine for culinary professionals. Precise gram measurements, professional techniques, chef tips — no home-cook shortcuts.",
  keywords:
    "professional recipes, chef recipes, garde manger, cold kitchen, culinary techniques, gramaj tarif",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Chef Recipes",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#c8842a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Chef Recipes" />
      </head>
      <body className="bg-dark-900 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
