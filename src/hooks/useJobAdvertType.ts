import { usePathname } from "next/navigation";

type TJob = "adhoc" | "facilitator" | "consultant";

export default function useJobAdvertType() {
    const pathname = usePathname();

    const getTypeFromPath = (path: string): TJob => {
        if (path.includes("adhoc-management")) return "adhoc";
        if (path.includes("facilitator")) return "facilitator";
        return "consultant";
    };

    return getTypeFromPath(pathname);
}
