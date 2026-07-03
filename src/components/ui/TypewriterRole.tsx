import { useEffect, useState } from 'react'
import { ROLES } from '../../data/jobs'

export default function TypewriterRole() {
    const [roleIndex, setRoleIndex] = useState(0)
    const [displayed, setDisplayed] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const currentWord = ROLES[roleIndex]
        const speed = deleting ? 40 : 80

        const timeout = setTimeout(() => {
            if (!deleting) {
                if (displayed.length < currentWord.length) {
                    setDisplayed(currentWord.slice(0, displayed.length + 1))
                } else {
                    setTimeout(() => setDeleting(true), 1100)
                }
            } else {
                if (displayed.length > 0) {
                    setDisplayed(displayed.slice(0, -1))
                } else {
                    setDeleting(false)
                    setRoleIndex((i) => (i + 1) % ROLES.length)
                }
            }
        }, speed)

        return () => clearTimeout(timeout)
    }, [displayed, deleting, roleIndex])

    return (
        <span className="font-display italic text-[#EAF1EC]">
            {displayed}
            <span className="typewriter-cursor">|</span>
        </span>
    )
}