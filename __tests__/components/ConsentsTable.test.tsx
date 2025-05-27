import {render, screen} from '@testing-library/react';
import ConsentsTable from '@/components/ConsentsTable';
import {Consent} from '@/types/consents';
import useMediaQuery from '@mui/material/useMediaQuery';

jest.mock('@mui/material/useMediaQuery', () => jest.fn());

describe('ConsentsTable', () => {
    const mockConsents: Consent[] = [
        {
            name: 'BoJack Horseman',
            email: 'bojack@hollywood.com',
            consentGivenFor: ['Receive newsletter', 'Be shown targeted ads'],
        },
        {
            name: 'Princess Carolyn',
            email: 'princess.carolyn@vim.com',
            consentGivenFor: ['Receive newsletter'],
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useMediaQuery as jest.Mock).mockReturnValue(false);
    });

    it('renders table headers correctly', () => {
        render(<ConsentsTable consents={mockConsents} />);

        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Consent given for')).toBeInTheDocument();
    });

    it('renders consent data correctly', () => {
        render(<ConsentsTable consents={mockConsents} />);

        expect(screen.getByText('BoJack Horseman')).toBeInTheDocument();
        expect(screen.getByText('bojack@hollywood.com')).toBeInTheDocument();
        expect(
            screen.getByText('Receive newsletter, Be shown targeted ads')
        ).toBeInTheDocument();

        expect(screen.getByText('Princess Carolyn')).toBeInTheDocument();
        expect(screen.getByText('princess.carolyn@vim.com')).toBeInTheDocument();
        expect(screen.getByText('Receive newsletter')).toBeInTheDocument();
    });

    it('renders empty state correctly', () => {
        render(<ConsentsTable consents={[]} />);

        const rowgroups = screen.getAllByRole('rowgroup');
        const tbody = rowgroups[1];
        expect(tbody).toBeInTheDocument();
        expect(tbody.childElementCount).toBe(0);
    });

    it('hides email column on mobile', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true);

        render(<ConsentsTable consents={mockConsents} />);

        // Email column should not be visible
        expect(screen.queryByText('Email')).not.toBeInTheDocument();
        expect(screen.queryByText('bojack@hollywood.com')).not.toBeInTheDocument();
        expect(screen.queryByText('princess.carolyn@vim.com')).not.toBeInTheDocument();

        // Other columns should still be visible
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Consent given for')).toBeInTheDocument();
    });

    it('maintains table structure with varying content lengths', () => {
        const variedConsents: Consent[] = [
            {
                name: 'Diane Nguyen',
                email: 'diane@girlcroosh.com',
                consentGivenFor: ['One consent'],
            },
            {
                name: 'Mr. Peanutbutter',
                email: 'mr.peanutbutter@msnbc.com',
                consentGivenFor: [
                    'First consent',
                    'Second consent',
                    'Third consent',
                ],
            },
        ];

        render(<ConsentsTable consents={variedConsents} />);

        // All content should be visible and properly formatted
        expect(screen.getByText('Diane Nguyen')).toBeInTheDocument();
        expect(
            screen.getByText('Mr. Peanutbutter')
        ).toBeInTheDocument();
        expect(screen.getByText('diane@girlcroosh.com')).toBeInTheDocument();
        expect(
            screen.getByText('mr.peanutbutter@msnbc.com')
        ).toBeInTheDocument();
        expect(screen.getByText('One consent')).toBeInTheDocument();
        expect(
            screen.getByText('First consent, Second consent, Third consent')
        ).toBeInTheDocument();
    });
});
