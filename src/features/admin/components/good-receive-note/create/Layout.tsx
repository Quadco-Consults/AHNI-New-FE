"use client";

import Card from "@/components/Card";
import { FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GoodReceiveNoteLayoutHeading from "./LayoutHeading";

type IPageProps = {
    children: ReactNode;
};

const GoodReceiveNoteLayout: FC<IPageProps> = ({ children }) => {
    const router = useRouter();

    return (
        <div className="space-y-5">
            {/* Back Button */}
            <Button
                variant='outline'
                onClick={() => router.back()}
                className='flex items-center gap-2'
            >
                <ArrowLeft size={16} />
                Back
            </Button>

            <GoodReceiveNoteLayoutHeading />
            <Card>{children}</Card>
        </div>
    );
};

export default GoodReceiveNoteLayout;
