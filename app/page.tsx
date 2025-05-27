import { getConsents } from '@/services/consents';
import { ConsentsProvider } from '@/contexts/ConsentsContext';
import HomeTabs from '@/components/HomeTabs';

export default async function HomePage() {
    // SSR fetch for the first page of consents to avoid flickering
    const { data, total } = await getConsents(1, 2);

    return (
        <ConsentsProvider initialPage={1} initialData={{ 1: data }} initialTotal={total}>
            <HomeTabs />
        </ConsentsProvider>
    );
}
