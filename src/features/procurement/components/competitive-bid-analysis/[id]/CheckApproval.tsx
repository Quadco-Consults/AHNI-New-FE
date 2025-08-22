import { skipToken } from "@reduxjs/toolkit/query";
import GoBack from "components/GoBack";
import { Loading } from "components/Loading";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { RouteEnum } from "constants/RouterConstants";
import useQuery from "hooks/use";
import { useAppDispatch } from "hooks/useStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ManualBidCbaPrequalificationAPI from "@/features/procurement/controllers/manual-bid-cba-prequalificationController";
import { toast } from "sonner";
import logoPng from "assets/svgs/logo-bg.svg";
import { FileDown } from "lucide-react";
import { BsFiletypeCsv } from "react-icons/bs";

const TableComponent = () => {
  const query = useQuery();
  const id = query.get("id");
  const cba = query.get("cba");

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: summaryData, isLoading } =
    ManualBidCbaPrequalificationAPI.useGetManualBidPrequalifications({
      path: {
        id: id ?? skipToken,
      },
    });

  const { createVendorBidAnalysis, isLoading: submissionLoading } =
    ManualBidCbaPrequalificationAPI.useCreateVendorBidAnalysis();

  const [recommendationNote, setRecommendationNote] = useState("");
  function formatBidData(inputData) {
    if (inputData) {
      const companies = [
        ...new Set(
          inputData.results.map((result) => ({
            name: result.vendor.company_name,
            id: result.vendor.id,
          }))
        ),
      ];

      const itemsMap = new Map();
      const extraDataMap = new Map();

      inputData.results.forEach((result) => {
        const companyName = result.vendor.company_name;

        result.bid_details.bidsubmissionitems.forEach((item) => {
          if (!itemsMap.has(item.solicitation_item_id)) {
            itemsMap.set(item.solicitation_item_id, {
              id: item?.solicitation_item_id,
              title: item.solicitation_item_name, // Adjust title as needed
              qty: 1,
            });
          }
          itemsMap.get(item.solicitation_item_id)[companyName] = {
            unitPrice: parseFloat(item.unit_price),
            total: parseFloat(item.total_price),
          };
        });

        result.bid_details.bid_evaluation_criteria.forEach((criteria) => {
          const criteriaName = criteria.evaluation_criteria.name;
          if (!extraDataMap.has(criteriaName)) {
            extraDataMap.set(criteriaName, {
              id: extraDataMap.size + 1,
              title: criteriaName,
              isExtra: true,
            });
          }
          extraDataMap.get(criteriaName)[companyName] = {
            text: criteria.response,
            bgColor: "bg-purple-100", // Customize as needed
          };
        });
      });

      return {
        data: {
          companies,
          items: Array.from(itemsMap.values()),
        },
        extraData: Array.from(extraDataMap.values()),
      };
    }
  }

  const formattedData = formatBidData(summaryData?.data);

  const [checkedItems, setCheckedItems] = useState({});

  const [headerChecked, setHeaderChecked] = useState({});

  const handleCheckboxChange = (itemId, company, checked) => {
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

  const handleHeaderCheckboxChange = (company, checked) => {
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
      formattedData?.data?.companies?.reduce((acc, company) => {
        acc[company?.name] = false;
        return acc;
      }, {})
    );
    setCheckedItems(
      formattedData?.data?.items?.reduce((acc, item) => {
        acc[item.id] = formattedData?.data?.companies?.reduce(
          (companyAcc, company) => {
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
    return formattedData?.data?.companies.reduce((totals, company) => {
      totals[company?.name] = formattedData?.data?.items.reduce((sum, item) => {
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

  // Function to format selected items per vendor
  const getSelectedItemsForVendor = (vendor) => {
    const selectedItems = formattedData?.data?.items
      .filter((item) => checkedItems[item.id]?.[vendor?.name])
      .map((item) => item.id);

    return selectedItems;
  };

  const [updatedPrices, setUpdatedPrices] = useState({});

  const handleUnitPriceChange = (e, itemId, companyName) => {
    const newPrice = parseFloat(e.target.value) || 0;

    setUpdatedPrices((prevPrices) => ({
      ...prevPrices,
      [itemId]: {
        ...prevPrices[itemId],
        [companyName]: newPrice,
      },
    }));

    // Update total price as well
    // setFormattedData((prevData) => {
    //   const newData = { ...prevData };
    //   const itemIndex = newData.data.items.findIndex((i) => i.id === itemId);

    //   if (itemIndex !== -1) {
    //     newData.data.items[itemIndex][companyName].unitPrice = newPrice;
    //     newData.data.items[itemIndex][companyName].total =
    //       newPrice * newData.data.items[itemIndex].qty;
    //   }

    //   return newData;
    // });
  };

  const handleSubmitAnalysis = async () => {
    if (!cba || !id) return alert("Missing required IDs");

    const selectedVendors = formattedData?.data?.companies.filter((vendor) =>
      Object.values(checkedItems).some((item) => item[vendor?.name])
    );

    if (!selectedVendors.length) {
      return toast.error("No vendors selected.");
    }

    try {
      const apiCalls = selectedVendors.map((vendor) => {
        const payload = {
          cba_id: cba,
          vendor_id: vendor?.id, // Assuming `vendor` is the vendor ID
          recommendation_note: recommendationNote,
          selected_items: getSelectedItemsForVendor(vendor),
          solicitation_id: id,
        };

        return createVendorBidAnalysis(payload)();
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
  console.log({
    summaryData,
    summaryDatax: summaryData?.data?.results[0]?.solicitation?.title,
  });
  const solicitation = summaryData?.data?.results[0]?.solicitation;
  return (
    <>
      <GoBack />
      <div className=' bg-white p-6 mt-8'>
        <div className='flex justify-center items-center flex-col mb-10'>
          <img src={logoPng} alt='logo' width={200} />
          <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
          <p>COMPETITIVE BID ANALYSIS (CBA)</p>
        </div>

        <div className='my-4 flex w-full font-bold justify-between items-center'>
          <p className='uppercase'>
            SUBJECT: CBA FOR {solicitation?.title} ({solicitation?.rfq_id})
          </p>
          <Button variant='custom'>
            <span>
              <BsFiletypeCsv size={25} />
            </span>
            Download
          </Button>
        </div>
        <div className=' overflow-x-auto bg-white'>
          {" "}
          {/* Add overflow-x-auto for horizontal scrolling */}
          <table className='min-w-full border-collapse border border-gray-300 rounded-sm p-10'>
            <thead className='bg-gray-100'>
              <tr>
                <td colSpan={3} className=''></td>
                {formattedData?.data.companies.map((company, index) => (
                  <td key={index} colSpan={3} className=' text-center border-l'>
                    {company?.name?.toUpperCase()}
                  </td>
                ))}
              </tr>
              <tr className='border-b'>
                <td className='p-3 min-w-[50px]'>S/N</td>
                <td className='p-3 min-w-[420px]'>Items Description</td>
                <td className='p-3 min-w-[50px]'>Qty</td>
                {formattedData?.data?.companies.map((company, index) => {
                  return (
                    <>
                      <td
                        key={`che-${index}`}
                        className='p-3 min-w-[50px] border-l '
                      >
                        {headerChecked !== undefined && (
                          <input
                            type='checkbox'
                            checked={headerChecked[company?.name]}
                            onChange={(e) =>
                              handleHeaderCheckboxChange(
                                company,
                                e.target.checked
                              )
                            }
                          />
                        )}
                      </td>
                      <td
                        key={`unit-price-${index}`}
                        className='p-3 min-w-[190px]'
                      >
                        unit price
                      </td>
                      <td key={`total-${index}`} className='p-3 min-w-[190px]'>
                        Total
                      </td>
                    </>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {formattedData?.data?.items?.map((item, index) => (
                <tr key={item.id} className='border-b'>
                  <td className='p-3'>{index + 1}</td>
                  <td className='p-3'>{item.title}</td>
                  <td className='p-3'>{item.qty}</td>

                  {formattedData?.data?.companies.map((company, idx) => {
                    // checkedItems !== undefined &&

                    if (checkedItems !== undefined) {
                      return (
                        <>
                          <td
                            key={`che-${item.id}-${idx}`}
                            className={
                              checkedItems[item.id]?.[company?.name]
                                ? "bg-green-100 rounded-md border-green-600 p-3 border border-r-0"
                                : " p-3 border-l"
                            }
                          >
                            {checkedItems !== undefined && (
                              <input
                                type='checkbox'
                                checked={
                                  checkedItems[item.id]?.[company?.name] ||
                                  false
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    item.id,
                                    company,
                                    e.target.checked
                                  )
                                }
                              />
                            )}
                          </td>
                          <td
                            key={`unit-price-${item.id}-${idx}`}
                            className={
                              checkedItems[item.id]?.[company?.name]
                                ? "bg-green-100 rounded-md border-green-600  p-3 border-y"
                                : " p-3"
                            }
                          >
                            {/* {item[company.name].unitPrice} */}
                            <input
                              type='number'
                              value={item[company.name].unitPrice}
                              onChange={(e) =>
                                handleUnitPriceChange(e, item.id, company.name)
                              }
                              className='w-full px-2 py-1 border rounded-md'
                            />
                          </td>
                          <td
                            key={`total-${item.id}-${idx}`}
                            className={
                              checkedItems[item.id]?.[company?.name]
                                ? "bg-green-100 rounded-md border-green-600  p-3  border border-l-0"
                                : " p-3"
                            }
                          >
                            {Number(item[company?.name].total).toLocaleString()}
                          </td>
                        </>
                      );
                    }
                  })}
                </tr>
              ))}
              <tr className='border-b'>
                <td colSpan={3} className='p-3'>
                  <div className='max-w-[326px] p-4 rounded-md mr-auto text-green-600 flex justify-between'>
                    Grand Total:
                    {/* <span>
                      {Number(checkedOverallGrandTotal).toLocaleString()}
                    </span> */}
                  </div>
                </td>
                {formattedData?.data?.companies?.map((company, index) => (
                  <td key={index} colSpan={3} className='p-3 border-l'>
                    <div className=' max-w-[326px] p-4 rounded-md ml-auto text-red-600 flex justify-between'>
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
                <tr key={`section-${sectionIndex}`} className='border-b'>
                  <td colSpan={3} className='p-3 font-semibold align-top'>
                    {section.title}
                    {section?.subLabels?.map((label, index) => (
                      <p key={index}>{label}</p>
                    ))}
                  </td>

                  {formattedData?.data.companies.map(
                    (company, companyIndex) => (
                      <td
                        key={`input-${sectionIndex}-${company.name}`}
                        colSpan={3}
                        className='p-3 border-l'
                      >
                        {
                          <input
                            type='text'
                            name={`section-${sectionIndex}-${company.name}`}
                            placeholder='Enter value'
                            className='w-full border px-2 py-1 rounded'
                          />
                        }
                      </td>
                    )
                  )}
                </tr>
              ))}

              {formattedData?.extraData?.map((extra) => {
                return (
                  <tr key={extra?.id} className='border-b'>
                    <td colSpan={3} className='p-3'>
                      {extra?.title}
                    </td>
                    {formattedData?.data.companies.map((company, idx) => (
                      <td
                        key={`extra-${extra?.id}-${company}-${idx}`}
                        colSpan={3}
                        className={`p-3 border-l`}
                      >
                        {extra[company?.name]?.text}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='flex my-4 px-8 max-w-[900px]  justify-between items-center'>
          <p className='text-[14px] uppercase'> Award Recommendation :</p>
          <Textarea
            className='border rounded-md p-3 max-w-[400px]'
            placeholder='Enter recommendation here'
            onChange={(e) => setRecommendationNote(e.target.value)}
          />
        </div>
        <div className='flex w-full justify-end'>
          <Button onClick={handleSubmitAnalysis} disabled={submissionLoading}>
            Submit Analysis
          </Button>
        </div>
      </div>
    </>
  );
};

export default TableComponent;
