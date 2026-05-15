import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Herramierntas Data Bi - CNE",
  description: "Portal de acceso a módulos de herramientas de Data BI del CNE",
};

const themeInitScript = `(() => {
  try {
    const stored = localStorage.getItem('theme');
    // Por defecto modo oscuro; solo modo claro si el usuario lo eligió explícitamente.
    const isDark = stored !== 'light';
    document.documentElement.classList.toggle('dark', isDark);
  } catch {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geist.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
