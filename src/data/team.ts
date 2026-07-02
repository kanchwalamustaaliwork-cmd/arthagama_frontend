export interface TeamMember {
    id: string
    name: string
    designation: string
    photo: string
    linkedin: string
    intro: string
    specialization: string
    role: string
}

export const TEAM: TeamMember[] = [
    {
        id: 'harsh-dani',
        name: 'Harsh Dani',
        designation: 'Founder',
        photo: 'https://i.pravatar.cc/500?img=12',
        linkedin: 'https://linkedin.com/in/',
        intro:
            'Harsh Dani founded Arthagama with the vision of building technology-driven, rule-based investment solutions for modern financial markets.',
        specialization:
            'Algorithmic trading, quantitative research, business strategy',
        role:
            'Leads the overall vision of the company, driving strategy development, research initiatives, and long-term business growth.',
    },
    {
        id: 'harish-shah',
        name: 'Harish Shah',
        designation: 'Founder',
        photo: 'https://i.pravatar.cc/500?img=47',
        linkedin: 'https://linkedin.com/in/',
        intro:
            'Harish Shah co-leads the organization with a strong focus on strategic planning and operational excellence.',
        specialization:
            'Business operations, investment strategy, leadership',
        role:
            'Oversees company operations, strategic initiatives, and ensures sustainable growth across all business functions.',
    },
    {
        id: 'om-aditya-pandey',
        name: 'Om Aditya Pandey',
        designation: 'Co-Founder',
        photo: 'https://i.pravatar.cc/500?img=33',
        linkedin: 'https://linkedin.com/in/',
        intro:
            'Om Aditya Pandey contributes to the technical and strategic direction of Arthagama, helping transform innovative ideas into scalable solutions.',
        specialization:
            'Technology strategy, software architecture, product development',
        role:
            'Works closely with the founding team to design scalable technology solutions and expand the company\'s product offerings.',
    },
    {
        id: 'hussain-chill',
        name: 'Hussain Chill',
        designation: 'Co-Founder',
        photo: 'https://i.pravatar.cc/500?img=45',
        linkedin: 'https://linkedin.com/in/',
        intro:
            'Hussain Chill plays a key role in shaping Arthagama\'s business direction and technology initiatives.',
        specialization:
            'Business development, technology, operations',
        role:
            'Supports strategic decision-making while contributing to the growth of products, partnerships, and company operations.',
    },
    {
        id: 'samayk',
        name: 'Samayk',
        designation: 'Co-Founder',
        photo: 'https://i.pravatar.cc/500?img=51',
        linkedin: 'https://linkedin.com/in/',
        intro:
            'Samayk focuses on expanding Arthagama\'s vision through innovation, collaboration, and technology-driven solutions.',
        specialization:
            'Innovation, strategic planning, product vision',
        role:
            'Collaborates with the leadership team to build scalable products and strengthen the company\'s long-term roadmap.',
    },
    {
        id: 'mohit-tiwari',
        name: 'Mohit Tiwari',
        designation: 'Software Engineer',
        photo: 'https://i.pravatar.cc/500?img=32',
        linkedin: 'https://linkedin.com/in/',
        intro:
            'Mohit develops reliable software systems that power Arthagama\'s trading platform and internal tools.',
        specialization:
            'Full-stack development, backend systems, software engineering',
        role:
            'Builds and maintains scalable applications, backend services, and technology infrastructure supporting the company.',
    },
    {
        id: 'mustaali-kanchwala',
        name: 'Mustaali Kanchwala',
        designation: 'Software Engineer Intern',
        photo: 'https://i.pravatar.cc/500?img=15',
        linkedin: 'https://linkedin.com/in/',
        intro:
            'Mustaali contributes to frontend and backend development while gaining hands-on experience building modern fintech applications.',
        specialization:
            'React, Next.js, FastAPI, UI development, web technologies',
        role:
            'Assists in developing new features, improving user experience, maintaining applications, and supporting the engineering team.',
    },
]