import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GiveConsentForm from '@/components/GiveConsentForm';
import {addConsent} from '@/services/consents';
import {CONSENT_OPTIONS} from '@/constants/consents';

jest.mock('@/services/consents', () => ({
    addConsent: jest.fn(),
}));

jest.mock('@/contexts/ConsentsContext', () => ({
    useConsentsContext: () => ({
        refreshAndGoToLastPage: jest.fn(),
    }),
    ConsentsProvider: ({children}: {children: React.ReactNode}) => (
        <>{children}</>
    ),
}));

describe('GiveConsentForm', () => {
    const mockOnSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders form fields correctly', () => {
        render(<GiveConsentForm onSuccess={mockOnSuccess} />);

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

        CONSENT_OPTIONS.forEach((option) => {
            expect(screen.getByLabelText(option)).toBeInTheDocument();
        });

        expect(
            screen.getByRole('button', {name: /give consent/i})
        ).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(<GiveConsentForm onSuccess={mockOnSuccess} />);

        const submitButton = screen.getByRole('button', {
            name: /give consent/i,
        });
        expect(submitButton).toBeDisabled();
    });

    it('validates email format', async () => {
        render(<GiveConsentForm onSuccess={mockOnSuccess} />);

        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'invalid-email'
        );
        const submitButton = screen.getByRole('button', {
            name: /give consent/i,
        });
        expect(submitButton).toBeDisabled();
    });

    it('submits form successfully with valid data', async () => {
        // Mock successful API response
        (addConsent as jest.Mock).mockResolvedValueOnce({
            name: 'Test User',
            email: 'test@example.com',
            consentGivenFor: ['Receive newsletter'],
        });

        render(<GiveConsentForm onSuccess={mockOnSuccess} />);

        await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'test@example.com'
        );
        await userEvent.click(screen.getByLabelText('Receive newsletter'));

        const submitButton = screen.getByRole('button', {
            name: /give consent/i,
        });
        await userEvent.click(submitButton);

        expect(addConsent).toHaveBeenCalledWith({
            name: 'Test User',
            email: 'test@example.com',
            consentGivenFor: ['Receive newsletter'],
        });
        expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('disables submit button while submitting', async () => {
        // Mock delayed API response
        (addConsent as jest.Mock).mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
        );

        render(<GiveConsentForm onSuccess={mockOnSuccess} />);

        await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'test@example.com'
        );
        await userEvent.click(screen.getByLabelText('Receive newsletter'));

        const submitButton = screen.getByRole('button', {
            name: /give consent/i,
        });
        await userEvent.click(submitButton);

        // Wait for the button to become disabled
        await waitFor(() => expect(submitButton).toBeDisabled());
    });

    it('handles multiple consent selections', async () => {
        render(<GiveConsentForm onSuccess={mockOnSuccess} />);

        await userEvent.type(screen.getByLabelText(/name/i), 'Test User');
        await userEvent.type(
            screen.getByLabelText(/email address/i),
            'test@example.com'
        );

        await userEvent.click(screen.getByLabelText('Receive newsletter'));
        await userEvent.click(screen.getByLabelText('Be shown targeted ads'));

        await userEvent.click(
            screen.getByRole('button', {name: /give consent/i})
        );

        expect(addConsent).toHaveBeenCalledWith(
            expect.objectContaining({
                consentGivenFor: expect.arrayContaining([
                    'Receive newsletter',
                    'Be shown targeted ads',
                ]),
            })
        );
    });
});
