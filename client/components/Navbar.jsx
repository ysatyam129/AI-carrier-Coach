import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from './ui/button'
import { Brain, Menu, X, User, LogOut, BarChart3, FileText, Target, BookOpen } from 'lucide-react'
import { authAPI } from '../lib/auth'

export default function Navbar({ user, setUser }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    authAPI.logout()
    setUser(null)
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Quiz', href: '/quiz', icon: BookOpen },
    { name: 'Resume', href: '/resume', icon: FileText },
    { name: 'Interview', href: '/interview', icon: Target },
    { name: 'Cover Letter', href: '/cover-letter', icon: FileText },
  ]

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              <span className="text-lg sm:text-xl font-bold text-white">
                AI Career Coach
              </span>
            </Link>
          </div>

          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                        router.pathname === item.href
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-300 hover:text-primary hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{item.name}</span>
                    </Link>
                  )
                })}
                
                <div className="flex items-center space-x-2 xl:space-x-4 ml-4 xl:ml-6 pl-4 xl:pl-6 border-l border-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 xl:w-8 xl:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 xl:h-4 xl:w-4 text-primary" />
                    </div>
                    <span className="hidden xl:inline text-sm font-medium text-white">{user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button size="sm" className="text-sm" onClick={() => router.push('/register')}>
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-800">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      router.pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-300 hover:text-primary hover:bg-gray-800'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}