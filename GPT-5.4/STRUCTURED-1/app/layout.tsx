import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Análise de Crédito",
  description: "Aplicação web para avaliação de crédito de clientes."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
