import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge, StatusBadge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Test</Badge>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success')).toHaveClass('bg-success-100')
  })

  it('applies size classes', () => {
    render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small')).toHaveClass('px-2')
  })

  it('shows dot when requested', () => {
    render(<Badge dot>With dot</Badge>)
    expect(screen.getByText('With dot')).toBeInTheDocument()
  })
})

describe('StatusBadge', () => {
  const statuses = [
    { status: 'VIGENTE', variant: 'success' },
    { status: 'MODIFICADA', variant: 'warning' },
    { status: 'DEROGADA', variant: 'danger' },
    { status: 'HISTORICA', variant: 'info' },
    { status: 'PENDIENTE_CONFIRMACION', variant: 'warning' },
    { status: 'NO_VERIFICADO', variant: 'neutral' },
  ]

  statuses.forEach(({ status, variant }) => {
    it(`renders ${status} with ${variant} variant`, () => {
      render(<StatusBadge status={status} />)
      const badge = screen.getByText(status.replace(/_/g, ' '))
      expect(badge).toHaveClass(`bg-${variant}-100`)
    })
  })
})