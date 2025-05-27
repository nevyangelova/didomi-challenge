// Service abstraction for consent-related API calls.
// This layer centralizes all HTTP requests related to consents, providing a single source of truth for data fetching and mutation.
// Separation of concerns: Keeps API logic out of UI components.
// Reusability: Functions here can be reused across multiple components, hooks, or even server-side code.
// Maintainability: If the API changes, you only need to update this file.
// Testability: Easier to mock API calls in tests by mocking this service layer.
// Scalability: As the app grows, data access is consistent.

import {Consent} from '@/types/consents';
export type {Consent} from '@/types/consents';

/**
 * Fetches a paginated list of consents from the API.
 * @param page - The page number to fetch (default: 1)
 * @param pageSize - The number of items per page (default: 2)
 * @returns An object containing the data, total count, current page, and page size.
 * Throws an error if the request fails.
 */
export async function getConsents(
    page = 1,
    pageSize = 2
): Promise<{
    data: Consent[];
    total: number;
    page: number;
    pageSize: number;
}> {
    const res = await fetch(`http://localhost:3000/api/consents?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error('Failed to fetch consents');
    return res.json();
}

/**
 * Adds a new consent by sending a POST request to the API.
 * @param consent - The consent object to add.
 * @returns The created consent object as returned by the API.
 * Throws an error if the request fails.
 */
export async function addConsent(consent: Consent): Promise<Consent> {
    const res = await fetch('http://localhost:3000/api/consents', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(consent),
    });
    if (!res.ok) throw new Error('Failed to add consent');
    return res.json();
}
