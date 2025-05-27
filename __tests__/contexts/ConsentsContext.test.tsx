import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ConsentsProvider, useConsentsContext} from '@/contexts/ConsentsContext';
import {getConsents} from '@/services/consents';
import {Consent} from '@/types/consents';

jest.mock('../../services/consents', () => ({
    getConsents: jest.fn(),
}));

function TestComponent() {
    const {
        page,
        total,
        loading,
        error,
        consentsCache,
        setPage,
        refreshAndGoToLastPage,
    } = useConsentsContext();
    const currentConsents = consentsCache[page] || [];

    return (
        <div>
            <div data-testid='page'>{page}</div>
            <div data-testid='total'>{total}</div>
            <div data-testid='loading'>{loading.toString()}</div>
            <div data-testid='error'>{error || ''}</div>
            <div data-testid='consents-count'>{currentConsents.length}</div>
            <button onClick={() => setPage(2)}>Next Page</button>
            <button onClick={refreshAndGoToLastPage}>Refresh</button>
        </div>
    );
}

describe('ConsentsContext', () => {
    const mockConsents: Consent[] = [
        {
            name: 'John Doe',
            email: 'john@example.com',
            consentGivenFor: ['Receive newsletter'],
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('initializes with provided data', () => {
        render(
            <ConsentsProvider
                initialPage={2}
                initialData={{2: mockConsents}}
                initialTotal={5}
            >
                <TestComponent />
            </ConsentsProvider>
        );

        expect(screen.getByTestId('page')).toHaveTextContent('2');
        expect(screen.getByTestId('total')).toHaveTextContent('5');
        expect(screen.getByTestId('consents-count')).toHaveTextContent('1');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('error')).toHaveTextContent('');
    });

    it('fetches new page when setPage is called', async () => {
        (getConsents as jest.Mock).mockResolvedValueOnce({
            data: mockConsents,
            total: 5,
            page: 2,
            pageSize: 2,
        });

        render(
            <ConsentsProvider>
                <TestComponent />
            </ConsentsProvider>
        );

        await userEvent.click(screen.getByText('Next Page'));

        expect(getConsents).toHaveBeenCalledWith(2, 2);

        await waitFor(() => {
            expect(screen.getByTestId('page')).toHaveTextContent('2');
            expect(screen.getByTestId('consents-count')).toHaveTextContent('1');
        });
    });

    it('uses cached data when available', async () => {
        const cachedConsents = [
            ...mockConsents,
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                consentGivenFor: ['Receive newsletter'],
            },
        ];

        render(
            <ConsentsProvider
                initialData={{2: cachedConsents}}
                initialTotal={5}
            >
                <TestComponent />
            </ConsentsProvider>
        );

        await userEvent.click(screen.getByText('Next Page'));

        expect(getConsents).not.toHaveBeenCalled();

        // Verify cached data is used
        expect(screen.getByTestId('page')).toHaveTextContent('2');
        expect(screen.getByTestId('consents-count')).toHaveTextContent('2');
    });

    it('handles API errors', async () => {
        // Mock API error
        (getConsents as jest.Mock).mockRejectedValueOnce(
            new Error('API Error')
        );

        render(
            <ConsentsProvider>
                <TestComponent />
            </ConsentsProvider>
        );

        await userEvent.click(screen.getByText('Next Page'));

        // Verify error state
        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('API Error');
            expect(screen.getByTestId('loading')).toHaveTextContent('false');
        });
    });

    it('refreshes and goes to last page after new consent', async () => {
        // Mock API responses for refresh
        (getConsents as jest.Mock)
            .mockResolvedValueOnce({total: 6}) // First call to get total
            .mockResolvedValueOnce({
                data: [
                    {
                        name: 'New User',
                        email: 'new@example.com',
                        consentGivenFor: ['Receive newsletter'],
                    },
                ],
                total: 6,
                page: 3,
                pageSize: 2,
            });

        render(
            <ConsentsProvider initialTotal={5}>
                <TestComponent />
            </ConsentsProvider>
        );

        await userEvent.click(screen.getByText('Refresh'));

        expect(getConsents).toHaveBeenCalledTimes(2);
        expect(getConsents).toHaveBeenNthCalledWith(1, 1, 2);
        expect(getConsents).toHaveBeenNthCalledWith(2, 3, 2);

        // state updates
        await waitFor(() => {
            expect(screen.getByTestId('page')).toHaveTextContent('3');
            expect(screen.getByTestId('total')).toHaveTextContent('6');
            expect(screen.getByTestId('consents-count')).toHaveTextContent('1');
        });
    });

    it('handles errors during refresh', async () => {
        // Mock API error during refresh
        (getConsents as jest.Mock).mockRejectedValueOnce(
            new Error('Refresh failed')
        );

        render(
            <ConsentsProvider>
                <TestComponent />
            </ConsentsProvider>
        );

        await userEvent.click(screen.getByText('Refresh'));

        // error state
        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent(
                'Refresh failed'
            );
            expect(screen.getByTestId('loading')).toHaveTextContent('false');
        });
    });

    it('maintains loading state during operations', async () => {
        // Mock delayed API response
        (getConsents as jest.Mock).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(
                        () =>
                            resolve({
                                data: mockConsents,
                                total: 5,
                                page: 2,
                                pageSize: 2,
                            }),
                        100
                    )
                )
        );

        render(
            <ConsentsProvider>
                <TestComponent />
            </ConsentsProvider>
        );

        const pageChangePromise = userEvent.click(
            screen.getByText('Next Page')
        );

        await waitFor(() =>
            expect(screen.getByTestId('loading')).toHaveTextContent('true')
        );

        await pageChangePromise;

        // Verify loading state is cleared
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false');
        });
    });
});
