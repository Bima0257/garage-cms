import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { IconBrandWhatsapp, IconArrowLeft } from '@tabler/icons-react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/public'
import type { Product } from '@/types/database.types'
import { safeImageSrc } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch product
  const { data: rawProduct } = await supabase
    .from('products')
    .select('*, product_categories(name)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!rawProduct) {
    notFound()
  }

  const product = rawProduct as Product & { product_categories: { name: string } | null }

  // Fetch related products (same category, excluding current)
  let relatedProducts: Product[] | null = null
  if (product.category_id) {
    const result = await supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .eq('is_active', true)
      .neq('id', product.id)
      .limit(3)
    relatedProducts = result.data as Product[] | null
  }

  // Fetch settings for whatsapp
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single()

  const whatsapp = (settings as unknown as { whatsapp?: string })?.whatsapp

  const stockLabels: Record<string, { label: string; class: string }> = {
    in_stock: { label: 'Tersedia', class: 'text-whatsapp-green' },
    limited: { label: 'Stok Terbatas', class: 'text-primary' },
    out_of_stock: { label: 'Habis', class: 'text-accent-red' },
  }
  const stockInfo = stockLabels[product.stock_status ?? 'in_stock'] || stockLabels.in_stock

  return (
    <div className="pt-32 md:pt-36 pb-20 md:pb-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        {/* Breadcrumb */}
        <Link
          href="/produk"
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6 md:mb-8"
        >
          <IconArrowLeft size={16} />
          Kembali ke Produk
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-[var(--spacing-gutter)]">
          {/* Image */}
          <div className="relative aspect-square bg-surface-card border border-white/10 overflow-hidden">
            <Image
              src={safeImageSrc(product.image)}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.discount_price && product.discount_price < product.price && (
              <span className="absolute top-4 left-4 px-4 py-2 bg-primary text-on-primary font-[var(--font-label-technical)] uppercase">
                DISKON
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            {product.product_categories && (
              <span className="font-[var(--font-label-technical)] text-[10px] px-2 py-1 border border-white/20 text-text-secondary uppercase">
                {product.product_categories.name}
              </span>
            )}

            {/* Title */}
            <h1 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase">
              {product.name}
            </h1>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] uppercase ${stockInfo.class}`}>
                {stockInfo.label}
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.discount_price && product.discount_price < product.price ? (
                <>
                  <span className="font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] text-primary">
                    Rp {product.discount_price.toLocaleString('id-ID')}
                  </span>
                  <span className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-text-muted line-through ml-4">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </>
              ) : (
                <span className="font-[var(--font-headline-md)] text-[var(--font-size-headline-md)] text-primary">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="font-[var(--font-body-lg)] text-[var(--font-size-body-lg)] text-on-surface-variant">
                {product.short_description}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <div className="space-y-4">
                <h3 className="font-[var(--font-label-technical)] text-[var(--font-size-label-technical)] text-primary uppercase">
                  Deskripsi
                </h3>
                <p className="font-[var(--font-body-md)] text-[var(--font-size-body-md)] text-on-surface whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="pt-6">
              {product.stock_status !== 'out_of_stock' ? (
                whatsapp ? (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary text-on-primary font-bold py-4 uppercase flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
                  >
                    <IconBrandWhatsapp size={20} />
                    PESAN VIA WA
                  </a>
                ) : (
                  <button className="w-full bg-primary text-on-primary font-bold py-4 uppercase flex items-center justify-center gap-2">
                    <IconBrandWhatsapp size={20} />
                    HUBUNGI UNTUK HARGA
                  </button>
                )
              ) : (
                <button disabled className="w-full bg-text-muted text-black font-bold py-4 uppercase cursor-not-allowed opacity-50">
                  HABIS
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-[var(--font-headline-lg)] text-[var(--font-size-headline-lg)] uppercase mb-8">
              Related <span className="text-primary">Products</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} whatsapp={whatsapp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
