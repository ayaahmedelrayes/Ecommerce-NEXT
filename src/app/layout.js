import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'متجرنا 🛒',
  description: 'أفضل تجربة تسوق إلكتروني'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
        <script dangerouslySetInnerHTML={{
          __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(() => {}) }`
        }} />
      </body>
    </html>
  )
}
