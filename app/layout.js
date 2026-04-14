import "./globals.css";
import { Suspense } from "react";
import Providers from "@/components/Providers";
import RouteLoader from "@/components/RouteLoader";

export const metadata = {
  title: "Sanjay - Fruits & Vegetables | Farm Fresh, Daily Delivered",
  description: "Order fresh fruits and vegetables online. Same day delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Suspense>
            <RouteLoader />
          </Suspense>
          <div className="app-shell">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
