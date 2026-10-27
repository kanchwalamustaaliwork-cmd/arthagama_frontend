/**
 * src/components/indices/IndexDisclaimer.tsx
 *
 * Mock data disclaimer banner.
 */

import { Info } from 'lucide-react'

export default function IndexDisclaimer({ text }: { text?: string }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: 'var(--db-radius-md)',
                background: 'rgba(95, 175, 215, 0.08)',
                border: '1px solid rgba(95, 175, 215, 0.2)',
                color: 'var(--db-text-2)',
                fontSize: '12.5px',
                lineHeight: 1.5,
            }}
        >
            <Info size={16} color="var(--db-info)" style={{ flexShrink: 0 }} />
            <span>
                {text ||
                    'Illustrative Mock Data: Displayed index values, constituent weights, and historical returns are simulated for development demonstration and do not represent verified production index figures.'}
            </span>
        </div>
    )
}
