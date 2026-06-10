"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RFPEvaluationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const submissionId = params?.id as string;
  const rfpId = searchParams?.get("rfp");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <Icon icon="mdi:arrow-left" className="w-5 h-5" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">RFP Proposal Evaluation</h1>
            <p className="text-sm text-gray-500">
              Review Technical Experience & Financial Capacity
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          Under Review
        </Badge>
      </div>

      {/* Debug Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Icon icon="mdi:information-outline" className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Evaluation Details</p>
            <div className="text-xs text-blue-700 mt-2 space-y-1">
              <p><strong>Submission ID:</strong> {submissionId}</p>
              <p><strong>RFP ID:</strong> {rfpId || "Not provided"}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Evaluation Tabs */}
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="technical">
            <Icon icon="mdi:briefcase-check" className="w-4 h-4 mr-2" />
            Technical Experience
          </TabsTrigger>
          <TabsTrigger value="financial">
            <Icon icon="mdi:cash-multiple" className="w-4 h-4 mr-2" />
            Financial Capacity
          </TabsTrigger>
          <TabsTrigger value="commercial">
            <Icon icon="mdi:currency-usd" className="w-4 h-4 mr-2" />
            Commercial/Price
          </TabsTrigger>
          <TabsTrigger value="summary">
            <Icon icon="mdi:file-document" className="w-4 h-4 mr-2" />
            Summary
          </TabsTrigger>
        </TabsList>

        {/* Technical Experience Tab */}
        <TabsContent value="technical" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Technical Experience Review</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Review vendor's technical qualifications, past project experience,
                  certifications, and capacity to deliver the proposed services.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Total Score:</span>
                  <span className="text-2xl font-bold text-blue-600">0/40</span>
                </div>
              </div>

              {/* Technical Evaluation Criteria */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold">Past Project Experience (15 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Similar Projects Completed</p>
                    <p className="text-xs text-gray-600">Number and relevance of past projects</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="15" className="w-20 px-2 py-1 border rounded" placeholder="0-15" />
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mt-4">Team Qualifications (10 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Team Expertise & Credentials</p>
                    <p className="text-xs text-gray-600">Qualifications and experience of proposed team</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="10" className="w-20 px-2 py-1 border rounded" placeholder="0-10" />
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mt-4">Methodology & Approach (10 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Technical Approach & Work Plan</p>
                    <p className="text-xs text-gray-600">Quality and feasibility of proposed methodology</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="10" className="w-20 px-2 py-1 border rounded" placeholder="0-10" />
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mt-4">Certifications & Standards (5 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Professional Certifications & Quality Standards</p>
                    <p className="text-xs text-gray-600">ISO certifications, industry standards compliance</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="5" className="w-20 px-2 py-1 border rounded" placeholder="0-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Financial Capacity Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Financial Capacity Review</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Assess vendor's financial stability, credit rating, bank statements,
                  and ability to handle the project scope.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Total Score:</span>
                  <span className="text-2xl font-bold text-green-600">0/20</span>
                </div>
              </div>

              {/* Financial Evaluation Criteria */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold">Financial Stability (10 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Financial Statements & Liquidity</p>
                    <p className="text-xs text-gray-600">Review of audited financial statements and cash flow</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="10" className="w-20 px-2 py-1 border rounded" placeholder="0-10" />
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mt-4">Credit Rating & History (5 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Credit Score & Payment History</p>
                    <p className="text-xs text-gray-600">Credit worthiness and track record</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="5" className="w-20 px-2 py-1 border rounded" placeholder="0-5" />
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mt-4">Bank References (5 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Banking Relationships & Capacity</p>
                    <p className="text-xs text-gray-600">Bank statements and reference letters</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="5" className="w-20 px-2 py-1 border rounded" placeholder="0-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Commercial/Price Evaluation Tab */}
        <TabsContent value="commercial" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Commercial & Price Evaluation</h3>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Evaluate vendor's commercial proposal including pricing, payment terms,
                  delivery schedule, warranties, and overall value for money.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Total Score:</span>
                  <span className="text-2xl font-bold text-purple-600">0/30</span>
                </div>
              </div>

              {/* Price Evaluation Criteria */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold">Price Competitiveness (15 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Total Quoted Price</p>
                    <p className="text-xs text-gray-600">Compare with market rates and other vendors</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="15" className="w-20 px-2 py-1 border rounded" placeholder="0-15" />
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mt-4">Payment Terms (5 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Payment Schedule & Terms</p>
                    <p className="text-xs text-gray-600">Flexibility and reasonableness of payment terms</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="5" className="w-20 px-2 py-1 border rounded" placeholder="0-5" />
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mt-4">Delivery & Timeline (5 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">Proposed Delivery Schedule</p>
                    <p className="text-xs text-gray-600">Feasibility and speed of delivery/completion</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="5" className="w-20 px-2 py-1 border rounded" placeholder="0-5" />
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold mt-4">Warranties & Support (5 points)</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium mb-2">After-Sales Service & Warranties</p>
                    <p className="text-xs text-gray-600">Quality and duration of warranties offered</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm">Score:</span>
                      <input type="number" min="0" max="5" className="w-20 px-2 py-1 border rounded" placeholder="0-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Evaluation Summary</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Technical Experience</p>
                  <p className="text-3xl font-bold text-blue-600">0/40</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700">Pending</Badge>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Financial Capacity</p>
                  <p className="text-3xl font-bold text-green-600">0/20</p>
                  <Badge className="mt-2 bg-green-100 text-green-700">Pending</Badge>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Commercial/Price</p>
                  <p className="text-3xl font-bold text-purple-600">0/30</p>
                  <Badge className="mt-2 bg-purple-100 text-purple-700">Pending</Badge>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Documents/Compliance</p>
                  <p className="text-3xl font-bold text-orange-600">0/10</p>
                  <Badge className="mt-2 bg-orange-100 text-orange-700">Pending</Badge>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-lg">Overall Score:</span>
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">0/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all" style={{ width: "0%" }}></div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-gray-600">
                  <div>Technical: 40%</div>
                  <div>Financial: 20%</div>
                  <div>Commercial: 30%</div>
                  <div>Docs: 10%</div>
                </div>
              </div>

              {/* Passing Threshold */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:alert-circle" className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-800">Minimum Passing Score: 70/100 (70%)</p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Vendors scoring below 70 will be automatically disqualified
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Icon icon="mdi:check-circle" className="w-4 h-4 mr-2" />
                  Approve Proposal
                </Button>
                <Button variant="destructive" className="flex-1">
                  <Icon icon="mdi:close-circle" className="w-4 h-4 mr-2" />
                  Reject Proposal
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button className="bg-primary">
              Submit Evaluation
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
