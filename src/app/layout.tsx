import { AuthProvider } from "@/components/providers/AuthProvider";
import Navbar from "../components/navbar";
import "./globals.css";
import "react-calendar/dist/Calendar.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-surface text-ink antialiased">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
