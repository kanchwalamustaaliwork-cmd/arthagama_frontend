// Broker directory, colors, and display names matching market disclosures

export interface BrokerMeta {
  id: string
  name: string
  color: string
}

export const BROKER_REGISTRY: Record<string, { name: string; color: string }> = {
  icicidirect: { name: 'ICICI Direct', color: '#EF4444' },
  kotaksec: { name: 'Kotak Sec', color: '#EC4899' },
  hdfcsec: { name: 'HDFC Sec', color: '#3B82F6' },
  zerodha: { name: 'Zerodha', color: '#06B6D4' },
  motilaloswal: { name: 'Motilal Oswal', color: '#14B8A6' },
  bajajbroking: { name: 'Bajaj Broking', color: '#F59E0B' },
  angelone: { name: 'Angel One', color: '#F97316' },
  axisdirect: { name: 'Axis Direct', color: '#E11D48' },
  miraesharekhan: { name: 'Mirae Sharekhan', color: '#10B981' },
  sbisec: { name: 'SBI Sec', color: '#22D3EE' },
  groww: { name: 'Groww', color: '#84CC16' },
  jmfinancial: { name: 'JM Financial', color: '#8B5CF6' },
  nuvama: { name: 'Nuvama', color: '#38BDF8' },
  iifl: { name: 'IIFL Capital', color: '#A855F7' },
  anandrathi: { name: 'Anand Rathi', color: '#34D399' },
  yessec: { name: 'Yes Sec', color: '#059669' },
  globalcapital: { name: 'Global Capital', color: '#94A3B8' },
  geojit: { name: 'Geojit', color: '#D97706' },
  dhan: { name: 'Dhan', color: '#0284C7' },
  standardchartered: { name: 'Std Chartered', color: '#2563EB' },
  smc: { name: 'SMC', color: '#B45309' },
  '5paisa': { name: '5paisa', color: '#EAB308' },
  prabhudas: { name: 'Prabhudas', color: '#BE185D' },
  shareindia: { name: 'Share India', color: '#0D9488' },
  mastercapital: { name: 'Master Capital', color: '#64748B' },
  ashika: { name: 'Ashika', color: '#047857' },
  nirmalbang: { name: 'Nirmal Bang', color: '#DC2626' },
  phillip: { name: 'Phillip', color: '#991B1B' },
  shahinvestors: { name: "Shah Investor's", color: '#CBD5E1' },
  systematixshares: { name: 'Systematix Shares', color: '#F43F5E' },
  adityabirla: { name: 'Aditya Birla', color: '#7DD3FC' },
  arihant: { name: 'Arihant', color: '#EA580C' },
  way2wealth: { name: 'Way2wealth Brokers', color: '#6366F1' },
  sushilfinancial: { name: 'Sushil Financial', color: '#2DD4BF' },
  monarch: { name: 'Monarch', color: '#C084FC' },
  cholamandalam: { name: 'Cholamandalam', color: '#B91C1C' },
  idbi: { name: 'IDBI Capital', color: '#4F46E5' },
  latinmanharlal: { name: 'Latin Manharlal', color: '#F472B6' },
  inventuregrowth: { name: 'Inventure Growth', color: '#FBBF24' },
  swastika: { name: 'Swastika', color: '#A3E635' },
  fyers: { name: 'Fyers', color: '#FB923C' },
  paytmmoney: { name: 'Paytm Money', color: '#0EA5E9' },
  indiabulls: { name: 'Indiabulls', color: '#1E40AF' },
  marwadi: { name: 'Marwadi Shares', color: '#F87171' },
}

const FALLBACK_PALETTE = [
  '#EF4444', '#EC4899', '#3B82F6', '#06B6D4', '#14B8A6',
  '#F59E0B', '#F97316', '#E11D48', '#10B981', '#84CC16',
  '#8B5CF6', '#38BDF8', '#A855F7', '#D97706', '#EAB308',
]

export function getBrokerName(brokerId: string): string {
  const norm = brokerId.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (BROKER_REGISTRY[norm]) return BROKER_REGISTRY[norm].name
  if (brokerId.startsWith('nse_')) {
    return `NSE Member ${brokerId.replace('nse_', '')}`
  }
  return brokerId
    .split(/[_\-\s]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function getBrokerColor(brokerId: string, index: number = 0): string {
  const norm = brokerId.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (BROKER_REGISTRY[norm]) return BROKER_REGISTRY[norm].color
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length]
}

