'use client'

import { SWAL_CONFIRM_COLOR } from '@/lib/utils'
import { IconEdit, IconTrash, IconToggleLeft, IconToggleRight } from '@tabler/icons-react'
import Swal from 'sweetalert2'

interface ActionButtonsProps {
  id: number
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onToggle?: (id: number, currentState: boolean) => void
  toggleState?: boolean
}

export function ActionButtons({
  id,
  onEdit,
  onDelete,
  onToggle,
  toggleState,
}: ActionButtonsProps) {
  const handleDelete = () => {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: SWAL_CONFIRM_COLOR,
      cancelButtonColor: '#514535',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      {onToggle && (
        <button
          onClick={() => onToggle(id, toggleState || false)}
          className={`p-2 transition-colors ${
            toggleState
              ? 'text-whatsapp-green hover:text-whatsapp-green/70'
              : 'text-text-muted hover:text-text-primary'
          }`}
          title={toggleState ? 'Nonaktifkan' : 'Aktifkan'}
        >
          {toggleState ? (
            <IconToggleRight size={20} />
          ) : (
            <IconToggleLeft size={20} />
          )}
        </button>
      )}
      <button
        onClick={() => onEdit(id)}
        className="p-2 text-text-muted hover:text-primary transition-colors"
        title="Ubah"
      >
        <IconEdit size={18} />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 text-text-muted hover:text-accent-red transition-colors"
        title="Hapus"
      >
        <IconTrash size={18} />
      </button>
    </div>
  )
}
