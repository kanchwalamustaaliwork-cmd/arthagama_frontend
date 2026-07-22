'use client'

import type { StrategyCategory } from '@/src/data/admin/stratergy/strategyCategories'

interface CategoryCardProps {
    category: StrategyCategory
    onSelect: (id: string) => void
}

export default function CategoryCard({ category, onSelect }: CategoryCardProps) {
    const Icon = category.icon

    return (
        <div
            onClick={() => onSelect(category.id)}
            style={{
                background: category.gradient,
                border: '1px solid var(--db-border)',
                borderRadius: '16px',
                padding: '32px 28px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative',
                boxShadow: 'var(--db-shadow-sm)',
                overflow: 'hidden',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLElement).style.borderColor = category.hoverBorder;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 24px -10px ${category.glow}, var(--db-shadow-lg)`;
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--db-border)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--db-shadow-sm)';
            }}
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: category.textColor,
                }}
            >
                <Icon size={24} />
            </div>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--db-text)', marginBottom: '8px' }}>
                    {category.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--db-text-muted)', lineHeight: 1.6 }}>
                    {category.description}
                </p>
            </div>
        </div>
    )
}