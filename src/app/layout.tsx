import type { Metadata } from "next";
import { Geist_Mono, Lora, Nunito } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { PwaRegister } from "@/components/layout/pwa-register";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pregnant | Acompanhamento de Gestação",
  description:
    "Aplicação web humanizada para acompanhamento completo da gestação com foco em saúde, bem-estar e organização.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${lora.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        {children}
        <ToastContainer position="top-right" autoClose={2400} hideProgressBar />
      </body>
    </html>
  );
}
