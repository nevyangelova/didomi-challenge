import {NextRequest, NextResponse} from 'next/server';

export type Consent = {
    name: string;
    email: string;
    consentGivenFor: string[];
};

let consents: Consent[] = [
    {
        name: 'Bojack Horseman',
        email: 'bojack@horseman.com',
        consentGivenFor: ['Receive newsletter', 'Be shown targeted ads'],
    },
    {
        name: 'Princess Carolyn',
        email: 'princess@manager.com',
        consentGivenFor: ['Receive newsletter'],
    },
    {
        name: 'Diane Nguyen',
        email: 'diane@writer.com',
        consentGivenFor: [
            'Receive newsletter',
            'Contribute to anonymous visit statistics',
        ],
    },
    {
        name: 'Mr. Peanutbutter',
        email: 'mrpb@dog.com',
        consentGivenFor: ['Be shown targeted ads'],
    },
    {
        name: 'Todd Chavez',
        email: 'todd@chavez.com',
        consentGivenFor: ['Receive newsletter', 'Be shown targeted ads'],
    },
    {
        name: 'Sarah Lynn',
        email: 'sarah@lynn.com',
        consentGivenFor: ['Contribute to anonymous visit statistics'],
    },
];

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '2', 10);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = consents.slice(start, end);
    return NextResponse.json({
        data,
        total: consents.length,
        page,
        pageSize,
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const consent: Consent = {
        name: body.name,
        email: body.email,
        consentGivenFor: body.consentGivenFor,
    };
    consents.push(consent);
    return NextResponse.json(consent, {status: 201});
}
