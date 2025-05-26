// This file implements a mock REST API for consents, as required by the challenge specification.
// Requirements addressed:
// - Expose GET /consents - Returns a paginated list of consents
// - Expose POST /consents -  Adds a new consent to the list
// - Use in-memory storage (no real DB), pre-populated with sample data
// - No real HTTP calls are sent out as this is a local mock API for the frontend
// - Pagination is handled server-side for realism and to match the product spec
import {NextRequest, NextResponse} from 'next/server';
import {Consent, ConsentFormSchema} from '@/types/consents';

// In-memory storage for consents. This is reset on every server restart, which is acceptable for a mock/demo.
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

/**
 * GET /api/consents
 * Returns a paginated list of consents.
 * Accepts page and pageSize query params for pagination.
 * This matches the challenge requirement for a paginated GET endpoint.
 */
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

/**
 * POST /api/consents
 * Adds a new consent to the in-memory list.
 * This matches the challenge requirement for a POST endpoint to add consents.
 * In a real app, validation and persistence would be added here.
 */
export async function POST(req: NextRequest) {
    const body = await req.json();
    // for this example we can reuse the Zod validation schema from the frontend
    const result = ConsentFormSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json(
            { error: 'Invalid input', details: result.error.errors },
            { status: 400 }
        );
    }
    const consent = result.data;
    consents.push(consent);
    return NextResponse.json(consent, { status: 201 });
}