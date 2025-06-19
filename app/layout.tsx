import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Morales Propiedades - Inmobiliaria de Confianza',
  description: 'Encuentra tu hogar ideal con Morales Propiedades. Propiedades en venta y alquiler en CABA y GBA. Casas, departamentos y terrenos con la mejor ubicación y precio.',
  keywords: 'inmobiliaria, propiedades, venta, alquiler, casas, departamentos, CABA, GBA, Buenos Aires',
  authors: [{ name: 'Morales Propiedades' }],
  creator: 'Morales Propiedades',
  publisher: 'Morales Propiedades',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://moralespropiedades.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Morales Propiedades - Inmobiliaria de Confianza',
    description: 'Encuentra tu hogar ideal con Morales Propiedades. Propiedades en venta y alquiler en CABA y GBA.',
    url: 'https://moralespropiedades.com',
    siteName: 'Morales Propiedades',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Morales Propiedades - Inmobiliaria',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morales Propiedades - Inmobiliaria de Confianza',
    description: 'Encuentra tu hogar ideal con Morales Propiedades. Propiedades en venta y alquiler en CABA y GBA.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-codigo-google-verification',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
