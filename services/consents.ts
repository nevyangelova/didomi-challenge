export type Consent = {
    name: string;
    email: string;
    consentGivenFor: string[];
};

export async function getConsents(
    page = 1,
    pageSize = 2
): Promise<{
    data: Consent[];
    total: number;
    page: number;
    pageSize: number;
}> {
    const res = await fetch(`/api/consents?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) throw new Error('Failed to fetch consents');
    return res.json();
}

export async function addConsent(consent: Consent): Promise<Consent> {
    const res = await fetch('/api/consents', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(consent),
    });
    if (!res.ok) throw new Error('Failed to add consent');
    return res.json();
}
