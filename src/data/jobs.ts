import type { JobListing } from '../types/careers'
import type { Point } from '../types/careers'

export const CULTURE_POINTS: Point[] = [
    {
        title: 'Research-first',
        body: 'Every decision is backed by data, rigorous testing, and continuous experimentation—not intuition. We validate ideas before they ever reach production.',
    },
    {
        title: 'Small, focused teams',
        body: 'Work in lean, collaborative teams where every voice matters. Fewer layers mean faster decisions, quicker execution, and greater impact.',
    },
    {
        title: 'Ownership from day one',
        body: 'Whether you are an intern or an experienced engineer, you build real features, solve meaningful problems, and see your work deployed to production.',
    },
    {
        title: 'Calm under pressure',
        body: 'Financial markets move quickly, but our approach remains disciplined. We rely on robust systems, thoughtful risk management, and clear decision-making.',
    },
]

// Typewriter effect — cycles through roles
export const ROLES = ['research', 'engineering', 'risk', 'markets']

export const STATIC_JOBS: JobListing[] = [
    {
        id: 'quant-researcher-01',
        title: 'Quantitative Researcher',
        type: 'full-time',
        department: 'research',
        location: 'Mumbai · On-site',
        postedDaysAgo: 3,
        summary:
            'Design and validate statistical models that power our systematic trading strategies, from hypothesis through live deployment.',
        responsibilities: [
            'Research and backtest new alpha signals across equities and derivatives',
            'Collaborate with the engineering team to move validated models into production',
            'Monitor live strategy performance and iterate based on real-market results',
        ],
        requirements: [
            "Bachelor's or Master's in a quantitative field (Math, Stats, CS, Engineering)",
            'Strong Python skills; familiarity with pandas, numpy, statistical modeling',
            '1-3 years of experience in quantitative finance or a related research role',
        ],
    },
    {
        id: 'backend-engineer-02',
        title: 'Backend Engineer — Trading Infrastructure',
        type: 'full-time',
        department: 'engineering',
        location: 'Mumbai · On-site',
        postedDaysAgo: 6,
        summary:
            'Build and maintain the low-latency systems that connect our strategies directly to broker APIs and exchanges.',
        responsibilities: [
            'Design resilient, low-latency order routing and execution systems',
            'Own uptime and performance of core trading infrastructure',
            'Build monitoring and alerting for live strategy health',
        ],
        requirements: [
            '3+ years building production backend systems (Go, Rust, or C++ preferred)',
            'Experience with distributed systems and low-latency networking',
            'Comfort working directly with exchange/broker APIs is a plus',
        ],
    },
    {
        id: 'risk-analyst-03',
        title: 'Risk Analyst',
        type: 'full-time',
        department: 'finance',
        location: 'Mumbai · On-site',
        postedDaysAgo: 10,
        summary:
            'Monitor live risk exposure across our strategy book and help design the frameworks that keep every strategy within limits.',
        responsibilities: [
            'Track real-time exposure, drawdown, and concentration risk across strategies',
            'Build and refine circuit-breaker and position-sizing frameworks',
            'Prepare risk reporting for internal and client review',
        ],
        requirements: [
            'Background in finance, economics, or a quantitative discipline',
            'Understanding of portfolio risk concepts (VaR, drawdown, correlation)',
            'Comfortable working with data in Excel/SQL/Python',
        ],
    },
    {
        id: 'ops-associate-04',
        title: 'Operations Associate',
        type: 'full-time',
        department: 'operations',
        location: 'Mumbai · On-site',
        postedDaysAgo: 14,
        summary: 'Keep the day-to-day of a systematic trading firm running smoothly — from reconciliation to client reporting.',
        responsibilities: [
            'Handle daily trade reconciliation across broker accounts',
            'Support client onboarding and reporting workflows',
            'Coordinate with engineering and compliance on operational issues',
        ],
        requirements: [
            "Bachelor's degree, ideally in finance, commerce, or business",
            'Highly organized with strong attention to detail',
            'Comfortable in a fast-paced, small-team environment',
        ],
    },
    {
        id: 'quant-intern-05',
        title: 'Quantitative Research Intern',
        type: 'internship',
        department: 'research',
        location: 'Mumbai · On-site',
        postedDaysAgo: 1,
        summary:
            'A hands-on internship researching and backtesting trading signals alongside our research team.',
        responsibilities: [
            'Assist in backtesting and validating new strategy ideas',
            'Build tooling to speed up the research-to-deployment pipeline',
            'Present findings in weekly research reviews',
        ],
        requirements: [
            'Currently pursuing a degree in a quantitative field',
            'Working knowledge of Python and basic statistics',
            'Available for a minimum 3-month commitment',
        ],
    },
    {
        id: 'swe-intern-06',
        title: 'Software Engineering Intern',
        type: 'internship',
        department: 'engineering',
        location: 'Mumbai · On-site',
        postedDaysAgo: 2,
        summary: 'Work directly with our infrastructure team on real systems that power live trading.',
        responsibilities: [
            'Ship small, well-scoped features to internal trading tools',
            'Write tests and documentation for systems you touch',
            'Pair with senior engineers on infrastructure projects',
        ],
        requirements: [
            'Currently pursuing a degree in CS or a related field',
            'Comfortable with at least one of: Python, Go, TypeScript',
            'Available for a minimum 3-month commitment',
        ],
    },
]