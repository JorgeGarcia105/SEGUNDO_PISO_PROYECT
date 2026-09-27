import { test, expect } from '@playwright/test'

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin')
  })

  test('muestra formulario de login', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /segundopiso/i })).toBeVisible()
    await expect(page.getByLabel('Correo electrónico')).toBeVisible()
    await expect(page.getByLabel('Contraseña')).toBeVisible()
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible()
  })

  test('muestra error con credenciales inválidas', async ({ page }) => {
    await page.fill('[name="email"]', 'invalido@test.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button:has-text("Iniciar sesión")')
    
    await expect(page.getByText(/no fue posible iniciar sesión/i)).toBeVisible()
  })

  test('navega a home tras login exitoso (superadmin)', async ({ page }) => {
    await page.fill('[name="email"]', 'garciatorresjorgeivan10@gmail.com')
    await page.fill('[name="password"]', 'Jorge10')
    await page.click('button:has-text("Iniciar sesión")')
    
    await expect(page).toHaveURL('/')
    await expect(page.getByText('Supabase conectado')).toBeVisible()
    await expect(page.getByText('Superadmin')).toBeVisible()
  })

  test('navega a home tras login exitoso (admin fiscal)', async ({ page }) => {
    await page.fill('[name="email"]', 'fiscal@segundopiso.local')
    await page.fill('[name="password"]', 'Fiscal_Segundo_Piso.2')
    await page.click('button:has-text("Iniciar sesión")')
    
    await expect(page).toHaveURL('/')
    await expect(page.getByText('Supabase conectado')).toBeVisible()
    await expect(page.getByText('Administrador')).toBeVisible()
  })
})

test.describe('Panel de administración', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin')
    await page.fill('[name="email"]', 'garciatorresjorgeivan10@gmail.com')
    await page.fill('[name="password"]', 'Jorge10')
    await page.click('button:has-text("Iniciar sesión")')
    await expect(page).toHaveURL('/')
  })

  test('muestra sidebar de administración', async ({ page }) => {
    await expect(page.getByText('Administración')).toBeVisible()
    await expect(page.getByText('Incumplimientos')).toBeVisible()
    await expect(page.getByText('Medidas Correctivas')).toBeVisible()
    await expect(page.getByText('Normas')).toBeVisible()
    await expect(page.getByText('Aseos')).toBeVisible()
  })

  test('navega a módulos de administración', async ({ page }) => {
    await page.click('text=Normas')
    await expect(page).toHaveURL(/\/admin\/normas/)
    await expect(page.getByRole('heading', { name: /normas/i })).toBeVisible()

    await page.click('text=Incumplimientos')
    await expect(page).toHaveURL(/\/admin\/incumplimientos/)
    await expect(page.getByRole('heading', { name: /incumplimientos/i })).toBeVisible()
  })
})

test.describe('Módulo Normas (admin)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin')
    await page.fill('[name="email"]', 'garciatorresjorgeivan10@gmail.com')
    await page.fill('[name="password"]', 'Jorge10')
    await page.click('button:has-text("Iniciar sesión")')
    await page.click('text=Normas')
  })

  test('muestra lista de normas', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /normas/i })).toBeVisible()
    await expect(page.getByText(/normas/)).toBeVisible()
  })

  test('filtra por categoría', async ({ page }) => {
    await page.selectOption('select:has(label:has-text("Categoría"))', 'cat-aseo')
    await expect(page.getByText('Aseo')).toBeVisible()
  })

  test('busca normas', async ({ page }) => {
    await page.fill('input[placeholder*="Buscar"]', 'aseo')
    await expect(page.getByText('aseo', { exact: false })).toBeVisible()
  })
})

test.describe('Responsive', () => {
  test('sidebar se abre en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    await page.click('button[aria-label="Abrir menú"]')
    await expect(page.getByText('Inicio')).toBeVisible()
    await expect(page.getByText('Normas')).toBeVisible()
  })
})