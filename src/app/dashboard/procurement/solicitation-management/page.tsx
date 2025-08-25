"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SolicitationManagementPage() {
    const router = useRouter();
    
    useEffect(() => {
        // Redirect to RFQ as default
        router.push("/dashboard/procurement/solicitation-management/rfq");
    }, [router]);
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Solicitation Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6 border rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Request for Quotation (RFQ)</h2>
                    <p className="text-gray-600 mb-4">Manage quotation requests and responses</p>
                    <button 
                        onClick={() => router.push("/dashboard/procurement/solicitation-management/rfq")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        View RFQs
                    </button>
                </div>
                <div className="card p-6 border rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Request for Proposal (RFP)</h2>
                    <p className="text-gray-600 mb-4">Manage proposal requests and submissions</p>
                    <button 
                        onClick={() => router.push("/dashboard/procurement/solicitation-management/rfp")}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        View RFPs
                    </button>
                </div>
            </div>
        </div>
    );
}