export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import CreateUsers from "@/features/auth/components/Users/CreateUsers";
import NoSSR from "components/NoSSR";

export default function UsersPage() {
  return (
    <NoSSR>
      <CreateUsers />
    </NoSSR>
  );
}
