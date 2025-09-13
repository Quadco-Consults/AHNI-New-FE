import React from "react";
import DescriptionCard from "components/DescriptionCard";
import FilePreview from "components/FilePreview";
import { Separator } from "components/ui/separator";
import { IConsultantSingleData } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-management";

export default function ScopeOfWork({
    title,
    created_datetime,
    scope_of_work,
}: IConsultantSingleData) {
    // Handle case where scope_of_work is completely undefined
    if (!scope_of_work) {
        return (
            <div className="space-y-10">
                <h1 className="font-bold text-lg">Scope Of Work</h1>
                <div className="text-center py-8">
                    <p className="text-gray-500">No scope of work data available</p>
                </div>
            </div>
        );
    }

    // Destructure with fallbacks to handle undefined fields within scope_of_work
    const {
        description = '',
        background = '',
        objectives = '',
        fee_rate = 0,
        payment_frequency = '',
        location = '',
        deliverables = [],
        advertisement_document = '',
        scope_of_work_document = '',
    } = scope_of_work;

    const totalDays = deliverables.reduce(
        (sum: number, item: { deliverable: string; number_of_days: number }) => 
            sum + (item?.number_of_days || 0),
        0
    );

    return (
        <div className="space-y-10">
            <h1 className="font-bold text-lg">Scope Of Work</h1>

            <DescriptionCard label="Description" description={description} />
            <DescriptionCard label="Background" description={background} />
            <DescriptionCard label="Objectives" description={objectives} />

            <Separator />

            <div className="space-y-4">
                <h2 className="font-bold text-[#DEA004]">
                    Specific Deliverables
                </h2>

                <p className="text-sm text-gray-500">
                    Based on the activities listed above, the Contractor is
                    expected to produced or accomplish the following:
                </p>

                <div className="grid grid-cols-2 gap-6">
                    <h3 className="font-bold">Specific Deliverable</h3>
                    <h3 className="font-bold">Number of Days Required</h3>

                    {deliverables.map(({ deliverable, number_of_days }, index) => (
                        <React.Fragment key={index}>
                            <p>{deliverable}</p>
                            <p>{number_of_days}</p>
                        </React.Fragment>
                    ))}

                    <p className="font-bold">Total</p>
                    <p className="font-bold">{totalDays} Days</p>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h2 className="font-bold text-[#DEA004]">Payment Schedule</h2>

                <p className="text-sm text-gray-500">
                    The fee rate for this work will be paid at the end of every
                    month of assignment upon satisfactory approval by the AHNi
                    Technical Monitor.
                </p>

                <p className="text-red-500">
                    NOTE: 5% With Holding tax (WHT) will be deducted - in line
                    with the regulations
                </p>

                <div className="grid grid-cols-2 gap-5">
                    <DescriptionCard label="Fee Rate" description={fee_rate} />

                    <DescriptionCard
                        label="Payment Frequency"
                        description={payment_frequency}
                    />

                    <DescriptionCard label="Location" description={location} />
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-4 gap-5">
                {scope_of_work_document && (
                    <FilePreview
                        file={scope_of_work_document}
                        name="Scope Of Work Document"
                        timestamp={created_datetime}
                    />
                )}

                {advertisement_document && (
                    <FilePreview
                        file={advertisement_document}
                        name="Advertisement Document"
                        timestamp={created_datetime}
                    />
                )}

                {!scope_of_work_document && !advertisement_document && (
                    <div className="col-span-4 text-center py-8">
                        <p className="text-gray-500">No documents available</p>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="font-bold text-[#DEA004]">
                    Confidential and Proprietary Information
                </h2>

                <p className="text-sm text-gray-500">
                    All information, documents and data resulting from the
                    performance of Contractor's work under this Agreement shall
                    be the sole property of AHNi. Upon termination of Agreement,
                    Contractor agrees to return to AHNi all property and
                    materials within Contractor's possession or control which
                    belong to AHNi or which contain Confidential Information.
                </p>
            </div>
        </div>
    );
}
