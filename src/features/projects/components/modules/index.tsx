"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import FundingList from "./AllFundingSource";
import Beneficiaries from "./AllBeneficiary";
import Partners from "./AllPartner";
import DocumentTypes from "./AllDocumentTypes";

export default function ProjectModules() {
    const router = useRouter();

    return (
        <div>
            <div className="mb-6">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    size="sm"
                    className="gap-2 mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">Project Module Configuration</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Manage project configurations including donors, beneficiaries, partners, and document types
                </p>
            </div>
            <Tabs defaultValue="source">
                <TabsList>
                    <TabsTrigger value="source">Donors</TabsTrigger>
                    <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
                    <TabsTrigger value="type">Document Types</TabsTrigger>
                    <TabsTrigger value="partners">Partners</TabsTrigger>
                </TabsList>
                <TabsContent value="source">
                    <Card className="mt-10 pb-8 px-6">
                        <FundingList />
                    </Card>
                </TabsContent>
                <TabsContent value="beneficiaries">
                    <Beneficiaries />
                </TabsContent>
                <TabsContent value="type">
                    <Card className="mt-10 pb-8 px-6">
                        <DocumentTypes />
                    </Card>
                </TabsContent>
                <TabsContent value="partners">
                    <Card className="mt-10 pb-8 px-6">
                        <Partners />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
