import "./globals.css";
import Providers from "@/components/Providers";

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
          <div className="app-shell">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
