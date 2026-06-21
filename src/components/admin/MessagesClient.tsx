'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IconMail, IconCheck, IconTrash, IconX, IconMail as IconEmail, IconPhone, IconCalendar } from '@tabler/icons-react'
import type { ContactMessage } from '@/types/database.types'

interface MessagesClientProps {
  initialMessages: ContactMessage[]
}

export function MessagesClient({ initialMessages }: MessagesClientProps) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMessage(null)
    }
    if (selectedMessage) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [selectedMessage])

  function openMessage(message: ContactMessage) {
    setSelectedMessage(message)
    if (!message.is_read) {
      handleMarkRead(message.id)
    }
  }

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
                onClick={() => openMessage(message)}
                className={`p-6 hover:bg-surface-elevated transition-colors cursor-pointer ${!message.is_read ? 'bg-surface-card' : ''}`}
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
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(message.id) }}
                        className="p-2 text-whatsapp-green hover:text-whatsapp-green/70 transition-colors"
                        title="Tandai dibaca"
                      >
                        <IconCheck size={18} />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(message.id) }}
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
                <p className="mt-2 text-text-secondary whitespace-pre-wrap line-clamp-2">{message.message}</p>
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

      {selectedMessage && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === overlayRef.current && setSelectedMessage(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto bg-surface-card border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-surface-card border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] uppercase">
                Detail Pesan
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-text-muted hover:text-white transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-surface-elevated flex items-center justify-center font-bold text-primary border border-outline-variant text-2xl">
                  {selectedMessage.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary text-lg">{selectedMessage.name}</h4>
                  <div className="flex items-center gap-1 text-text-muted text-sm mt-1">
                    <IconCalendar size={14} />
                    <span>
                      {new Date(selectedMessage.created_at ?? '').toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedMessage.email && (
                  <div className="flex items-center gap-3 p-4 bg-surface border border-outline-variant">
                    <IconEmail size={18} className="text-text-muted shrink-0" />
                    <div>
                      <p className="text-xs text-text-muted uppercase font-[var(--font-label-technical)]">Email</p>
                      <p className="text-sm text-text-primary">{selectedMessage.email}</p>
                    </div>
                  </div>
                )}
                {selectedMessage.phone && (
                  <div className="flex items-center gap-3 p-4 bg-surface border border-outline-variant">
                    <IconPhone size={18} className="text-text-muted shrink-0" />
                    <div>
                      <p className="text-xs text-text-muted uppercase font-[var(--font-label-technical)]">Telepon</p>
                      <p className="text-sm text-text-primary">{selectedMessage.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject */}
              {selectedMessage.subject && (
                <div>
                  <p className="text-xs text-text-muted uppercase font-[var(--font-label-technical)] mb-1">Subjek</p>
                  <p className="font-semibold text-text-primary">{selectedMessage.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <p className="text-xs text-text-muted uppercase font-[var(--font-label-technical)] mb-2">Pesan</p>
                <div className="p-4 bg-surface border border-outline-variant whitespace-pre-wrap text-text-secondary text-sm leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-surface-card border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              {!selectedMessage.is_read && (
                <button
                  onClick={() => { handleMarkRead(selectedMessage.id); setSelectedMessage({ ...selectedMessage, is_read: true }) }}
                  className="px-4 py-2 text-whatsapp-green border border-whatsapp-green font-[var(--font-label-technical)] text-xs uppercase hover:bg-whatsapp-green/10 transition-colors"
                >
                  Tandai Dibaca
                </button>
              )}
              <button
                onClick={() => { handleDelete(selectedMessage.id); setSelectedMessage(null) }}
                className="px-4 py-2 text-accent-red border border-accent-red font-[var(--font-label-technical)] text-xs uppercase hover:bg-accent-red/10 transition-colors"
              >
                Hapus
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-primary text-on-primary font-[var(--font-label-technical)] text-xs uppercase hover:bg-primary-container transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
