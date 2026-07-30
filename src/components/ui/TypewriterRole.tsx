import { useEffect, useState } from 'react'
import { ROLES } from '../../data/jobs'

interface TypewriterRoleProps {
  roles?: string[]
}

export default function TypewriterRole({ roles }: TypewriterRoleProps) {
    const roleList = roles && roles.length > 0 ? roles : ROLES
    const [roleIndex, setRoleIndex] = useState(0)
    const [displayed, setDisplayed] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const currentWord = roleList[roleIndex % roleList.length] || 'Engineering'
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
                    setRoleIndex((i) => (i + 1) % roleList.length)
                }
            }
        }, speed)

        return () => clearTimeout(timeout)
    }, [displayed, deleting, roleIndex, roleList])

    return (
        <span className="font-display italic text-[#EAF1EC]">
            {displayed}
            <span className="typewriter-cursor">|</span>
        </span>
    )
}