import Navbar from './Navbar'
import { Toaster } from 'react-hot-toast'

export default function Layout({ children, user, setUser }) {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className='grid-background'></div>
      <Navbar user={user} setUser={setUser} />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}