"use client";

import successProcess from "@/assets/imgs/successful.png";
import { Button } from "@/components/ui/button";
import { RouteEnum } from "@/constants/RouterConstants";
import { useRouter } from "next/navigation";

const SuccessModal = () => {
    const router = useRouter();

    const handleCloseDailog = () => {
        router.push(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);
        // Note: Dialog closing logic will need to be handled by parent component
    };

    return (
        <div className="text-center space-y-5">
            <img
                className="mx-auto"
                src={successProcess}
                alt="success"
                width={150}
            />
            <h4>Supportive Supervision Plan has been successfully created</h4>

            <Button onClick={handleCloseDailog}>Back to SSP</Button>
        </div>
    );
};

export default SuccessModal;