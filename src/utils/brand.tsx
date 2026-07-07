import React from 'react'

export const BRAND_ON_LIGHT = 'font-bold text-[#244147]'
export const BRAND_ON_DARK = 'font-bold text-[#B8CEC2]'

export function formatBrandWord(word: string, className: string = BRAND_ON_DARK): React.ReactNode {
  if (!word) return ''
  
  // Case-insensitive check if word contains 'arthagama'
  if (!word.toLowerCase().includes('arthagama')) {
    return word
  }

  // Skip if it contains email sign, starts with http/www, or has a domain-like dot pattern
  if (word.includes('@') || word.startsWith('http') || word.startsWith('www') || /\.[a-zA-Z]/.test(word)) {
    return word
  }

  // Split word into prefix, brand match, and suffix using capture groups
  const match = word.match(/^(.*?)(arthagama)(.*)$/i)
  if (match) {
    const [, prefix, , suffix] = match
    return (
      <React.Fragment>
        {prefix}
        <strong className={className}>
          ARTHAGAMA
        </strong>
        {suffix}
      </React.Fragment>
    )
  }

  return word
}

export function formatBrandText(text: string, className: string = BRAND_ON_DARK): React.ReactNode {
  if (!text) return ''
  const words = text.split(' ')
  return words.map((word, i) => (
    <React.Fragment key={i}>
      {i > 0 ? ' ' : ''}
      {formatBrandWord(word, className)}
    </React.Fragment>
  ))
}
