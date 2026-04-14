import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analisador de Credito",
  description: "Aplicacao web para avaliacao de credito de clientes com registro de logs.",
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
