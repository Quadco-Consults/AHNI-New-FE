"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Loading } from "@/components/Loading";
import GoBack from "@/components/GoBack";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import * as CommitteeEvaluationController from "@/features/procurement/controllers/committeeEvaluationController";
import { CommitteeMemberData } from "@/features/procurement/types/cba";
import { useGetSolicitationSubmission, useGetVendorBidSubmissions } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface VendorItem {
  id: string;
  description: string;
  specification: string;
  qty: number;
  brand?: string;
  unitPrice: number;
  total: number;
  selected?: boolean;
}

interface VendorData {
  id: string;
  vendorId?: string; // Actual vendor ID from vendor table
  name: string;
  items: VendorItem[];
  grandTotal: number;
  deliveryTime: string;
  paymentTerms: string;
  tin: string;
  validityPeriod: string;
  bankAccount: string;
  cacRegistration: string;
  workExperience: string;
  currency: string;
  warranty: string;
  technicalEvaluations?: TechnicalEvaluation[];
}

interface TechnicalEvaluation {
  criteria: string;
  response: string;
}

interface SelectedItem {
  vendorId: string;
  vendorName: string;
  itemId: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
  brand?: string;
}

const VendorBidAnalysis = () => {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const cbaId = searchParams?.get('cba') || id;
  const solicitationId = searchParams?.get('id');

  const [vendorData, setVendorData] = useState<VendorData[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  // Committee evaluation state
  const [qualityScores, setQualityScores] = useState<{[vendorId: string]: string}>({});
  const [priceResponsiveness, setPriceResponsiveness] = useState<{[vendorId: string]: string}>({});
  const [technicalEligibility, setTechnicalEligibility] = useState<{[vendorId: string]: string}>({});
  const [bankAccountEvaluation, setBankAccountEvaluation] = useState<{[vendorId: string]: string}>({});
  const [experienceEvaluation, setExperienceEvaluation] = useState<{[vendorId: string]: string}>({});
  const [awardRecommendation, setAwardRecommendation] = useState("");

  // Get CBA data to show assignee information
  const { data: cbaData, isLoading: cbaLoading } = CbaAPI.useGetSingleCba(cbaId as string);

  // Get vendor submission data for the current solicitation
  const { data: submissionData, isLoading: submissionLoading, error: submissionError } = useGetSolicitationSubmission(
    solicitationId || "",
    !!solicitationId // Enable when solicitation ID is available
  );

  // Also try to get all vendor bid submissions as fallback
  const { data: allBidData, isLoading: allBidLoading, error: allBidError } = useGetVendorBidSubmissions({
    page: 1,
    size: 100,
    enabled: !!solicitationId // Enable when solicitation ID is available
  });

  // Debug logging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("CBA Analysis:", {
        cbaId,
        solicitationId,
        vendorCount: ((submissionData as any)?.data?.data?.results || (submissionData as any)?.data?.results || []).length
      });
    }
  }, [cbaId, solicitationId, submissionData]);

  // Process real vendor submission data
  useEffect(() => {
    if (!solicitationId) {
      const processedSampleData = sampleVendorData.map((vendor, vendorIndex) => ({
        ...vendor,
        id: vendor.id || `vendor-${vendorIndex + 1}`,
        items: vendor.items.map((item, itemIndex) => ({
          ...item,
          id: item.id || `item-${vendorIndex + 1}-${itemIndex + 1}`
        }))
      }));
      setVendorData(processedSampleData);
      return;
    }

    const apiResults = (submissionData as any)?.data?.data?.results || (submissionData as any)?.data?.results;
    const fallbackResults = (allBidData as any)?.results;

    let dataSource = null;
    if (apiResults && apiResults.length > 0) {
      dataSource = apiResults;
    } else if (fallbackResults && fallbackResults.length > 0) {
      dataSource = fallbackResults;
    }

    if (dataSource && dataSource.length > 0) {
      const currentSolicitationSubmissions = dataSource.filter((submission: any) =>
        submission.solicitation?.id === solicitationId
      );

      if (currentSolicitationSubmissions.length > 0) {
        const processedVendors: VendorData[] = currentSolicitationSubmissions.map((submission: any) => {
          const items = submission.bid_items?.map((bidItem: any, index: number) => ({
            id: bidItem.id || `item-${submission.id}-${index}`,
            description: bidItem.solicitation_item_name || `Item ${index + 1}`,
            specification: `Quantity: ${bidItem.solicitation_item_quantity} units`,
            qty: parseInt(bidItem.solicitation_item_quantity || 0),
            brand: bidItem.brand || "Generic",
            unitPrice: parseFloat(bidItem.unit_price || 0),
            total: parseFloat(bidItem.total_price || 0),
            selected: false
          })) || [];

          const technicalEvaluations: TechnicalEvaluation[] = submission.evaluations?.map((evaluation: any) => ({
            criteria: evaluation.evaluation_criteria?.name || "Technical Criteria",
            response: evaluation.response || "No response provided"
          })) || [];

          return {
            id: submission.id,
            vendorId: submission.vendor?.id,
            name: submission.vendor?.company_name || `Vendor ${submission.id?.slice(0, 8)}`,
            items,
            grandTotal: parseFloat(submission.bid_details?.total_amount || items.reduce((sum: number, item: VendorItem) => sum + item.total, 0)),
            deliveryTime: submission.delivery_time || "2-3 Weeks",
            paymentTerms: submission.payment_terms || "100% Payment After Delivery",
            tin: submission.vendor?.company_registration_number || "N/A",
            validityPeriod: submission.validity_period || "30 Days",
            bankAccount: submission.vendor?.status === "Approved" ? "YES" : "NO",
            cacRegistration: submission.vendor?.company_registration_number ? "YES" : "NO",
            workExperience: submission.vendor?.type_of_business ? "YES" : "NO",
            currency: submission.currency || "Naira",
            warranty: submission.warranty || "Standard Warranty",
            technicalEvaluations
          };
        });

        setVendorData(processedVendors);
      }
    } else {
      const processedSampleData = sampleVendorData.map((vendor, vendorIndex) => ({
        ...vendor,
        id: vendor.id || `vendor-${vendorIndex + 1}`,
        items: vendor.items.map((item, itemIndex) => ({
          ...item,
          id: item.id || `item-${vendorIndex + 1}-${itemIndex + 1}`
        }))
      }));

      setVendorData(processedSampleData);
    }
  }, [submissionData, allBidData, solicitationId, submissionLoading, allBidLoading]);

  // Handle select all items from a vendor
  const handleSelectAllVendorItems = (vendorId: string) => {
    const vendor = vendorData.find(v => v.id === vendorId);
    if (!vendor) return;

    const allSelected = vendor.items.every(item => item.selected);
    const newSelectionState = !allSelected;

    if (newSelectionState) {
      // Select all items from this vendor
      const vendorSelectedItems = vendor.items.map(item => ({
        vendorId: vendor.id,
        vendorName: vendor.name,
        itemId: item.id,
        description: item.description,
        qty: item.qty,
        unitPrice: item.unitPrice,
        total: item.total,
        brand: item.brand
      }));

      // Remove any existing selections from this vendor, then add all items
      setSelectedItems(prev => [
        ...prev.filter(si => si.vendorId !== vendorId),
        ...vendorSelectedItems
      ]);
    } else {
      // Deselect all items from this vendor
      setSelectedItems(prev => prev.filter(si => si.vendorId !== vendorId));
    }

    // Update vendor data to reflect selection state
    setVendorData(prev => prev.map(v =>
      v.id === vendorId
        ? {
            ...v,
            items: v.items.map(item => ({ ...item, selected: newSelectionState }))
          }
        : v
    ));

  };

  // Handle checkbox selection
  const handleItemSelection = (vendorId: string, itemId: string, checked: boolean) => {
    const vendor = vendorData.find(v => v.id === vendorId);
    const item = vendor?.items.find(i => i.id === itemId);

    if (!vendor || !item) {
      return;
    }

    if (checked) {
      // Add to selected items
      const selectedItem: SelectedItem = {
        vendorId: vendor.id,
        vendorName: vendor.name,
        itemId: item.id,
        description: item.description,
        qty: item.qty,
        unitPrice: item.unitPrice,
        total: item.total,
        brand: item.brand
      };
      setSelectedItems(prev => [...prev.filter(si => !(si.vendorId === vendorId && si.itemId === itemId)), selectedItem]);
    } else {
      // Remove from selected items
      setSelectedItems(prev => prev.filter(si => !(si.vendorId === vendorId && si.itemId === itemId)));
    }

    // Update vendor data
    setVendorData(prev => prev.map(vendor =>
      vendor.id === vendorId
        ? {
            ...vendor,
            items: vendor.items.map(item =>
              item.id === itemId ? { ...item, selected: checked } : item
            )
          }
        : vendor
    ));
  };

  // Calculate selected total
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.total, 0);

  // Sample vendor data as fallback
  const sampleVendorData: VendorData[] = [
    {
      id: "vendor-1",
      name: "SOUTHGATE TECHNOLOGIES LIMITED",
      items: [
        {
          id: "item-1",
          description: "Laptop Computer",
          specification: "15\" 4k OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD (XPS 15 9530)",
          qty: 6,
          brand: "Dell",
          unitPrice: 3725192.50,
          total: 22351155.00,
          selected: false
        },
        {
          id: "item-2",
          description: "USB Headset",
          specification: "Noise-Cancelling USB Headset (H540)",
          qty: 6,
          brand: "Logitech",
          unitPrice: 69161.00,
          total: 414966.00
        },
        {
          id: "item-3",
          description: "Wireless Mouse",
          specification: "Wireless Mouse with USB Receiver",
          qty: 6,
          brand: "Logitech",
          unitPrice: 71392.00,
          total: 428352.00
        },
        {
          id: "item-4",
          description: "HD Computer Monitor",
          specification: "27\" 4k Monitor with tilt and swivel",
          qty: 6,
          brand: "Dell",
          unitPrice: 351191.00,
          total: 2107146.00
        },
        {
          id: "item-5",
          description: "Wireless Table Phones",
          specification: "Quality Wireless Table Phones",
          qty: 6,
          brand: "Panasonic",
          unitPrice: 108203.50,
          total: 649221.00
        },
        {
          id: "item-6",
          description: "12 Month Each Airtime Subscription for Table Phones",
          specification: "N15,000 Airtime for each Wireless Phone(Preferable Airtel Network)",
          qty: 72,
          unitPrice: 0.00,
          total: 0.00
        },
        {
          id: "item-7",
          description: "Extension Box",
          specification: "High quality branded 3-way surge protector extension socket with 3M core and individual switches",
          qty: 5,
          brand: "Generic",
          unitPrice: 17250.00,
          total: 103500.00
        }
      ],
      grandTotal: 25954340.00,
      deliveryTime: "2-3 Weeks",
      paymentTerms: "100% Payment After Delivery",
      tin: "0336185-0001",
      validityPeriod: "1 Week Exchange rate due too Volatility in Currency",
      bankAccount: "YES",
      cacRegistration: "YES",
      workExperience: "YES",
      currency: "Naira",
      warranty: "OEM Warranty applicable",
      technicalEvaluations: [
        { criteria: "Technical Capability", response: "5 years experience in laptop supply and configuration" },
        { criteria: "Delivery Capacity", response: "Can deliver within 2-3 weeks with full setup" }
      ]
    },
    {
      id: "vendor-2",
      name: "SUNOK GLOBAL SYSTEMS LIMITED",
      items: [
        {
          id: "item-1-vendor2",
          description: "Laptop Computer",
          specification: "15\" 4k OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD (XPS 15 9530)",
          qty: 6,
          brand: "HP",
          unitPrice: 3150000.00,
          total: 18900000.00
        },
        {
          id: "item-2-vendor2",
          description: "USB Headset",
          specification: "Noise-Cancelling USB Headset (H540)",
          qty: 6,
          brand: "Generic",
          unitPrice: 48000.00,
          total: 288000.00
        },
        {
          id: "item-3-vendor2",
          description: "Wireless Mouse",
          specification: "Wireless Mouse with USB Receiver",
          qty: 6,
          brand: "Generic",
          unitPrice: 48000.00,
          total: 288000.00
        },
        {
          id: "item-4-vendor2",
          description: "HD Computer Monitor",
          specification: "27\" 4k Monitor with tilt and swivel",
          qty: 6,
          brand: "Samsung",
          unitPrice: 225000.00,
          total: 1350000.00
        },
        {
          id: "item-5-vendor2",
          description: "Wireless Table Phones",
          specification: "Quality Wireless Table Phones",
          qty: 6,
          brand: "Motorola",
          unitPrice: 45000.00,
          total: 270000.00
        },
        {
          id: "item-6",
          description: "12 Month Each Airtime Subscription for Table Phones",
          specification: "N15,000 Airtime for each Wireless Phone(Preferable Airtel Network)",
          qty: 72,
          unitPrice: 0.00,
          total: 0.00
        },
        {
          id: "item-7-vendor2",
          description: "Extension Box",
          specification: "High quality branded 3-way surge protector extension socket with 3M core and individual switches",
          qty: 5,
          brand: "Generic",
          unitPrice: 15000.00,
          total: 90000.00
        }
      ],
      grandTotal: 21186000.00,
      deliveryTime: "2-3 Weeks",
      paymentTerms: "100% Payment After Delivery",
      tin: "0336185-0001",
      validityPeriod: "1 Week Exchange rate due too Volatility in Currency",
      bankAccount: "YES",
      cacRegistration: "YES",
      workExperience: "YES",
      currency: "Naira",
      warranty: "OEM Warranty applicable"
    },
    {
      id: "vendor-3",
      name: "VIABLE TRUST INVESTMENTS LTD",
      items: [
        {
          id: "item-1-vendor3",
          description: "Laptop Computer",
          specification: "15\" 4k OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD (XPS 15 9530)",
          qty: 6,
          brand: "Lenovo",
          unitPrice: 5503680.00,
          total: 33022080.00
        },
        {
          id: "item-2-vendor3",
          description: "USB Headset",
          specification: "Noise-Cancelling USB Headset (H540)",
          qty: 6,
          brand: "Jabra",
          unitPrice: 41350.00,
          total: 248100.00
        },
        {
          id: "item-3-vendor3",
          description: "Wireless Mouse",
          specification: "Wireless Mouse with USB Receiver",
          qty: 6,
          brand: "Microsoft",
          unitPrice: 74500.00,
          total: 447000.00
        },
        {
          id: "item-4-vendor3",
          description: "HD Computer Monitor",
          specification: "27\" 4k Monitor with tilt and swivel",
          qty: 6,
          brand: "LG",
          unitPrice: 465000.00,
          total: 2790000.00
        },
        {
          id: "item-5-vendor3",
          description: "Wireless Table Phones",
          specification: "Quality Wireless Table Phones",
          qty: 6,
          brand: "Cisco",
          unitPrice: 25000.00,
          total: 150000.00
        },
        {
          id: "item-6",
          description: "12 Month Each Airtime Subscription for Table Phones",
          specification: "N15,000 Airtime for each Wireless Phone(Preferable Airtel Network)",
          qty: 72,
          unitPrice: 0.00,
          total: 0.00
        },
        {
          id: "item-7-vendor3",
          description: "Extension Box",
          specification: "High quality branded 3-way surge protector extension socket with 3M core and individual switches",
          qty: 5,
          brand: "Schneider",
          unitPrice: 68000.00,
          total: 408000.00
        }
      ],
      grandTotal: 37065180.00,
      deliveryTime: "2-3 Weeks",
      paymentTerms: "100% Payment After Delivery",
      tin: "0336185-0001",
      validityPeriod: "1 Week Exchange rate due too Volatility in Currency",
      bankAccount: "YES",
      cacRegistration: "YES",
      workExperience: "YES",
      currency: "Naira",
      warranty: "OEM Warranty applicable"
    }
  ];

  const { modifyCba, isLoading: submittingAnalysis } = CbaAPI.useModifyCba(cbaId as string);
  const { evaluateCba, isLoading: submittingEvaluation } = CbaAPI.useCbaEvaluation(cbaId as string);

  // Import committee evaluation controller
  const currentUser = CommitteeEvaluationController.useCurrentUser();
  const { mutateAsync: submitMemberEvaluation, isPending: submittingMemberEval } =
    CommitteeEvaluationController.useSubmitMemberEvaluation(cbaId as string);

  // Check if current user is a committee member (with proper type safety)
  const isCommitteeMember = useMemo(() => {
    if (!cbaData?.data?.committee_members || !currentUser.id) {
      return false;
    }

    return cbaData.data.committee_members.some(
      (member: CommitteeMemberData) => member.id === currentUser.id
    );
  }, [cbaData?.data?.committee_members, currentUser.id]);

  const handleSubmitAnalysis = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item from vendors before submitting");
      return;
    }

    // Group selected items by vendor
    const itemsByVendor = selectedItems.reduce((acc, item) => {
      if (!acc[item.vendorId]) {
        acc[item.vendorId] = {
          vendorName: item.vendorName,
          items: []
        };
      }
      acc[item.vendorId].items.push(item);
      return acc;
    }, {} as Record<string, { vendorName: string; items: SelectedItem[] }>);

    const vendorIds = Object.keys(itemsByVendor);

    // Support multi-vendor selection
    const allSelectedVendorItems = Object.values(itemsByVendor).flatMap(v => v.items);
    const allSelectedVendors = vendorIds.map(id => vendorData.find(v => v.id === id)).filter(Boolean);

    // Prepare comprehensive evaluation data for each vendor
    const vendorEvaluations = vendorData.map(vendor => {
      // Extract unique brands from vendor items
      const brands = vendor.items
        .map(item => item.brand)
        .filter((brand): brand is string => !!brand && brand.trim() !== '');
      const uniqueBrands = [...new Set(brands)];
      const brandsText = uniqueBrands.length > 0 ? uniqueBrands.join(', ') : null;

      return {
        vendor_id: vendor.vendorId || vendor.id,
        vendor_name: vendor.name,
        quality_score: qualityScores[vendor.id] || null,
        approved_models: brandsText, // Auto-extracted from vendor items
        price_responsiveness: priceResponsiveness[vendor.id] || null,
        technical_eligibility: technicalEligibility[vendor.id] || null,
        bank_account_evaluation: bankAccountEvaluation[vendor.id] || null,
        experience_evaluation: experienceEvaluation[vendor.id] || null,
        grand_total: vendor.grandTotal,
        delivery_time: vendor.deliveryTime,
        payment_terms: vendor.paymentTerms,
        tin: vendor.tin,
        validity_period: vendor.validityPeriod,
        currency: vendor.currency,
        warranty: vendor.warranty
      };
    });

    // Prepare the payload to update CBA with analysis results
    // Backend now expects selected_bid_submission (submission ID) instead of selected_vendor_id
    const analysisPayload = {
      selected_bid_submission: selectedSubmissionId, // Send submission ID directly
      selected_items: selectedItems.map(item => item.itemId),
      recommendation_note: awardRecommendation || `Award recommended to ${selectedVendorItems.vendorName} for ${selectedItems.length} items with total value of ₦${selectedTotal.toLocaleString()}`,
      selected_total: selectedTotal,
      vendor_evaluations: vendorEvaluations, // Include all evaluation criteria
      evaluation_metadata: {
        evaluated_by: cbaData?.data?.created_by || "System",
        evaluation_date: new Date().toISOString(),
        total_vendors_evaluated: vendorData.length,
        selected_vendor_id: selectedVendor?.vendorId || selectedSubmissionId
      }
    };

    try {
      // If user is a committee member, submit as member evaluation
      if (isCommitteeMember) {
        // Build evaluation_criteria_data with all vendor analysis criteria
        const evaluationCriteriaData = vendorEvaluations.map(vendorEval => ({
          vendor_id: vendorEval.vendor_id,
          vendor_name: vendorEval.vendor_name,
          // Criterion A: Quality score
          quality_score: vendorEval.quality_score,
          // Criterion B: Approved models
          approved_models: vendorEval.approved_models,
          // Criterion C: Price responsiveness (1st, 2nd, 3rd, 4th)
          price_responsiveness: vendorEval.price_responsiveness,
          // Criterion D: Technical eligibility (YES/NO)
          technical_eligibility: vendorEval.technical_eligibility,
          // Criterion I: Bank account evaluation (YES/NO)
          bank_account_evaluation: vendorEval.bank_account_evaluation,
          // Criterion J: Experience evaluation (YES/NO)
          experience_evaluation: vendorEval.experience_evaluation,
          // Additional vendor data
          grand_total: vendorEval.grand_total,
          delivery_time: vendorEval.delivery_time,
          payment_terms: vendorEval.payment_terms,
          tin: vendorEval.tin,
          validity_period: vendorEval.validity_period,
          currency: vendorEval.currency,
          warranty: vendorEval.warranty
        }));

        // Calculate technical and commercial scores
        const selectedVendorEval = vendorEvaluations.find(v => v.vendor_id === selectedSubmissionId);
        let technicalScore = 0;
        let commercialScore = 0;

        if (selectedVendorEval?.quality_score) {
          const scores = selectedVendorEval.quality_score.split('-').map(Number);
          technicalScore = scores.length === 2 ? Math.round((scores[0] + scores[1]) / 2) : 0;
        }

        // Commercial score based on price responsiveness (1st = 100, 2nd = 90, 3rd = 80, 4th = 70)
        if (selectedVendorEval?.price_responsiveness) {
          const rank = parseInt(selectedVendorEval.price_responsiveness.charAt(0));
          commercialScore = Math.max(110 - (rank * 10), 70);
        }

        const memberEvaluationPayload = {
          selected_bid_submission: selectedSubmissionId,
          selected_items: selectedItems.map(item => item.itemId),
          selected_total: selectedTotal,
          overall_recommendation: awardRecommendation || `Award recommended to ${selectedVendorItems.vendorName}`,
          technical_score: technicalScore,
          commercial_score: commercialScore,
          evaluation_criteria_data: evaluationCriteriaData,
          status: 'SUBMITTED'
        };

        await submitMemberEvaluation(memberEvaluationPayload);

        toast.success(`Committee evaluation submitted successfully!`);

        // Invalidate queries
        await queryClient.invalidateQueries({ queryKey: ["cba", cbaId] });
        await queryClient.invalidateQueries({ queryKey: ["member-evaluation", cbaId] });
        await queryClient.invalidateQueries({ queryKey: ["all-member-evaluations", cbaId] });

        // Redirect to analysis results page
        setTimeout(() => {
          router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/analysis-results?id=${solicitationId}&cba=${cbaId}`);
        }, 1500);

        return; // Exit early for committee member submission
      }

      // Non-committee member (procurement officer) submission
      // Submit the main analysis payload (selection and recommendation)
      await modifyCba(analysisPayload);

      // Also submit the evaluation data if backend has the evaluate endpoint
      // This ensures all evaluation criteria are saved
      try {
        // Extract all unique brands from all vendors
        const allBrands = vendorData.flatMap(vendor =>
          vendor.items
            .map(item => item.brand)
            .filter((brand): brand is string => !!brand && brand.trim() !== '')
        );
        const uniqueAllBrands = [...new Set(allBrands)];

        const evaluationPayload = {
          cba_id: cbaId as string,
          solicitation_id: solicitationId as string,
          evaluation_criteria: {
            technical_evaluation_percentage: 60,
            price_reasonableness_percentage: 40,
            approved_models: uniqueAllBrands
          },
          vendor_evaluations: vendorData.map(vendor => {
            // Extract numeric scores from quality score ranges (e.g., "60-70" -> 65)
            const qualityScoreRange = qualityScores[vendor.id];
            let technicalScore = 0;
            if (qualityScoreRange) {
              const scores = qualityScoreRange.split('-').map(Number);
              technicalScore = scores.length === 2 ? (scores[0] + scores[1]) / 2 : 0;
            }

            return {
              vendor_id: vendor.vendorId || vendor.id,
              technical_eligibility: technicalEligibility[vendor.id] === 'YES',
              financial_eligibility: true, // Default to true
              delivery_leadtime: vendor.deliveryTime,
              payment_terms: vendor.paymentTerms,
              tax_identification: vendor.tin,
              validity_period: vendor.validityPeriod,
              bank_account_verified: bankAccountEvaluation[vendor.id] === 'YES',
              vendor_experience_verified: experienceEvaluation[vendor.id] === 'YES',
              currency: vendor.currency,
              warranty_provision: vendor.warranty,
              technical_score: technicalScore,
              price_score: 0, // Will be calculated by backend based on price ranking
              overall_rank: priceResponsiveness[vendor.id] ? parseInt(priceResponsiveness[vendor.id].charAt(0)) : 0
            };
          })
        };

        await evaluateCba(evaluationPayload);
      } catch (evalError) {
        if (process.env.NODE_ENV === 'development') {
          console.warn("⚠️ Could not save evaluation data (endpoint may not exist):", evalError);
        }
        // Don't fail the whole submission if evaluation endpoint doesn't work
      }

      toast.success(`Analysis submitted successfully! Selected ${selectedItems.length} items from ${selectedVendorItems.vendorName} with total: ₦${selectedTotal.toLocaleString()}`);

      // Invalidate queries to refresh CBA data
      await queryClient.invalidateQueries({ queryKey: ["cba", cbaId] });
      await queryClient.invalidateQueries({ queryKey: ["cbas"] });

      // Redirect to analysis results page after successful submission
      setTimeout(() => {
        router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/analysis-results?id=${solicitationId}&cba=${cbaId}`);
      }, 1500);
    } catch (error) {
      console.error("❌ CBA Analysis submission error:", error);
      toast.error("Failed to submit analysis. Please try again.");
    }
  };

  if (cbaLoading || submissionLoading) {
    return <Loading />;
  }

  const maxItems = Math.max(...vendorData.map(v => v.items.length));

  return (
    <div className="space-y-6 p-4">
      <GoBack />

      {/* AHNI Header Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          {/* AHNI Logo */}
          <div className="mr-4">
            <img
              src="/imgs/logo.png"
              alt="AHNI Logo"
              className="w-20 h-16 object-contain"
            />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-blue-800">
              ACHIEVING HEALTH INITIATIVE NIGERIA (AHNI)
            </h1>
            <p className="text-gray-600 text-sm">
              Building Sustainable Health Systems Across Nigeria
            </p>
            <p className="text-gray-500 text-xs mt-2">
              30 Anthony Enahoro St, Mabushi, Abuja 900108, Federal Capital Territory
            </p>
            <p className="text-gray-500 text-xs">
              Phone: 94615555
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            COMPETITIVE BID ANALYSIS (CBA)
          </h2>
          <h3 className="text-lg text-gray-700 mb-1">
            PROCUREMENT EVALUATION COMMITTEE
          </h3>
          <p className="text-sm text-gray-600">
            RFQ ID: {cbaData?.data?.solicitation?.rfq_id || solicitationId || 'N/A'} | CBA Reference: {cbaData?.data?.cba_reference || 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Date: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Header Row */}
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left w-12">S/N</th>
                <th className="border border-gray-300 p-2 text-left w-48">Items Description</th>
                <th className="border border-gray-300 p-2 text-center w-16">Qty</th>
                {vendorData.map((vendor, index) => (
                  <th key={index} className="border border-gray-300 p-2 text-center bg-blue-50" style={{ minWidth: '240px' }}>
                    <div className="font-bold text-blue-800">{vendor.name}</div>
                    <div className="grid grid-cols-4 gap-1 mt-2 text-xs">
                      <Button
                        onClick={() => handleSelectAllVendorItems(vendor.id)}
                        size="sm"
                        variant={vendor.items.every(item => item.selected) ? "default" : "outline"}
                        className="text-xs h-6 px-1"
                      >
                        {vendor.items.every(item => item.selected) ? "Deselect All" : "Select All"}
                      </Button>
                      <div className="bg-gray-200 p-1 rounded">Brand</div>
                      <div className="bg-gray-200 p-1 rounded">Unit price</div>
                      <div className="bg-gray-200 p-1 rounded">Total</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Item Rows */}
              {Array.from({ length: maxItems }, (_, itemIndex) => (
                <tr key={itemIndex} className={itemIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 p-2 text-center font-medium">
                    {itemIndex + 1}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {vendorData[0]?.items[itemIndex] && (
                      <div>
                        <div className="font-medium text-sm">{vendorData[0].items[itemIndex].description}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Specification: {vendorData[0].items[itemIndex].specification}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {vendorData[0]?.items[itemIndex]?.qty || ""}
                  </td>
                  {vendorData.map((vendor, vendorIndex) => (
                    <td key={vendorIndex} className="border border-gray-300 p-0">
                      {vendor.items[itemIndex] && (
                        <div className="grid grid-cols-4 h-full">
                          <div className="border-r border-gray-300 p-2 text-center text-xs flex items-center justify-center">
                            <Checkbox
                              checked={vendor.items[itemIndex].selected || false}
                              onCheckedChange={(checked) =>
                                handleItemSelection(vendor.id, vendor.items[itemIndex].id, checked as boolean)
                              }
                            />
                          </div>
                          <div className="border-r border-gray-300 p-2 text-center text-xs">
                            {vendor.items[itemIndex].brand || ""}
                          </div>
                          <div className="border-r border-gray-300 p-2 text-center text-xs">
                            ₦{vendor.items[itemIndex].unitPrice.toLocaleString()}
                          </div>
                          <div className="p-2 text-center text-xs">
                            ₦{vendor.items[itemIndex].total.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Grand Total Row */}
              <tr className="bg-green-100 font-bold">
                <td colSpan={3} className="border border-gray-300 p-2 text-right">
                  Grand Total:
                </td>
                {vendorData.map((vendor, index) => (
                  <td key={index} className="border border-gray-300 p-2 text-center">
                    <div className="text-lg font-bold text-green-700">
                      ₦{vendor.grandTotal.toLocaleString()}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Quality/Cost-Based Analysis Row */}
              <tr className="bg-orange-50">
                <td className="border border-gray-300 p-2 font-bold text-center">A</td>
                <td className="border border-gray-300 p-2">
                  <div className="font-bold">QUALITY/COST-BASED ANALYSIS(100%)</div>
                  <div className="text-xs">(i)Technical Evaluation = 60%</div>
                  <div className="text-xs">(ii)Price Reasonableness=40%</div>
                </td>
                <td className="border border-gray-300 p-2"></td>
                {vendorData.map((vendor, index) => (
                  <td key={index} className="border border-gray-300 p-2">
                    <Select
                      value={qualityScores[vendor.id] || ""}
                      onValueChange={(value) => setQualityScores(prev => ({...prev, [vendor.id]: value}))}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="Select score range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20-30">20-30%</SelectItem>
                        <SelectItem value="30-40">30-40%</SelectItem>
                        <SelectItem value="40-50">40-50%</SelectItem>
                        <SelectItem value="50-60">50-60%</SelectItem>
                        <SelectItem value="60-70">60-70%</SelectItem>
                        <SelectItem value="70-80">70-80%</SelectItem>
                        <SelectItem value="81-90">81-90%</SelectItem>
                        <SelectItem value="90-100">90-100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                ))}
              </tr>

              {/* List of Approved Models Row - Auto-populated from vendor items */}
              <tr className="bg-blue-50">
                <td className="border border-gray-300 p-2 font-bold text-center">B</td>
                <td className="border border-gray-300 p-2 font-medium">
                  List of Approved Models and Brands(If Applicable)
                </td>
                <td className="border border-gray-300 p-2 text-center">N/A</td>
                {vendorData.map((vendor, index) => {
                  // Extract unique brands from vendor items
                  const brands = vendor.items
                    .map(item => item.brand)
                    .filter((brand): brand is string => !!brand && brand.trim() !== '');
                  const uniqueBrands = [...new Set(brands)];
                  const brandsText = uniqueBrands.length > 0
                    ? uniqueBrands.join(', ')
                    : 'N/A';

                  return (
                    <td key={index} className="border border-gray-300 p-2">
                      <div className="text-sm bg-gray-50 p-2 rounded border border-gray-300">
                        {brandsText}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Price Responsiveness Rating Row */}
              <tr className="bg-yellow-50">
                <td className="border border-gray-300 p-2 font-bold text-center">C</td>
                <td className="border border-gray-300 p-2">
                  <div className="font-bold">Price Responsiveness Rating</div>
                  <div className="text-xs">(1st-most responsive)</div>
                  <div className="text-xs">(2nd-most responsive)</div>
                  <div className="text-xs">(3rd-most responsive)</div>
                  <div className="text-xs">(4th-most responsive)</div>
                </td>
                <td className="border border-gray-300 p-2"></td>
                {vendorData.map((vendor, index) => (
                  <td key={index} className="border border-gray-300 p-2">
                    <Select
                      value={priceResponsiveness[vendor.id] || ""}
                      onValueChange={(value) => setPriceResponsiveness(prev => ({...prev, [vendor.id]: value}))}
                    >
                      <SelectTrigger className="w-full text-xs">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st-most-responsive">1st-most responsive</SelectItem>
                        <SelectItem value="2nd-most-responsive">2nd-most responsive</SelectItem>
                        <SelectItem value="3rd-most-responsive">3rd-most responsive</SelectItem>
                        <SelectItem value="4th-most-responsive">4th-most responsive</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                ))}
              </tr>

              {/* Evaluation Criteria Rows D-L */}
              {[
                { label: "D", desc: "Does the Bidder Passed Technical Eligibility and Financial Evaluation?", field: "technicalEvaluation" },
                { label: "E", desc: "Delivery Leadtime", field: "deliveryTime" },
                { label: "F", desc: "Payment Terms:", field: "paymentTerms" },
                { label: "G", desc: "Tax Identification Number (TIN)", field: "tin" },
                { label: "H", desc: "Validity Period of Submitted Quotation", field: "validityPeriod" },
                { label: "I", desc: "Does the Vendor Provide Bank Account to enable Payment?", field: "bankAccount" },
                { label: "J", desc: "Does the Vendor have Reasonable Experience the provision of this Goods, Services or Works?", field: "workExperience" },
                { label: "K", desc: "Currency For Payment", field: "currency" },
                { label: "L", desc: "Warranty Provision", field: "warranty" }
              ].map((criteria, index) => (
                <tr key={index} className="bg-gray-50">
                  <td className="border border-gray-300 p-2 text-center font-bold">
                    {criteria.label}
                  </td>
                  <td className="border border-gray-300 p-2 font-medium">
                    {criteria.desc}
                  </td>
                  <td className="border border-gray-300 p-2"></td>
                  {vendorData.map((vendor, vendorIndex) => (
                    <td key={vendorIndex} className="border border-gray-300 p-2 text-center">
                      {criteria.field === "technicalEvaluation" ? (
                        <Select
                          value={technicalEligibility[vendor.id] || ""}
                          onValueChange={(value) => setTechnicalEligibility(prev => ({...prev, [vendor.id]: value}))}
                        >
                          <SelectTrigger className="w-full text-xs">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="YES">YES</SelectItem>
                            <SelectItem value="NO">NO</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : criteria.field === "bankAccount" ? (
                        <Select
                          value={bankAccountEvaluation[vendor.id] || ""}
                          onValueChange={(value) => setBankAccountEvaluation(prev => ({...prev, [vendor.id]: value}))}
                        >
                          <SelectTrigger className="w-full text-xs">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="YES">YES</SelectItem>
                            <SelectItem value="NO">NO</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : criteria.field === "workExperience" ? (
                        <Select
                          value={experienceEvaluation[vendor.id] || ""}
                          onValueChange={(value) => setExperienceEvaluation(prev => ({...prev, [vendor.id]: value}))}
                        >
                          <SelectTrigger className="w-full text-xs">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="YES">YES</SelectItem>
                            <SelectItem value="NO">NO</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm bg-blue-50 p-2 rounded border">
                          {vendor[criteria.field as keyof VendorData] as string}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Award Recommendation Section */}
        <div className="p-6 border-t bg-orange-50">
          <div className="border border-gray-300 p-4">
            <div className="font-bold mb-3 text-lg">M &nbsp;&nbsp; Award Recommendation:</div>
            <Textarea
              value={awardRecommendation}
              onChange={(e) => setAwardRecommendation(e.target.value)}
              placeholder="Enter award recommendation based on the committee's evaluation of vendor submissions. Include details about the procurement process, evaluation criteria, vendor performance, and justification for the recommended award..."
              className="w-full min-h-[120px] text-sm"
              rows={6}
            />
          </div>
        </div>


        {/* Selected Items Summary */}
        {selectedItems.length > 0 && (
          <div className="p-6 border-t bg-green-50">
            <h3 className="text-lg font-semibold mb-4 text-green-800">Selected Items Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-gray-700 mb-2">Selected Items: {selectedItems.length}</h4>
                <div className="max-h-32 overflow-y-auto">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600 mb-1">
                      • {item.description} from {item.vendorName} - ₦{item.total.toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-gray-700 mb-2">Total Selected Amount</h4>
                <div className="text-2xl font-bold text-green-600">
                  ₦{selectedTotal.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Analysis Button */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-center">
            <Button
              onClick={handleSubmitAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              disabled={selectedItems.length === 0 || submittingAnalysis || submittingEvaluation || submittingMemberEval}
            >
              {submittingAnalysis || submittingEvaluation || submittingMemberEval
                ? isCommitteeMember ? "Submitting Evaluation..." : "Submitting Analysis..."
                : isCommitteeMember
                  ? `Submit Evaluation (${selectedItems.length} items selected)`
                  : `Submit Analysis (${selectedItems.length} items selected)`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorBidAnalysis;