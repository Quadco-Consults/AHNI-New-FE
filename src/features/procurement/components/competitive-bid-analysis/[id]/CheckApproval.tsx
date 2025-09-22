import { skipToken } from "@reduxjs/toolkit/query";
import GoBack from "components/GoBack";
import { Loading } from "components/Loading";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { RouteEnum } from "constants/RouterConstants";
import useQuery from "hooks/useQuery";
import { useAppDispatch } from "hooks/useStore";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetManualBidPrequalificationsBySolicitation,
  useCreateVendorBidAnalysis,
} from "@/features/procurement/controllers/manualBidCbaPrequalificationController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { toast } from "sonner";
import logoPng from "@/assets/svgs/logo-bg.svg";
import Image from "next/image";
import { BsFiletypeCsv } from "react-icons/bs";

const TableComponent = () => {
  console.log("🚀 CBA TableComponent is rendering!");

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const cba = searchParams?.get("cba");

  const router = useRouter();
  const dispatch = useAppDispatch();

  console.log("🔍 CBA CheckApproval Debug:", {
    solicitationId: id,
    cbaId: cba,
    searchParams: Object.fromEntries(searchParams?.entries() || []),
    windowLocation: typeof window !== 'undefined' ? window.location.href : 'server'
  });

  // Try both data sources to get bid submissions
  const { data: manualBidData, isLoading: isManualLoading, error: manualError } =
    useGetManualBidPrequalificationsBySolicitation(id || "", !!id);

  const { data: vendorSubmissionData, isLoading: isVendorLoading, error: vendorError } =
    useGetSolicitationSubmission(id || "", !!id);

  // Use whichever data source has results
  const summaryData = manualBidData || vendorSubmissionData;
  const isLoading = isManualLoading || isVendorLoading;
  const error = manualError || vendorError;

  console.log("✅ CBA Bid Data Debug:", {
    summaryData,
    id,
    isLoading,
    error,
    manualBidData,
    vendorSubmissionData,
    // Check all possible data paths
    summaryDataKeys: summaryData ? Object.keys(summaryData) : null,
    summaryDataDataKeys: summaryData?.data ? Object.keys(summaryData.data) : null,
    possibleResults1: summaryData?.data?.results,
    possibleResults2: summaryData?.data?.data?.results,
    possibleResults3: (summaryData as any)?.results,
    // Detailed data inspection
    fullManualBidData: manualBidData,
    fullVendorSubmissionData: vendorSubmissionData,
    manualResultsLength: manualBidData?.data?.results?.length,
    vendorResultsLength: vendorSubmissionData?.data?.results?.length || vendorSubmissionData?.data?.data?.results?.length,
    // Check if results are in different paths
    vendorDataStructure: vendorSubmissionData?.data
  });

  const { createVendorBidAnalysis, isLoading: submissionLoading } =
    useCreateVendorBidAnalysis();

  const [recommendationNote, setRecommendationNote] = useState("");

  function formatBidData(inputData: any) {
    console.log("🔧 formatBidData called with:", inputData);

    // Log the complete data structure to understand what we're receiving
    if (inputData) {
      console.log("🔧 formatBidData - Complete data structure:", {
        topLevelKeys: Object.keys(inputData),
        status: inputData.status,
        message: inputData.message,
        hasData: !!inputData.data,
        dataKeys: inputData.data ? Object.keys(inputData.data) : null,
        dataDataKeys: inputData.data?.data ? Object.keys(inputData.data.data) : null,
        resultsAtLevel1: inputData.results?.length || 'Not found',
        resultsAtLevel2: inputData.data?.results?.length || 'Not found',
        resultsAtLevel3: inputData.data?.data?.results?.length || 'Not found',
        actualDataContent: inputData.data,
        nestedDataContent: inputData.data?.data,
        allResults: {
          level1: inputData.results,
          level2: inputData.data?.results,
          level3: inputData.data?.data?.results
        }
      });
    }

    // Try multiple possible data paths - prioritize the correct API structure
    let results = null;
    let dataPath = "";

    // The API returns {status: 'success', data: {results: [...]}}
    // So the correct path is inputData.data.results
    if (inputData?.data?.results && Array.isArray(inputData.data.results)) {
      results = inputData.data.results;
      dataPath = "inputData.data.results";
    } else if (inputData?.results && Array.isArray(inputData.results)) {
      results = inputData.results;
      dataPath = "inputData.results";
    } else if (inputData?.data?.data?.results && Array.isArray(inputData.data.data.results)) {
      // This is the problematic double-nested path - use as last resort
      results = inputData.data.data.results;
      dataPath = "inputData.data.data.results";
    }

    console.log("🔧 formatBidData results found at:", dataPath, "with length:", results?.length);

    if (!results || !Array.isArray(results) || results.length === 0) {
      console.log("❌ formatBidData: No valid results found");
      return {
        data: {
          companies: [],
          items: [],
        },
        extraData: [],
      };
    }

    console.log("🔧 formatBidData processing", results.length, "results");
    console.log("🔧 Sample result structure:", results[0]);

    try {
      const companies = [];
      const companiesSet = new Set();

      // Extract unique companies
      results.forEach((result: any) => {
        const companyName = result?.vendor?.company_name || result?.company_name;
        const companyId = result?.vendor?.id || result?.vendor_id;

        if (companyName && !companiesSet.has(companyName)) {
          companiesSet.add(companyName);
          companies.push({
            name: companyName,
            id: companyId,
          });
        }
      });

      const itemsMap = new Map();
      const extraDataMap = new Map();

      results.forEach((result: any) => {
        const companyName = result?.vendor?.company_name || result?.company_name;

        // Handle bid items - try multiple possible paths
        const bidItems = result?.bid_details?.bidsubmissionitems ||
                        result?.bidsubmissionitems ||
                        result?.items ||
                        [];

        bidItems.forEach((item: any) => {
          const itemId = item?.solicitation_item_id || item?.item_id || item?.id;
          const itemName = item?.solicitation_item_name || item?.item_name || item?.name || item?.title;

          if (itemId) {
            if (!itemsMap.has(itemId)) {
              itemsMap.set(itemId, {
                id: itemId,
                title: itemName,
                qty: item?.quantity || 1,
              });
            }
            itemsMap.get(itemId)[companyName] = {
              unitPrice: parseFloat(item?.unit_price || 0),
              total: parseFloat(item?.total_price || 0),
            };
          }
        });

        // Handle evaluation criteria - try multiple possible paths
        const evaluationCriteria = result?.bid_details?.bid_evaluation_criteria ||
                                  result?.bid_evaluation_criteria ||
                                  result?.evaluation_criteria ||
                                  [];

        evaluationCriteria.forEach((criteria: any) => {
          const criteriaName = criteria?.evaluation_criteria?.name || criteria?.name;
          if (criteriaName) {
            if (!extraDataMap.has(criteriaName)) {
              extraDataMap.set(criteriaName, {
                id: extraDataMap.size + 1,
                title: criteriaName,
                isExtra: true,
              });
            }
            extraDataMap.get(criteriaName)[companyName] = {
              text: criteria?.response || criteria?.value,
              bgColor: "bg-purple-100",
            };
          }
        });
      });

      const formattedResult = {
        data: {
          companies,
          items: Array.from(itemsMap.values()),
        },
        extraData: Array.from(extraDataMap.values()),
      };

      console.log("✅ formatBidData success:", {
        companiesCount: companies.length,
        itemsCount: itemsMap.size,
        extraDataCount: extraDataMap.size,
        companies: companies.map(c => c.name),
        items: Array.from(itemsMap.values()).map(i => i.title)
      });

      return formattedResult;

    } catch (error) {
      console.error("❌ formatBidData error:", error);
      return {
        data: {
          companies: [],
          items: [],
        },
        extraData: [],
      };
    }
  }

  const formattedData = formatBidData(summaryData);

  const [checkedItems, setCheckedItems] = useState({});
  const [headerChecked, setHeaderChecked] = useState({});

  const handleCheckboxChange = (itemId: any, company: any, checked: any) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = {
        ...prevCheckedItems,
        [itemId]: {
          ...prevCheckedItems[itemId],
          [company?.name]: checked,
        },
      };

      const allChecked = formattedData?.data?.items?.every((item) => {
        return updatedCheckedItems[item.id]?.[company?.name] || false;
      });

      setHeaderChecked((prevHeaderChecked) => ({
        ...prevHeaderChecked,
        [company?.name]: allChecked,
      }));

      return updatedCheckedItems;
    });
  };

  const handleHeaderCheckboxChange = (company: any, checked: any) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = { ...prevCheckedItems };
      formattedData?.data?.items?.forEach((item) => {
        updatedCheckedItems[item.id] = {
          ...updatedCheckedItems[item.id],
          [company?.name]: checked,
        };
      });
      return updatedCheckedItems;
    });

    setHeaderChecked((prevHeaderChecked) => ({
      ...prevHeaderChecked,
      [company?.name]: checked,
    }));
  };

  useEffect(() => {
    setHeaderChecked(
      formattedData?.data?.companies?.reduce((acc: any, company: any) => {
        acc[company?.name] = false;
        return acc;
      }, {})
    );
    setCheckedItems(
      formattedData?.data?.items?.reduce((acc: any, item: any) => {
        acc[item.id] = formattedData?.data?.companies?.reduce(
          (companyAcc: any, company: any) => {
            companyAcc[company?.name] = false;
            return companyAcc;
          },
          {}
        );
        return acc;
      }, {})
    );
  }, [summaryData]);

  const calculateCheckedGrandTotal = () => {
    return formattedData?.data?.companies.reduce((totals: any, company: any) => {
      totals[company?.name] = formattedData?.data?.items.reduce((sum: any, item: any) => {
        if (
          checkedItems !== undefined &&
          checkedItems[item.id]?.[company?.name]
        ) {
          return sum + (item[company?.name]?.total || 0);
        }
        return sum;
      }, 0);
      return totals;
    }, {} as Record<string, number>);
  };

  const checkedGrandTotal = calculateCheckedGrandTotal();

  const extraSections = [
    {
      title: "QUALITYCOST-BASED ANALYSIS (100%)",
      subLabels: [
        "i) Technical Evaluation = 60%",
        "ii) Price Reasonableness = 40%",
      ],
    },
    {
      title: "List of Approved Models and Brands (If Applicable)",
      subLabels: ["Model/Brand Name"],
    },
    {
      title: "Price Responsiveness Rating",
      subLabels: [
        "1st – most responsive",
        "2nd – most responsive",
        "3rd – most responsive",
        "4th – most responsive",
      ],
    },
  ];

  const getSelectedItemsForVendor = (vendor: any) => {
    const selectedItems = formattedData?.data?.items
      .filter((item: any) => checkedItems[item.id]?.[vendor?.name])
      .map((item: any) => item.id);

    return selectedItems;
  };

  const [updatedPrices, setUpdatedPrices] = useState({});

  const handleUnitPriceChange = (e: any, itemId: any, companyName: any) => {
    const newPrice = parseFloat(e.target.value) || 0;

    setUpdatedPrices((prevPrices) => ({
      ...prevPrices,
      [itemId]: {
        ...prevPrices[itemId],
        [companyName]: newPrice,
      },
    }));
  };

  const handleSubmitAnalysis = async () => {
    if (!cba || !id) return alert("Missing required IDs");
    if (
      !formattedData ||
      !formattedData.data ||
      !Array.isArray(formattedData.data.companies)
    ) {
      toast.error("No bid data available.");
      return;
    }

    const selectedVendors = formattedData.data.companies.filter((vendor) =>
      Object.values(checkedItems).some((item) => item[vendor?.name])
    );

    if (!selectedVendors.length) {
      return toast.error("No vendors selected.");
    }

    try {
      const apiCalls = selectedVendors.map(async (vendor) => {
        const selectedItems = getSelectedItemsForVendor(vendor);
        
        if (selectedItems.length > 0) {
          const payload = {
            cba_id: cba,
            vendor_id: vendor?.id,
            recommendation_note: recommendationNote,
            selected_items: selectedItems,
            solicitation_id: id,
          };

          await submitCbaAnalysis(payload);
        } else {
          // Submit with empty items to trigger automatic rejection
          const payload = {
            cba_id: cba,
            solicitation_id: id,
            vendor_id: vendor?.id,
            recommendation_note: `${recommendationNote} | Prequalification: FAILED - Vendor did not meet requirements`,
            selected_items: [], // Empty array triggers rejection
          };

          await submitCbaAnalysis(payload);
        }
      });

      await Promise.all(apiCalls);
      router.push(`${RouteEnum.COMPETITIVE_BID_ANALYSIS}`);

      toast.success("Analysis submitted successfully!");
    } catch (error) {
      console.error("Error submitting analysis:", error);
      toast.error("Failed to submit analysis.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">Failed to load bid analysis data</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Try multiple possible data paths for solicitation
  const solicitation = summaryData?.data?.results?.[0]?.solicitation ||
                      (summaryData?.data as any)?.results?.[0]?.solicitation ||
                      (summaryData as any)?.results?.[0]?.solicitation;

  // Add the missing submitCbaAnalysis function
  const submitCbaAnalysis = async (payload: any) => {
    return await createVendorBidAnalysis(payload);
  };

  // Enhanced debugging for missing data
  console.log("🔧 CBA Data Analysis:", {
    hasSummaryData: !!summaryData,
    hasFormattedData: !!formattedData,
    formattedDataStructure: formattedData ? Object.keys(formattedData) : null,
    formattedDataFull: formattedData,
    formattedDataData: formattedData?.data ? {
      hasCompanies: !!formattedData?.data?.companies,
      companiesCount: formattedData?.data?.companies?.length,
      hasItems: !!formattedData?.data?.items,
      itemsCount: formattedData?.data?.items?.length,
      companies: formattedData?.data?.companies?.map(c => c.name),
      items: formattedData?.data?.items?.map(i => i.title)
    } : null,
    rawSummaryDataPaths: {
      path1: summaryData?.data?.results?.length,
      path2: (summaryData?.data as any)?.results?.length,
      path3: (summaryData as any)?.results?.length
    },
    summaryDataFull: summaryData
  });

  return (
    <>
      <GoBack />
      {/* <Image src={logoPng} alt="logo" width={200} /> */}
      <div className="flex justify-center items-center flex-col mb-10">
        <Image src={logoPng.src} alt="logo" width={200} height={100} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
        <p>COMPETITIVE BID ANALYSIS (CBA)</p>
      </div>

      <div className="my-4 flex w-full font-bold justify-between items-center">
        <p className="uppercase">
          SUBJECT: CBA FOR {solicitation?.title} ({solicitation?.rfq_id})
        </p>
        <Button variant="custom">
          <span>
            <BsFiletypeCsv size={25} />
          </span>
          Download
        </Button>
      </div>

      {/* Show debug info and fallback when no formatted data */}
      {!formattedData?.data?.companies || !formattedData?.data?.items ? (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 mb-6">
          <h3 className="text-yellow-800 font-semibold mb-4">⚠️ CBA Data Debug Information</h3>

          <div className="space-y-4 text-sm">
            <div>
              <strong>Summary Data Status:</strong> {summaryData ? '✅ Available' : '❌ Not Available'}
            </div>

            <div>
              <strong>Formatted Data Status:</strong> {formattedData ? '✅ Available' : '❌ Not Available'}
            </div>

            {summaryData && (
              <div>
                <strong>Raw Summary Data Structure:</strong>
                <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(summaryData, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded">
              <p className="text-blue-800">
                <strong>Expected Data Sources:</strong>
              </p>
              <ul className="text-blue-700 mt-2 space-y-1">
                <li>• Manual Bid Submissions: {manualBidData ? '✅ Available' : '❌ Not Available'}</li>
                <li>• Vendor Bid Submissions: {vendorSubmissionData ? '✅ Available' : '❌ Not Available'}</li>
              </ul>

              {(manualError || vendorError) && (
                <div className="mt-3 text-red-700">
                  <strong>Errors:</strong>
                  {manualError && <div>• Manual Bid Error: {manualError.message}</div>}
                  {vendorError && <div>• Vendor Submission Error: {vendorError.message}</div>}
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded">
              <p className="text-green-800">
                <strong>API Call Details:</strong>
              </p>
              <ul className="text-green-700 mt-2 space-y-1">
                <li>• Solicitation ID: {id}</li>
                <li>• CBA ID: {cba}</li>
                <li>• Manual Bid API: {isManualLoading ? 'Loading...' : (manualBidData ? 'Success' : 'No Data')}</li>
                <li>• Vendor Submission API: {isVendorLoading ? 'Loading...' : (vendorSubmissionData ? 'Success' : 'No Data')}</li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto bg-white">
        <table className="min-w-full border-collapse border border-gray-300 rounded-sm p-10">
          <thead className="bg-gray-100">
            <tr>
              <td colSpan={3}></td>
              {formattedData?.data.companies.map((company: any, index: number) => (
                <td key={index} colSpan={3} className="text-center border-l">
                  {company?.name?.toUpperCase()}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="p-3 min-w-[50px]">S/N</td>
              <td className="p-3 min-w-[420px]">Items Description</td>
              <td className="p-3 min-w-[50px]">Qty</td>
              {formattedData?.data?.companies.map((company: any, index: number) => (
                <>
                  <td
                    key={`che-${index}`}
                    className="p-3 min-w-[50px] border-l"
                  >
                    {headerChecked !== undefined && (
                      <input
                        type="checkbox"
                        checked={headerChecked[company?.name]}
                        onChange={(e) =>
                          handleHeaderCheckboxChange(company, e.target.checked)
                        }
                      />
                    )}
                  </td>
                  <td key={`unit-price-${index}`} className="p-3 min-w-[190px]">
                    Unit Price
                  </td>
                  <td key={`total-${index}`} className="p-3 min-w-[190px]">
                    Total
                  </td>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {formattedData?.data?.items?.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.title}</td>
                <td className="p-3">{item.qty}</td>

                {formattedData?.data?.companies.map((company, idx) => (
                  <>
                    <td
                      key={`che-${item.id}-${idx}`}
                      className={
                        checkedItems[item.id]?.[company?.name]
                          ? "bg-green-100 rounded-md border-green-600 p-3 border border-r-0"
                          : "p-3 border-l"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          checkedItems[item.id]?.[company?.name] || false
                        }
                        onChange={(e) =>
                          handleCheckboxChange(
                            item.id,
                            company,
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td
                      key={`unit-price-${item.id}-${idx}`}
                      className={
                        checkedItems[item.id]?.[company?.name]
                          ? "bg-green-100 rounded-md border-green-600 p-3 border-y"
                          : "p-3"
                      }
                    >
                      <input
                        type="number"
                        value={item[company.name].unitPrice}
                        onChange={(e) =>
                          handleUnitPriceChange(e, item.id, company.name)
                        }
                        className="w-full px-2 py-1 border rounded-md"
                      />
                    </td>
                    <td
                      key={`total-${item.id}-${idx}`}
                      className={
                        checkedItems[item.id]?.[company?.name]
                          ? "bg-green-100 rounded-md border-green-600 p-3 border border-l-0"
                          : "p-3"
                      }
                    >
                      {Number(item[company?.name].total).toLocaleString()}
                    </td>
                  </>
                ))}
              </tr>
            ))}

            <tr className="border-b">
              <td colSpan={3} className="p-3">
                <div className="max-w-[326px] p-4 rounded-md mr-auto text-green-600 flex justify-between">
                  Grand Total:
                </div>
              </td>
              {formattedData?.data?.companies?.map((company: any, index: number) => (
                <td key={index} colSpan={3} className="p-3 border-l">
                  <div className="max-w-[326px] p-4 rounded-md ml-auto text-red-600 flex justify-between">
                    Total:
                    <span>
                      {Number(
                        checkedGrandTotal[company?.name]
                      ).toLocaleString()}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {extraSections.map((section, sectionIndex) => (
              <tr key={`section-${sectionIndex}`} className="border-b">
                <td colSpan={3} className="p-3 font-semibold align-top">
                  <div>
                    <div>{section.title}</div>
                    {section?.subLabels?.map((label, index) => (
                      <div key={index}>{label}</div>
                    ))}
                  </div>
                </td>
                {formattedData?.data.companies.map((company) => (
                  <td
                    key={`input-${sectionIndex}-${company.name}`}
                    colSpan={3}
                    className="p-3 border-l"
                  >
                    <input
                      type="text"
                      placeholder="Enter value"
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                ))}
              </tr>
            ))}

            {formattedData?.extraData?.map((extra) => (
              <tr key={extra?.id} className="border-b">
                <td colSpan={3} className="p-3">
                  {extra?.title}
                </td>
                {formattedData?.data.companies.map((company, idx) => (
                  <td
                    key={`extra-${extra?.id}-${company}-${idx}`}
                    colSpan={3}
                    className="p-3 border-l"
                  >
                    {extra[company?.name]?.text}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex my-4 px-8 max-w-[900px] justify-between items-center">
        <p className="text-[14px] uppercase">Award Recommendation :</p>
        <Textarea
          className="border rounded-md p-3 max-w-[400px]"
          placeholder="Enter recommendation here"
          onChange={(e) => setRecommendationNote(e.target.value)}
        />
      </div>

      <div className="flex w-full justify-end">
        <Button onClick={handleSubmitAnalysis} disabled={submissionLoading}>
          Submit Analysis
        </Button>
      </div>
    </>
  );
};

export default TableComponent;
