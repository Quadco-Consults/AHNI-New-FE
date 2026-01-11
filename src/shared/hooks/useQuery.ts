import { useSearchParams } from "next/navigation";

export default function useUrlQuery() {
    return useSearchParams();
}
