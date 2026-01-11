import { Badge } from "@/components/ui/badge";
import { IProjectSingleData } from "definations/project";
import { useGetAllFundRequests } from "@/features/programs/controllers/fundRequestController";
import { useMemo } from "react";

type PropsType = {
    data: IProjectSingleData;
};

const Summary = ({ data }: PropsType) => {
    // Fetch all fund requests for this project to get locations involved
    const { data: fundRequestsData } = useGetAllFundRequests({
        project: data.id || "",
        size: 1000,
        enabled: !!data.id,
    });

    // Get unique locations from fund requests
    const locationsInvolved = useMemo(() => {
        const fundRequests = fundRequestsData?.data?.results || [];
        const locationMap = new Map();

        fundRequests.forEach((request: any) => {
            const locationName = typeof request.location === 'object'
                ? request.location.name
                : request.location;
            const locationId = typeof request.location === 'object'
                ? request.location.id
                : request.location;

            if (locationName && !locationMap.has(locationId)) {
                locationMap.set(locationId, locationName);
            }
        });

        return Array.from(locationMap.values());
    }, [fundRequestsData]);

    // Get first fund request to extract month, state, and currency info
    const firstFundRequest = fundRequestsData?.data?.results?.[0];
    const month = firstFundRequest?.month || 'N/A';
    const year = firstFundRequest?.year || '';
    const state = typeof firstFundRequest?.location === 'object'
        ? firstFundRequest.location.state || firstFundRequest.location.name
        : 'N/A';
    const currency = firstFundRequest?.currency || 'NGN';
    const financialYear = typeof firstFundRequest?.financial_year === 'object'
        ? firstFundRequest.financial_year.year
        : firstFundRequest?.financial_year || 'N/A';

    return (
        <div className="space-y-5">
            <div className="grid pb-5 grid-cols-2 gap-5 md:grid-cols-3">
                <div className="space-y-3">
                    <h3 className="font-semibold">Project Name</h3>
                    <p className="text-sm text-gray-500">{data.title}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Project ID</h3>
                    <p className="text-sm text-gray-500">{data.project_id}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">State</h3>
                    <p className="text-sm text-gray-500">{state}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Project Start Date</h3>
                    <p className="text-sm text-gray-500">{data.start_date}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Project End Date</h3>
                    <p className="text-sm text-gray-500">{data.end_date}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Month</h3>
                    <p className="text-sm text-gray-500">{month}/{year}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Currency</h3>
                    <p className="text-sm text-gray-500">{currency}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Financial Year</h3>
                    <p className="text-sm text-gray-500">{financialYear}</p>
                </div>
            </div>

            <hr className="pb-5" />

            <div className="space-y-3">
                <h3 className="font-semibold">State Offices Involved</h3>
                <div className="flex flex-wrap gap-3">
                    {locationsInvolved.length > 0 ? (
                        locationsInvolved.map((location, index) => (
                            <Badge
                                key={index}
                                variant="default"
                                className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
                            >
                                {location}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No locations found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Summary;
