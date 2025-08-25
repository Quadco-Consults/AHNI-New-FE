"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import ConsultancyDetails from "./ConsultancyDetails";
import JobDetails from "./JobDetails";
import ScopeOfWork from "./ScopeOfWork";
import ShortlistedApplicants from "./ShortlistedApplicants";
import ApplicantInterview from "./ApplicantInterview";

export default function ConsultantManagementDetails() {
    return (
        <div className="space-y-6">
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="job">Job Details</TabsTrigger>
                    <TabsTrigger value="scope">Scope of Work</TabsTrigger>
                    <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
                    <TabsTrigger value="interview">Interview</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                    <ConsultancyDetails />
                </TabsContent>
                <TabsContent value="job">
                    <JobDetails />
                </TabsContent>
                <TabsContent value="scope">
                    <ScopeOfWork />
                </TabsContent>
                <TabsContent value="shortlisted">
                    <ShortlistedApplicants />
                </TabsContent>
                <TabsContent value="interview">
                    <ApplicantInterview />
                </TabsContent>
            </Tabs>
        </div>
    );
}