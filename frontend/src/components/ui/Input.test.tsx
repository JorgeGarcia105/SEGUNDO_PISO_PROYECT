import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" placeholder="tu@email.com" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument()
  })

  it('handles input changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('shows error state', () => {
    render(<Input error="Campo requerido" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Campo requerido')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-describedby')
  })

  it('shows helper text', () => {
    render(<Input helperText="Mínimo 8 caracteres" />)
    expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument()
  })

  it('handles disabled state', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})