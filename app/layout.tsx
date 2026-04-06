import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chef's Recipe Intelligence | Professional Recipe Search",
  description:
    "Professional recipe search engine for culinary professionals. Precise gram measurements, professional techniques, chef tips — no home-cook shortcuts.",
  keywords:
    "professional recipes, chef recipes, garde manger, cold kitchen, culinary techniques, gramaj tarif",
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
      </head>
      <body className="bg-dark-900 text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
