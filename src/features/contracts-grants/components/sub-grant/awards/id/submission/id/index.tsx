"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import { CheckCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { useShortlistSubGrantSubmission } from "@/features/contracts-grants/controllers/submissionController";
import OrganizationDetails from "./organization-details";
import SubGrantUploadDetail from "./uploads";

export default function SubGrantSubmissionDetailWithTabs() {
    const [tabValue, setTabValue] = useState("organization");
    const [isShortlisted, setIsShortlisted] = useState(false);

    const params = useParams();
    const submissionId = params?.id as string;

    const { shortlistSubmission, isLoading } = useShortlistSubGrantSubmission(submissionId);

    const handleShortlist = async () => {
        try {
            await shortlistSubmission();
            setIsShortlisted(true);
            toast.success("Submission successfully shortlisted!");
        } catch (error: any) {
            toast.error(error?.data?.message ?? error?.message ?? "Failed to shortlist submission");
        }
    };

    return (
        <div className="w-full flex flex-col gap-y-[3rem] p-4">
            <div className="w-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Submission Details</h1>
                    <div className="flex items-center gap-3">
                        <Link href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/assessment`}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <FileText size={16} />
                                Assessment
                            </Button>
                        </Link>
                        <Button
                            onClick={handleShortlist}
                            disabled={isShortlisted || isLoading}
                            className={`flex items-center gap-2 ${
                                isShortlisted
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            <CheckCircle size={16} />
                            {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                        </Button>
                    </div>
                </div>

                <Tabs
                    value={tabValue}
                    onValueChange={setTabValue}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="organization">
                            Organization Details
                        </TabsTrigger>
                        <TabsTrigger value="uploads">
                            Documents
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="organization">
                            <OrganizationDetails />
                        </TabsContent>

                        <TabsContent value="uploads">
                            <SubGrantUploadDetail />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}