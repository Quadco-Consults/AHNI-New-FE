import { Button } from "components/ui/button";
import { CG_GROUTES } from "constants/RouterConstants";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import ConsultancyCard from "./_components/ConsultancyCard";

export default function Consultancy() {
    return (
        <section className="space-y-5">
            <div className="flex justify-end">
                <Link to={CG_GROUTES.CREATE_CONSULTANCY_DETAILS}>
                    <Button>
                        <Plus size={29} /> New Consultancy
                    </Button>
                </Link>
            </div>
            <div className="w-full flex flex-wrap justify-between items-start gap-y-[1rem]">
                <ConsultancyCard />
                <ConsultancyCard />
                <ConsultancyCard />
                <ConsultancyCard />
            </div>
        </section>
    );
}
