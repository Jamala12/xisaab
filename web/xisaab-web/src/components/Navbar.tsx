import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, Users, FileText, CreditCard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Invoices', href: '/invoices', icon: FileText },
  { label: 'Payments', href: '/payments', icon: CreditCard },
]

export default function Navbar() {
  const { email, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-border flex flex-col z-50">
      <div className="px-6 py-5 border-b border-border">
        <span className="text-xl font-semibold tracking-tight text-foreground">Xisaab</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = location.pathname.startsWith(href)
          return (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground px-3 mb-2 truncate">{email}</p>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </aside>
  )
}