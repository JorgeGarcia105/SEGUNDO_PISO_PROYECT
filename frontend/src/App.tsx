import { useState } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { initializeLocalStores } from './services/local/localDataService'
import { seedNorms, seedCleaningZones, seedAssemblyMinutes } from './data/seedData'
import { ToastProvider } from './components/ui/Toast'
import { ModuleLoader, ErrorBoundary } from './components/ui'
import { AdminLayout } from './modules/admin'
import { SignInPage } from './modules/auth'
import './App.css'

const NormsModule = lazy(() => import('./modules/norms/NormsList').then((m) => ({ default: m.NormsList })))
const NormasResidentModule = lazy(() => import('./modules/norms/NormasResidentView').then((m) => ({ default: m.NormasResidentView })))
const CleaningAssignmentsModule = lazy(() => import('./modules/cleaning/CleaningAssignments').then((m) => ({ default: m.CleaningAssignmentsList })))
const CleaningCalendarModule = lazy(() => import('./modules/cleaning/CleaningCalendar').then((m) => ({ default: m.CleaningCalendar })))
const CleaningZonesModule = lazy(() => import('./modules/cleaning/CleaningZones').then((m) => ({ default: m.CleaningZonesList })))
const CleaningTasksModule = lazy(() => import('./modules/cleaning/CleaningTasks').then((m) => ({ default: m.CleaningTasksList })))
const CleaningReviewsModule = lazy(() => import('./modules/cleaning/CleaningReviews').then((m) => ({ default: m.CleaningReviewsList })))
const AseosResidentModule = lazy(() => import('./modules/cleaning/AseosResidentView').then((m) => ({ default: m.AseosResidentView })))
const CalendarModule = lazy(() => import('./modules/calendar/CalendarView').then((m) => ({ default: m.CalendarView })))
const MinutesModule = lazy(() => import('./modules/minutes/MinutesList').then((m) => ({ default: m.MinutesList })))
const AnnouncementsModule = lazy(() => import('./modules/announcements/AnnouncementsList').then((m) => ({ default: m.AnnouncementsList })))
const DocumentsModule = lazy(() => import('./modules/documents/DocumentsList').then((m) => ({ default: m.DocumentsList })))
const AdminViolationsModule = lazy(() => import('./modules/admin/ViolationsList').then((m) => ({ default: m.ViolationsList })))
const AdminMeasuresModule = lazy(() => import('./modules/admin/CorrectiveMeasuresList').then((m) => ({ default: m.CorrectiveMeasuresList })))
const AdminCaseEventsModule = lazy(() => import('./modules/admin/CaseEventsList').then((m) => ({ default: m.CaseEventsList })))
const AdminCaseEvidenceModule = lazy(() => import('./modules/admin/CaseEvidenceList').then((m) => ({ default: m.CaseEvidenceList })))
const AdminPersonasModule = lazy(() => import('./modules/admin/PersonasAdminList').then((m) => ({ default: m.PersonasAdminList })))
const AdminAuditoriaModule = lazy(() => import('./modules/admin/AuditoriaAdminList').then((m) => ({ default: m.AuditoriaAdminList })))

type ModuleKey = 'inicio' | 'normas' | 'aseos' | 'calendario' | 'actas' | 'avisos' | 'documentos'
type CleaningTabKey = 'assignments' | 'calendar' | 'zones' | 'tasks' | 'reviews'

const modulePreloadMap: Record<ModuleKey, () => Promise<any>> = {
  inicio: () => Promise.resolve(),
  normas: () => import('./modules/norms/NormsList'),
  aseos: () => import('./modules/cleaning/CleaningAssignments'),
  calendario: () => import('./modules/calendar/CalendarView'),
  actas: () => import('./modules/minutes/MinutesList'),
  avisos: () => import('./modules/announcements/AnnouncementsList'),
  documentos: () => import('./modules/documents/DocumentsList'),
}

const navigation: Array<{ key: ModuleKey; label: string; short: string }> = [
  { key: 'inicio', label: 'Inicio', short: 'IN' },
  { key: 'normas', label: 'Normas', short: 'NO' },
  { key: 'aseos', label: 'Aseos', short: 'AS' },
  { key: 'calendario', label: 'Calendario', short: 'CA' },
  { key: 'actas', label: 'Actas', short: 'AC' },
  { key: 'avisos', label: 'Avisos', short: 'AV' },
  { key: 'documentos', label: 'Documentos', short: 'DO' },
]

const adminNavigation = { key: 'admin' as const, label: 'Administración', short: 'AD', path: '/admin' }

const moduleCopy: Record<ModuleKey, { eyebrow: string; title: string; description: string }> = {
  inicio: {
    eyebrow: 'Panel de orientación',
    title: 'La información del piso, en un solo lugar.',
    description: 'Consulta el estado documental, normas vigentes, turnos de aseo y actas de SegundoPiso.',
  },
  normas: {
    eyebrow: 'Normativa',
    title: 'Normas con fuente y contexto.',
    description: 'La Carta Interna y las decisiones de asamblea clasificadas con vigencia y trazabilidad.',
  },
  aseos: {
    eyebrow: 'Organización',
    title: 'Aseos claros, tareas trazables.',
    description: 'Zonas, instrucciones, asignaciones semanales y revisiones de cumplimiento.',
  },
  calendario: {
    eyebrow: 'Fechas',
    title: 'Un calendario para orientarse.',
    description: 'Turnos de aseos, reuniones, asambleas y avisos en una vista unificada por fechas.',
  },
  actas: {
    eyebrow: 'Memoria del piso',
    title: 'Actas sin perder su historia.',
    description: 'Registro cronológico de asambleas con propuestas, votaciones, acuerdos y excepciones.',
  },
  avisos: {
    eyebrow: 'Comunicación',
    title: 'Avisos visibles y con vigencia.',
    description: 'Comunicados oficiales con nivel de prioridad y estado de publicación.',
  },
  documentos: {
    eyebrow: 'Fuentes',
    title: 'Documentos que sostienen cada dato.',
    description: 'Consulta y verificación de los PDFs originales de respaldo institucional.',
  },
}

function AppContent() {
  const { isLocalMode, user, profile, signOut } = useAuth()
  const [activeModule, setActiveModule] = useState<ModuleKey>('inicio')
  const [cleaningTab, setCleaningTab] = useState<CleaningTabKey>('assignments')
  const [menuOpen, setMenuOpen] = useState(false)
  const [resetMessage, setResetMessage] = useState('')

  const copy = moduleCopy[activeModule]

  function handleResetSeed() {
    initializeLocalStores(true)
    setResetMessage('¡Datos locales restablecidos a la semilla documental!')
    setTimeout(() => setResetMessage(''), 3500)
  }

  // Default to public/resident view - no login required for public content
  // In local mode, switchMockRole can change this; in production, admin routes are protected by AdminLayout
  const [currentRole, setCurrentRole] = useState<'usuario' | 'administrador' | 'superadministrador'>('usuario')

  // Main app content component for React Router
  const MainAppContent = () => (
    <>
      <section className="intro-block">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="intro-copy">{copy.description}</p>
        </div>
        <div className="intro-note">
          <span className="note-kicker">Entorno</span>
          <strong>{isLocalMode ? 'Modo Local Autónomo' : 'Nube Supabase'}</strong>
          <span>
            {currentRole === 'superadministrador'
              ? 'Permisos Superadmin'
              : currentRole === 'administrador'
              ? 'Permisos de Administrador'
              : 'Vista de Residente'}
          </span>
        </div>
      </section>

      {/* Renderizado de módulos */}
      {activeModule === 'inicio' && (
        <>
          <section className="signal-grid" aria-label="Estado de módulos">
            <article className="signal-card signal-card-wide">
              <span className="signal-index">01 / FUENTE NORMATIVA</span>
              <h2>{seedNorms.length} normas documentadas y contextualizadas.</h2>
              <p>
                La Carta Interna y las decisiones históricas se conservan con distinción clara entre
                norma vigente y propuestas de asamblea.
              </p>
              <button
                type="button"
                className="text-action"
                onClick={() => setActiveModule('normas')}
              >
                Explorar normas <span aria-hidden="true">→</span>
              </button>
            </article>

            <article className="signal-card signal-card-amber">
              <span className="signal-index">02 / ASEOS Y TAREAS</span>
              <strong>Zonas comunitarias</strong>
              <b>{seedCleaningZones.length}</b>
              <p>Pasillos, baños, duchas, cocina y zona de lavado con instrucciones precisas.</p>
              <button
                type="button"
                className="text-action"
                style={{ color: '#52341b', marginTop: '12px' }}
                onClick={() => setActiveModule('aseos')}
              >
                Ver asignaciones <span aria-hidden="true">→</span>
              </button>
            </article>

            <article className="signal-card signal-card-blue">
              <span className="signal-index">03 / MEMORIA HISTÓRICA</span>
              <strong>Actas de asamblea</strong>
              <b>{seedAssemblyMinutes.length}</b>
              <p>Votaciones, decisiones, fondos de rifas y excepciones individuales registradas.</p>
              <button
                type="button"
                className="text-action"
                style={{ color: '#163133', marginTop: '12px' }}
                onClick={() => setActiveModule('actas')}
              >
                Consultar actas <span aria-hidden="true">→</span>
              </button>
            </article>
          </section>

          <section className="workbench-grid">
            <article className="workbench-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Trazabilidad documental</p>
                  <h2>El ciclo de vida normativo del piso.</h2>
                </div>
                <span className="panel-count">3 etapas</span>
              </div>
              <div className="timeline">
                <div className="timeline-row">
                  <span>01</span>
                  <div>
                    <strong>Documento fuente</strong>
                    <p>Carta Interna o Acta en PDF con checksum y fecha original.</p>
                  </div>
                  <em>Documentado</em>
                </div>
                <div className="timeline-row">
                  <span>02</span>
                  <div>
                    <strong>Decisión en asamblea</strong>
                    <p>Propuesta, votación o excepción individual con alcance delimitado.</p>
                  </div>
                  <em>Trazable</em>
                </div>
                <div className="timeline-row">
                  <span>03</span>
                  <div>
                    <strong>Norma vigente o modificada</strong>
                    <p>Solo entra en vigencia con confirmación y respaldo institucional.</p>
                  </div>
                  <em>Consistente</em>
                </div>
              </div>
            </article>

            <article className="workbench-panel accent-panel">
              <p className="eyebrow">Acceso rápido</p>
              <h2>Navegación directa a módulos</h2>
              <div className="quick-links">
                <button type="button" onClick={() => setActiveModule('normas')}>
                  Catálogo de normas <span>↗</span>
                </button>
                <button type="button" onClick={() => setActiveModule('aseos')}>
                  Turnos y zonas de aseo <span>↗</span>
                </button>
                <button type="button" onClick={() => setActiveModule('calendario')}>
                  Calendario unificado <span>↗</span>
                </button>
                <button type="button" onClick={() => setActiveModule('actas')}>
                  Actas y votaciones <span>↗</span>
                </button>
                <button type="button" onClick={() => setActiveModule('avisos')}>
                  Avisos del piso <span>↗</span>
                </button>
                <button type="button" onClick={() => setActiveModule('documentos')}>
                  Documentos PDF fuente <span>↗</span>
                </button>
              </div>
            </article>
          </section>
        </>
      )}

      {activeModule === 'normas' && (
        <ErrorBoundary>
          <Suspense fallback={<ModuleLoader />}>
            {currentRole === 'administrador' || currentRole === 'superadministrador' ? (
              <NormsModule />
            ) : (
              <NormasResidentModule />
            )}
          </Suspense>
        </ErrorBoundary>
      )}

      {activeModule === 'aseos' && (
        <ErrorBoundary>
          <Suspense fallback={<ModuleLoader />}>
            {currentRole === 'administrador' || currentRole === 'superadministrador' ? (
              <div className="cleaning-module-container" style={{ display: 'grid', gap: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    borderBottom: '1px solid #ded8cf',
                    paddingBottom: '12px',
                    overflowX: 'auto',
                  }}
                >
                  {([
                    { key: 'assignments', label: 'Asignaciones' },
                    { key: 'calendar', label: 'Calendario de Aseos' },
                    { key: 'zones', label: 'Zonas' },
                    { key: 'tasks', label: 'Instrucciones / Tareas' },
                    { key: 'reviews', label: 'Revisiones y Firmas' },
                  ] as const).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setCleaningTab(tab.key)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 0,
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        background: cleaningTab === tab.key ? '#202323' : '#eee8df',
                        color: cleaningTab === tab.key ? '#fff7eb' : '#6b6359',
                        transition: 'all .15s ease',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {cleaningTab === 'assignments' && <CleaningAssignmentsModule />}
                {cleaningTab === 'calendar' && <CleaningCalendarModule />}
                {cleaningTab === 'zones' && <CleaningZonesModule />}
                {cleaningTab === 'tasks' && <CleaningTasksModule />}
                {cleaningTab === 'reviews' && <CleaningReviewsModule />}
              </div>
            ) : (
              <AseosResidentModule />
            )}
          </Suspense>
        </ErrorBoundary>
      )}

      {activeModule === 'calendario' && (
        <ErrorBoundary>
          <Suspense fallback={<ModuleLoader />}>
            <CalendarModule />
          </Suspense>
        </ErrorBoundary>
      )}
      {activeModule === 'actas' && (
        <ErrorBoundary>
          <Suspense fallback={<ModuleLoader />}>
            <MinutesModule />
          </Suspense>
        </ErrorBoundary>
      )}
      {activeModule === 'avisos' && (
        <ErrorBoundary>
          <Suspense fallback={<ModuleLoader />}>
            <AnnouncementsModule />
          </Suspense>
        </ErrorBoundary>
      )}
      {activeModule === 'documentos' && (
        <ErrorBoundary>
          <Suspense fallback={<ModuleLoader />}>
            <DocumentsModule />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  )

  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className={menuOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">02</span>
          <div>
            <p className="brand-name">SegundoPiso</p>
            <p className="brand-caption">Residencia estudiantil</p>
          </div>
        </div>

        <nav className="main-nav" aria-label="Navegación principal">
          <p className="nav-label">Espacios</p>
          {navigation.map((item) => (
            <button
              className={activeModule === item.key ? 'nav-item nav-item-active' : 'nav-item'}
              key={item.key}
              type="button"
              onClick={() => {
                setActiveModule(item.key)
                setMenuOpen(false)
              }}
              onMouseEnter={() => {
                modulePreloadMap[item.key]?.()
              }}
            >
              <span className="nav-short" aria-hidden="true">{item.short}</span>
              {item.label}
            </button>
          ))}

          {currentRole === 'administrador' || currentRole === 'superadministrador' ? (
            <>
              <p className="nav-label" style={{ marginTop: '16px' }}>Administración</p>
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => setMenuOpen(false)}
                end
              >
                <span className="nav-short" aria-hidden="true">{adminNavigation.short}</span>
                {adminNavigation.label}
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="sidebar-footer">
          <p className="status-dot">
            <span aria-hidden="true" style={{ background: isLocalMode ? '#10b981' : '#3b82f6' }} />
            {isLocalMode ? 'Modo Local (Offline)' : 'Supabase conectado'}
          </p>
          <p style={{ marginTop: '4px' }}>
            Base documental: Carta Interna y Actas del Segundo Piso.
          </p>
          {isLocalMode && (
            <button
              type="button"
              onClick={handleResetSeed}
              style={{
                background: 'transparent',
                border: '1px solid #48443e',
                color: '#b5a99c',
                padding: '5px 8px',
                fontSize: '11px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px',
                width: '100%',
              }}
            >
              Restablecer datos semilla
            </button>
          )}
          {resetMessage && (
            <p style={{ color: '#10b981', fontSize: '10px', marginTop: '6px' }}>{resetMessage}</p>
          )}
        </div>
      </aside>

      {menuOpen && (
        <button
          className="scrim"
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-toggle"
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
          >
            <span /><span /><span />
          </button>

          <div className="breadcrumb">
            <span>SegundoPiso</span>
            <b>/</b>
            {copy.eyebrow}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isLocalMode && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>Simulación Local</span>
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as any)}
                  aria-label="Cambiar rol de prueba"
                  style={{
                    marginLeft: '4px',
                    background: 'white',
                    border: '1px solid #d97706',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#78350f',
                    cursor: 'pointer',
                  }}
                >
                  <option value="usuario">Rol: Residente</option>
                  <option value="administrador">Rol: Administrador</option>
                  <option value="superadministrador">Rol: Superadmin</option>
                </select>
              </div>
            )}

            {!isLocalMode && !user && (
              <NavLink
                to="/signin"
                className="px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 border border-primary/20 rounded-lg transition-colors"
              >
                Iniciar sesión
              </NavLink>
            )}

            {!isLocalMode && user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="text-sm text-gray-600">{profile?.display_name || user.email}</span>
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {profile?.profile_roles?.[0]?.role || 'usuario'}
                </span>
                <button
                  type="button"
                  onClick={signOut}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
</header>

<div className="page-content">
            <Routes>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/admin/*" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/incumplissements" replace />} />
                <Route path="incumplissements" element={<AdminViolationsModule />} />
                <Route path="incumplissements/:id" element={<AdminViolationsModule />} />
                <Route path="incumplissements/:violationId/medidas" element={<AdminMeasuresModule />} />
                <Route path="incumplissements/:violationId/eventos" element={<AdminCaseEventsModule />} />
                <Route path="incumplissements/:violationId/evidencias" element={<AdminCaseEvidenceModule />} />
                <Route path="medidas" element={<AdminMeasuresModule />} />
                <Route path="eventos" element={<AdminCaseEventsModule />} />
                <Route path="evidencias" element={<AdminCaseEvidenceModule />} />
                <Route path="personas" element={<AdminPersonasModule />} />
                <Route path="auditoria" element={<AdminAuditoriaModule />} />
              </Route>

              <Route path="*" element={<MainAppContent />} />
            </Routes>
        </div>
      </main>
    </div>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  )
}
