import { Suspense } from 'react'
import LoginView from '@/src/views/LoginPage'
import GlobalBackground from '@/src/components/backgrounds/GlobalBackground'

export default function LoginPage() {
    return (
        <>
            <GlobalBackground />
            <Suspense fallback={null}>
                <LoginView />
            </Suspense>
        </>
    )
}
