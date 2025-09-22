import BackNavigation from "components/atoms/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import PartnerSubmissionDetails from "./organization-details";
import SubGrantUploadDetail from "./uploads";
import { Button } from "components/ui/button";
import { generatePath, Link, useParams } from "react-router-dom"; 
import { CG_ROUTES } from "constants/RouterConstants";

export default function PartnerSubmissionDetailsWrapper() {
    const { subGrantId, partnerSubId } = useParams();

    return (
        <Tabs defaultValue="details" className="space-y-5">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <BackNavigation />

                    <TabsList>
                        <TabsTrigger value="details">
                            Organization Details
                        </TabsTrigger>

                        <TabsTrigger value="uploads">
                            Document Uploads
                        </TabsTrigger>
                    </TabsList>
                </div>

                <Link
                    href={generatePath(CG_ROUTES.START_PRE_AWARD_ASSESSMENT, {
                        subGrantId,
                        partnerSubId,
                    })}
                >
                    <Button>Start Prequalification</Button>
                </Link>
            </header>

            <main>
                <TabsContent value="details">
                    <PartnerSubmissionDetails />
                </TabsContent>

                <TabsContent value="uploads">
                    <SubGrantUploadDetail />
                </TabsContent>
            </main>
        </Tabs>
    );
}
