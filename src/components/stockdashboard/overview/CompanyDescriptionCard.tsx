/**
 * src/components/stockdashboard/overview/CompanyDescriptionCard.tsx
 *
 * About the company, executive leadership, and corporate background.
 */

'use client'

import React from 'react'
import { Building2, Users, Calendar, MapPin } from 'lucide-react'
import { CompanyProfile } from '@/src/types/stockdashboard'


export function CompanyDescriptionCard({ profile }: { profile: CompanyProfile }) {
    return (
        <div
            style={{
                background: 'var(--db-surface, #18282C)',
                border: '1px solid var(--db-border, rgba(184, 206, 194, 0.12))',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={16} color="var(--db-mint, #B8CEC2)" />
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', margin: 0 }}>
                    About {profile.name}
                </h3>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--db-text-2, #A5B7B3)', lineHeight: 1.6, margin: 0 }}>
                {profile.description}
            </p>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--db-border, rgba(184, 206, 194, 0.08))',
                }}
            >
                {profile.ceo && (
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>Managing Director &amp; CEO</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', marginTop: '2px' }}>
                            {profile.ceo}
                        </div>
                    </div>
                )}
                {profile.headquarters && (
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>Headquarters</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} color="var(--db-mint, #B8CEC2)" />
                            {profile.headquarters}
                        </div>
                    </div>
                )}
                {profile.foundedYear && (
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>Incorporation Year</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} color="var(--db-mint, #B8CEC2)" />
                            {profile.foundedYear}
                        </div>
                    </div>
                )}
                {profile.employees && (
                    <div>
                        <div style={{ fontSize: '11px', color: 'var(--db-text-muted, #708482)' }}>Workforce</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--db-text, #F7FAF9)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={12} color="var(--db-mint, #B8CEC2)" />
                            {profile.employees.toLocaleString('en-IN')} employees
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
