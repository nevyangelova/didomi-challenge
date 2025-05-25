import {useState} from 'react';

const CONSENT_OPTIONS = [
    'Receive newsletter',
    'Be shown targeted ads',
    'Contribute to anonymous visit statistics',
];

export default function GiveConsentForm({onSuccess}: {onSuccess: () => void}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [consents, setConsents] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleCheckbox = (option: string) => {
        setConsents((prev) =>
            prev.includes(option)
                ? prev.filter((c) => c !== option)
                : [...prev, option]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await fetch('/api/consents', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, consentGivenFor: consents}),
        });
        setSubmitting(false);
        onSuccess();
    };

    const isValid = name && email && consents.length > 0;

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 24,
                maxWidth: 400,
            }}
        >
            <h2>Give Consent</h2>
            <div style={{display: 'flex', gap: 8, marginBottom: 16}}>
                <input
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{flex: 1, padding: 8}}
                    required
                />
                <input
                    type='email'
                    placeholder='Email address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{flex: 1, padding: 8}}
                    required
                />
            </div>
            <div style={{marginBottom: 8}}>I agree to:</div>
            <div
                style={{
                    border: '1px solid #bbb',
                    borderRadius: 6,
                    padding: 12,
                    marginBottom: 16,
                }}
            >
                {CONSENT_OPTIONS.map((option) => (
                    <div key={option}>
                        <label>
                            <input
                                type='checkbox'
                                checked={consents.includes(option)}
                                onChange={() => handleCheckbox(option)}
                            />{' '}
                            {option}
                        </label>
                    </div>
                ))}
            </div>
            <button
                type='submit'
                disabled={!isValid || submitting}
                style={{
                    background: '#0094ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '12px 32px',
                    fontWeight: 600,
                    fontSize: 18,
                    cursor: isValid && !submitting ? 'pointer' : 'not-allowed',
                    width: '100%',
                }}
            >
                Give consent
            </button>
        </form>
    );
}
