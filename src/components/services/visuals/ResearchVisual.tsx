// components/services/visuals/ResearchVisual.tsx
"use client"

import { useLoop } from '../../../hooks/useLoop'
import { HEADLINES, BARS } from '@/src/data/visuals'


export default function ResearchVisual() {
    const headline = useLoop(HEADLINES, 3600)

    return (
        <div className="research-visual flex h-full flex-col justify-center gap-6 p-6 sm:gap-7 sm:p-8">
            <div className="doc-line h-2 w-24 rounded-full bg-[#B8CEC2]/40" />
            <div className="min-h-10 text-base font-medium text-[#EAF1EC] transition-opacity duration-500 sm:text-lg">
                {headline}
            </div>
            <div className="flex items-end gap-2.5" style={{ height: '96px' }}>
                {BARS.map((h, idx) => (
                    <div
                        key={idx}
                        className="bar-rise flex-1 rounded-t-sm bg-[#B8CEC2]/50"
                        style={{ height: `${h * 1.3}px`, animationDelay: `${idx * 0.08}s` }}
                    />
                ))}
            </div>
            <div className="flex flex-col gap-2">
                <div className="doc-line h-1.5 w-full rounded-full bg-[#DCE7E1]/15" />
                <div className="doc-line h-1.5 w-5/6 rounded-full bg-[#DCE7E1]/15" />
                <div className="doc-line h-1.5 w-2/3 rounded-full bg-[#DCE7E1]/15" />
            </div>

            <style>{`
        .research-visual { background: rgba(10, 20, 20, 0.4); }
        .bar-rise {
          transform-origin: bottom;
          animation: rise 2.4s ease-in-out infinite alternate;
        }
        @keyframes rise {
          from { transform: scaleY(0.7); opacity: 0.6; }
          to { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
        </div>
    )
}