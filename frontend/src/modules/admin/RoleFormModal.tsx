import { Button, Select, Modal } from '@components/ui'

interface RoleFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => Promise<void>
  roleToAdd: 'usuario' | 'administrador' | 'superadministrador'
  setRoleToAdd: (role: 'usuario' | 'administrador' | 'superadministrador') => void
  roles: { value: string; label: string }[]
}

export function RoleFormModal({
  isOpen,
  onClose,
  onSubmit,
  roleToAdd,
  setRoleToAdd,
  roles,
}: RoleFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Añadir rol a persona"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <Select
            label="Rol a añadir *"
            options={roles}
            value={roleToAdd}
            onChange={(e) => setRoleToAdd(e.target.value as any)}
            required
          />
        </div>

        <p className="text-sm text-gray-500">
          La persona recibirá los permisos correspondientes a este rol.
          Los cambios surten efecto inmediato.
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>
            Añadir rol
          </Button>
        </div>
      </div>
    </Modal>
  )
}