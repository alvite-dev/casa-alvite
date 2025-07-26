import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Configuração da fonte Juniper Bay personalizada
const juniperBay = localFont({
  src: '../fonts/junyper-bay/JuniperBay-Regular.otf',
  variable: '--font-juniper-bay',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Casa Alvite - Experiências em Cerâmica',
  description: 'Experiências únicas em cerâmica com sistema de agendamento e pagamento online.',
  keywords: 'cerâmica, experiências, agendamento, Casa Alvite, arte, criatividade',
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/images/logo/favicon/favicon-128x128.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={juniperBay.variable}>
      <body className="font-instrument antialiased">
        {children}
      </body>
    </html>
  )
} 