'use client'

import { use } from 'react'
import AdminCustomerDetailPage from '@/src/views/admin/AdminCustomerDetailPage'

interface Props {
    params: Promise<{ customerId: string }>
}

export default function CustomerDetailPage({ params }: Props) {
    const { customerId } = use(params)
    return <AdminCustomerDetailPage customerId={customerId} />
}
