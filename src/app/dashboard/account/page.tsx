export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Account from "@/features/accounts/components/account";
import NoSSR from "components/NoSSR";

export default function AccountPage() {
    return (
        <NoSSR>
            <Account />
        </NoSSR>
    );
}