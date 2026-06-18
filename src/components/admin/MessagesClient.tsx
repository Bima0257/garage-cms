'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconMail, IconCheck, IconTrash } from '@tabler/icons-react'
import type { ContactMessage } from '@/types/database.types'

interface MessagesClientProps {
  initialMessages: ContactMessage[]
}

export function MessagesClient({ initialMessages }: MessagesClientProps) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)

  async function handleMarkRead(id: number) {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: 'PUT',
      })
      if (!response.ok) throw new Error('Gagal menandai dibaca')
      router.refresh()
      setMessages(messages.map((m) => m.id === id ? { ...m, is_read: true } : m))
    } catch {
      alert('Gagal menandai dibaca')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Yakin ingin menghapus pesan ini?')) return
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Gagal menghapus')
      router.refresh()
      setMessages(messages.filter((m) => m.id !== id))
    } catch {
      alert('Gagal menghapus pesan')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
            Messages
          </h2>
          <p className="text-text-muted text-sm mt-1">
            {messages.filter((m) => !m.is_read).length} pesan belum dibaca
          </p>
        </div>
      </div>

      <div className="bg-surface-card border border-outline-variant">
        <div className="divide-y divide-outline-variant/30">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-6 hover:bg-surface-elevated transition-colors ${!message.is_read ? 'bg-surface-card' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-surface-elevated flex items-center justify-center font-bold text-primary border border-outline-variant text-lg">
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-text-primary">{message.name}</p>
                        {!message.is_read && (
                          <span className="px-2 py-0.5 bg-primary-container text-on-primary-container text-[10px] font-bold uppercase">
                            Baru
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-muted">{message.email || message.phone}</p>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(message.created_at ?? '').toLocaleDateString('id-ID', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!message.is_read && (
                      <button
                        onClick={() => handleMarkRead(message.id)}
                        className="p-2 text-whatsapp-green hover:text-whatsapp-green/70 transition-colors"
                        title="Tandai dibaca"
                      >
                        <IconCheck size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="p-2 text-text-muted hover:text-accent-red transition-colors"
                        title="Hapus"
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                </div>
                {message.subject && (
                  <p className="mt-4 font-semibold text-text-primary">{message.subject}</p>
                )}
                <p className="mt-2 text-text-secondary whitespace-pre-wrap">{message.message}</p>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <IconMail size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-muted">Belum ada pesan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
