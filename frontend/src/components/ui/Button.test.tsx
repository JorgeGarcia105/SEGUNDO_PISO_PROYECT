import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toContainHTML('svg')
  })

  it('applies variant classes', () => {
    render(<Button variant="danger">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-danger-600')
  })

  it('applies size classes', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8')
  })
})