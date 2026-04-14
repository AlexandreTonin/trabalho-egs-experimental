import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analise de Credito",
  description: "Aplicacao web para analise de credito de clientes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
