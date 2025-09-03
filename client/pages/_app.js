import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { authAPI } from '../lib/auth'
import Layout from '../components/Layout'
import { ThemeProvider } from '../components/theme-provider'

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Layout user={user} setUser={setUser}>
        <Component {...pageProps} user={user} setUser={setUser} />
      </Layout>
    </ThemeProvider>
  )
}