import { useLocation } from "react-router-dom";

type TJob = "adhoc" | "facilitator" | "consultant";

export default function useJobAdvertType() {
    const { pathname } = useLocation();

    const getTypeFromPath = (path: string): TJob => {
        if (path.includes("adhoc-management")) return "adhoc";
        if (path.includes("facilitator")) return "facilitator";
        return "consultant";
    };

    return getTypeFromPath(pathname);
}
