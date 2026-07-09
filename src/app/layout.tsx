import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Victor AI Engineer | Soluções Digitais",
  description: "Trabalhe de casa prospectando empresas para a maior agência de soluções digitais. Nós criamos sites, automações e IA. Você ganha comissões.",
  keywords: ["trabalho remoto", "renda extra", "home office", "prospecção", "soluções digitais", "inteligência artificial", "sites", "automação", "Franca SP"],
  authors: [{ name: "Victor AI Engineer" }],
  openGraph: {
    title: "Victor AI Engineer | Soluções Digitais",
    description: "Trabalhe de casa prospectando empresas para a maior agência de soluções digitais. Nós criamos sites, automações e IA. Você ganha comissões.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        {/* Anti-flash theme script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-bg text-primary selection:bg-[#0052FF] selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
