export interface ContactInfoItem {
    id: string
    label: string
    value: string
    href: string
    icon: 'phone' | 'mail' | 'pin'
}

export const CONTACT_INFO: ContactInfoItem[] = [
    {
        id: 'phone',
        label: 'Call Us',
        value: '+91 22 4001 5566',
        href: 'tel:+912240015566',
        icon: 'phone',
    },
    {
        id: 'email',
        label: 'Email Us',
        value: 'info@arthagama.com',
        href: 'mailto:info@arthagama.com',
        icon: 'mail',
    },
    {
        id: 'address',
        label: 'Visit Us',
        value: 'Grd Flr, Khatau BLg 8/10 A D Modi, Stock Exchange, Mumbai',
        href: 'https://maps.app.goo.gl/Ti8B2D6WE6kLK24w8',
        icon: 'pin',
    },
]