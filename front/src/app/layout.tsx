import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "../../store/reduxProvider";


// Charger la police Roboto
const roboto = localFont({
  src: [
    {
      path: "./styles/fonts/Roboto-Regular.ttf", // Correct
      weight: "400",
      style: "normal",
    },
    {
      path: "./styles/fonts/Roboto-Bold.ttf", // Correct
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roboto",
});

// Metadata pour SEO
export const metadata: Metadata = {
  title: "Rendezio",
  description: "Rendezio - Simplifiez vos réservations en ligne",
  keywords: ["Rendezio", "Réservations", "ZenChef", "Application de réservation"],
  authors: [{ name: "Gaspard Pauchet", url: "https://portfolio-lilac-kappa-24.vercel.app/" }],
  applicationName: "Rendezio",
  generator: "Next.js",
  openGraph: {
    title: "Rendezio - Simplifiez vos réservations",
    description: "Découvrez Rendezio, une application moderne pour gérer vos réservations en ligne.",
    url: "https://rendezio.com",
    siteName: "Rendezio",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rendezio - Simplifiez vos réservations",
      },
    ],
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rendezio_app",
    creator: "@gaspard_pauchet",
    title: "Rendezio - Simplifiez vos réservations",
    description: "Découvrez Rendezio, une application moderne pour gérer vos réservations en ligne.",
    images: ["/images/twitter-card.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "msapplication-TileColor": "#2b5797",
    "msapplication-config": "/browserconfig.xml",
  },
};

// Propriétés d'affichage
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${roboto.variable} antialiased`}>
        {/* Envelopper l'application avec le Provider Redux */}
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}