import { Suspense } from 'react'
import SignUpView from '@/src/views/SignUpPage'
import GlobalBackground from '@/src/components/backgrounds/GlobalBackground'

export default function SignUpPage() {
    return (
        <>
            <GlobalBackground />
            <Suspense fallback={null}>
                <SignUpView />
            </Suspense>
        </>
    )
}

