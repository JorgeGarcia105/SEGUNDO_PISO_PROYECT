import { type ReactNode } from 'react'
import { cn } from '@utils/cn'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface PageLayoutProps {
  children: ReactNode
  sidebar?: {
    isOpen: boolean
    onToggle: () => void
    items: Array<{ key: string; label: string; short: string; onClick: () => void }>
    activeKey: string
    brand?: { mark: ReactNode; name: string; caption: string }
    footer?: ReactNode
  }
  topbar?: {
    title: string
    subtitle?: string
    breadcrumb?: ReactNode
    user?: { name: string; email: string; avatar?: string }
    onSignOut: () => void
  }
  className?: string
}

export function PageLayout({
  children,
  sidebar,
  topbar,
  className,
}: PageLayoutProps) {
  const handleToggleSidebar = () => {
    if (sidebar) {
      sidebar.onToggle()
    }
  }

  const handleCloseSidebar = () => {
    if (sidebar) {
      sidebar.onToggle()
    }
  }

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {sidebar && (
        <Sidebar
          isOpen={sidebar.isOpen}
          onClose={handleCloseSidebar}
          items={sidebar.items.map((item) => ({
            ...item,
            onClick: () => {
              item.onClick()
              handleCloseSidebar()
            },
          }))}
          activeKey={sidebar.activeKey}
          brand={sidebar.brand}
          footer={sidebar.footer}
        />
      )}

      <div className={cn('lg:pl-64', sidebar?.isOpen && 'pl-64')}>
        {topbar && (
          <Topbar
            title={topbar.title}
            subtitle={topbar.subtitle}
            breadcrumb={topbar.breadcrumb}
            user={topbar.user}
            onMenuClick={handleToggleSidebar}
            onSignOut={topbar.onSignOut}
            menuOpen={sidebar?.isOpen ?? false}
          />
        )}

        <main className="p-4 lg:p-6" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}