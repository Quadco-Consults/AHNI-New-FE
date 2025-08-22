import { useSearchParams } from "next/navigation";

export default function useQuery() {
    return useSearchParams();
}
