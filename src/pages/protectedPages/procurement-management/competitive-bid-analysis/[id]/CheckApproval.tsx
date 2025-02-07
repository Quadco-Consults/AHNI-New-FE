import GoBack from "components/shared/GoBack";
import { Loading } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { useEffect, useState } from "react";
import ManualBidCbaPrequalificationAPI from "services/procurementApi/manual-bid-cba-prequalification";

const TableComponent = () => {
  const { data: summaryData, isLoading } =
    ManualBidCbaPrequalificationAPI.useGetManualBidPrequalificationsQuery({
      path: {
        id: "437df88e-1e38-40f1-9b71-bc471b34dc6f",
      },
    });

  console.log({ summaryData, isLoading });

  function formatBidData(inputData) {
    console.log({ inputData });

    if (inputData) {
      const companies = [
        ...new Set(
          inputData.results.map((result) => result.vendor.company_name)
        ),
      ];
      console.log({ companies });

      const itemsMap = new Map();
      const extraDataMap = new Map();

      inputData.results.forEach((result) => {
        const companyName = result.vendor.company_name;

        result.bid_details.bidsubmissionitems.forEach((item) => {
          if (!itemsMap.has(item.solicitation_item)) {
            itemsMap.set(item.solicitation_item, {
              id: itemsMap.size + 1,
              title: `Item ${itemsMap.size + 1}`, // Adjust title as needed
              qty: 1,
            });
          }
          itemsMap.get(item.solicitation_item)[companyName] = {
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

  // Example usage:
  const formattedData = formatBidData(summaryData?.data);
  console.log({ formattedData });

  const [checkedItems, setCheckedItems] = useState({});

  const [headerChecked, setHeaderChecked] = useState({});
  console.log({ headerChecked, checkedItems });

  const handleCheckboxChange = (itemId, company, checked) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = {
        ...prevCheckedItems,
        [itemId]: {
          ...prevCheckedItems[itemId],
          [company]: checked,
        },
      };

      const allChecked = formattedData?.data?.items?.every((item) => {
        return updatedCheckedItems[item.id]?.[company] || false;
      });

      setHeaderChecked((prevHeaderChecked) => ({
        ...prevHeaderChecked,
        [company]: allChecked,
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
          [company]: checked,
        };
      });
      return updatedCheckedItems;
    });

    setHeaderChecked((prevHeaderChecked) => ({
      ...prevHeaderChecked,
      [company]: checked,
    }));
  };

  useEffect(() => {
    setHeaderChecked(
      formattedData?.data?.companies?.reduce((acc, company) => {
        acc[company] = false;
        return acc;
      }, {})
    );
    setCheckedItems(
      formattedData?.data?.items?.reduce((acc, item) => {
        acc[item.id] = formattedData?.data?.companies?.reduce(
          (companyAcc, company) => {
            companyAcc[company] = false;
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
      totals[company] = formattedData?.data?.items.reduce((sum, item) => {
        if (checkedItems !== undefined && checkedItems[item.id]?.[company]) {
          return sum + (item[company]?.total || 0);
        }
        return sum;
      }, 0);
      return totals;
    }, {} as Record<string, number>);
  };

  const checkedGrandTotal = calculateCheckedGrandTotal();
  console.log({ checkedGrandTotal });

  const checkedOverallGrandTotal =
    checkedGrandTotal &&
    Object.values(checkedGrandTotal!)?.reduce((sum, total) => sum + total, 0);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <GoBack />
      <div className=' bg-white p-6 mt-8'>
        <div className=' overflow-x-auto bg-white'>
          {" "}
          {/* Add overflow-x-auto for horizontal scrolling */}
          <table className='min-w-full border-collapse border border-gray-300 rounded-sm p-10'>
            <thead className='bg-gray-100'>
              <tr>
                <td colSpan={3} className=''></td>
                {formattedData?.data.companies.map((company, index) => (
                  <td key={index} colSpan={3} className=' text-center border-l'>
                    {company.toUpperCase()}
                  </td>
                ))}
              </tr>
              <tr className='border-b'>
                <td className='p-3 min-w-[50px]'>S/N</td>
                <td className='p-3 min-w-[420px]'>Items Description</td>
                <td className='p-3 min-w-[50px]'>Qty</td>
                {formattedData?.data?.companies.map((company, index) => {
                  console.log({ company });

                  return (
                    <>
                      <td
                        key={`che-${index}`}
                        className='p-3 min-w-[50px] border-l '
                      >
                        {headerChecked !== undefined && (
                          <input
                            type='checkbox'
                            checked={headerChecked[company]}
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
                    console.log({ company });
                    // checkedItems !== undefined &&

                    if (checkedItems !== undefined) {
                      return (
                        <>
                          <td
                            key={`che-${item.id}-${idx}`}
                            className={
                              checkedItems[item.id]?.[company]
                                ? "bg-green-100 rounded-md border-green-600 p-3 border border-r-0"
                                : " p-3 border-l"
                            }
                          >
                            {checkedItems !== undefined && (
                              <input
                                type='checkbox'
                                checked={
                                  checkedItems[item.id]?.[company] || false
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
                              checkedItems[item.id]?.[company]
                                ? "bg-green-100 rounded-md border-green-600  p-3 border-y"
                                : " p-3"
                            }
                          >
                            {item[company].unitPrice}
                          </td>
                          <td
                            key={`total-${item.id}-${idx}`}
                            className={
                              checkedItems[item.id]?.[company]
                                ? "bg-green-100 rounded-md border-green-600  p-3  border border-l-0"
                                : " p-3"
                            }
                          >
                            {item[company].total}
                          </td>
                        </>
                      );
                    }
                  })}
                </tr>
              ))}
              <tr className='border-b'>
                <td colSpan={3} className='p-3'>
                  <div className=' border border-green-600 max-w-[326px] p-4 rounded-md ml-auto text-green-600 flex justify-between'>
                    Grand Total:
                    <span>{checkedOverallGrandTotal}</span>
                  </div>
                </td>
                {formattedData?.data?.companies?.map((company, index) => (
                  <td key={index} colSpan={3} className='p-3 border-l'>
                    <div className=' border border-red-600 max-w-[326px] p-4 rounded-md ml-auto text-red-600 flex justify-between'>
                      Total:
                      <span>{checkedGrandTotal[company]}</span>
                    </div>
                  </td>
                ))}
              </tr>

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
                        {extra[company]?.text}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='flex my-4 px-8 max-w-[900px]  justify-between items-center'>
          <p className='text-[14px]'>RECOMMENDATION NOTES :</p>
          <Textarea
            className='border rounded-md p-3 max-w-[400px]'
            placeholder='Enter recommendation here'
          />
        </div>
        <div className='flex w-full justify-end'>
          <Button>Submit Analysis</Button>
        </div>
      </div>
    </>
  );
};

export default TableComponent;

type CompanyData = {
  unitPrice: number;
  total: number;
};

type ItemData = {
  id: number;
  title: string;
  qty: number;
  Sunok: CompanyData;
  Southgate: CompanyData;
  TechX: CompanyData;
  Alpha: CompanyData;
  Beta: CompanyData;
  Gamma: CompanyData;
};

type Data = {
  companies: string[];
  items: ItemData[];
};
