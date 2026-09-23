import { type ReactNode } from 'react'
import { cn } from '@utils/cn'
import { Button, Avatar, Dropdown, type DropdownItem } from '@components/ui'

interface TopbarProps {
  title: string
  subtitle?: string
  breadcrumb?: ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onMenuClick: () => void
  onSignOut: () => void
  menuOpen: boolean
  className?: string
}

export function Topbar({
  title,
  subtitle,
  breadcrumb,
  user,
  onMenuClick,
  onSignOut,
  menuOpen,
  className,
}: TopbarProps) {
  const userItems: DropdownItem[] = [
    { label: 'Perfil', onClick: () => {}, icon: <UserIcon /> },
    { label: 'Configuración', onClick: () => {}, icon: <SettingsIcon /> },
    { divider: true },
    { label: 'Cerrar sesión', onClick: onSignOut, danger: true, icon: <LogoutIcon /> },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center gap-4 border-b border-gray-100 bg-white px-4 py-3',
        'lg:px-6',
        className
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
      >
        <MenuIcon />
      </Button>

      <div className="flex-1 min-w-0">
        {breadcrumb && (
          <nav className="flex items-center gap-1 text-sm text-gray-500 mb-1" aria-label="Ruta de navegación">
            {breadcrumb}
          </nav>
        )}
        <div>
          <h1 className="truncate text-lg font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="truncate text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      {user && (
        <Dropdown
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Menú de usuario"
              aria-expanded={false}
            >
              <Avatar name={user.name} src={user.avatar} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{user.name}</p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email}</p>
              </div>
            </button>
          }
          items={userItems}
          align="right"
        />
      )}
    </header>
  )
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}