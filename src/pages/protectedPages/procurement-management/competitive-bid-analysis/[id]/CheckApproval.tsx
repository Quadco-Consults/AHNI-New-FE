import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { useState } from "react";
import ManualBidCbaPrequalificationAPI from "services/procurementApi/manual-bid-cba-prequalification";

const TableComponent = () => {
  const { data: summaryData, isLoading } =
    ManualBidCbaPrequalificationAPI.useGetManualBidPrequalificationsQuery({
      path: {
        id: "437df88e-1e38-40f1-9b71-bc471b34dc6f",
      },
    });

  console.log({ summaryData, isLoading });

  // State for brand inputs
  const [brandInputs, setBrandInputs] = useState<Record<string, string>>(
    () =>
      data.companies.reduce((acc, company) => {
        acc[company] = ""; // Initialize empty values for brand inputs
        return acc;
      }, {} as Record<string, string>) // Provide type to the accumulator
  );

  const grandTotal = data.companies.reduce((totals, company) => {
    totals[company] = data.items.reduce(
      (sum, item) =>
        sum + (item[company as keyof ItemData] as CompanyData).total,
      0
    );
    return totals;
  }, {} as Record<string, number>);

  const overallGrandTotal = data.companies.reduce(
    (sum, company) => sum + grandTotal[company],
    0
  );

  const [checkedItems, setCheckedItems] = useState(() =>
    data.items.reduce((acc, item) => {
      acc[item.id] = data.companies.reduce((companyAcc, company) => {
        companyAcc[company] = false;
        return companyAcc;
      }, {});
      return acc;
    }, {})
  );

  const [headerChecked, setHeaderChecked] = useState(() =>
    data.companies.reduce((acc, company) => {
      acc[company] = false;
      return acc;
    }, {})
  );

  const handleCheckboxChange = (itemId, company, checked) => {
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = {
        ...prevCheckedItems,
        [itemId]: {
          ...prevCheckedItems[itemId],
          [company]: checked,
        },
      };

      const allChecked = data.items.every((item) => {
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
      data.items.forEach((item) => {
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

  const handleInputChange = (company, value) => {
    setBrandInputs((prevInputs) => ({
      ...prevInputs,
      [company]: value,
    }));
  };

  return (
    <>
      <GoBack />
      <div className=' bg-white p-6 mt-8'>
        <div className='flex w-full justify-end mb-5'>
          <Button>Check Approval</Button>
        </div>
        <div className=' overflow-x-auto bg-white'>
          {" "}
          {/* Add overflow-x-auto for horizontal scrolling */}
          <table className='min-w-full border-collapse border border-gray-300 rounded-sm p-10'>
            <thead className='bg-gray-100'>
              <tr>
                <td colSpan={3} className=''></td>
                {data.companies.map((company, index) => (
                  <td key={index} colSpan={3} className=' text-center border-l'>
                    {company.toUpperCase()}
                  </td>
                ))}
              </tr>
              <tr className='border-b'>
                <td className='p-3 min-w-[50px]'>S/N</td>
                <td className='p-3 min-w-[420px]'>Items Description</td>
                <td className='p-3 min-w-[50px]'>Qty</td>
                {data.companies.map((company, index) => (
                  <>
                    <td
                      key={`che-${index}`}
                      className='p-3 min-w-[50px] border-l '
                    >
                      <input
                        type='checkbox'
                        checked={headerChecked[company]}
                        onChange={(e) =>
                          handleHeaderCheckboxChange(company, e.target.checked)
                        }
                      />
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
                ))}
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className='border-b'>
                  <td className='p-3'>{index + 1}</td>
                  <td className='p-3'>{item.title}</td>
                  <td className='p-3'>{item.qty}</td>

                  {data.companies.map((company, idx) => (
                    <>
                      <td
                        key={`che-${item.id}-${idx}`}
                        className={
                          checkedItems[item.id]?.[company]
                            ? "bg-green-100 rounded-md border-green-600 p-3 border border-r-0"
                            : " p-3 border-l"
                        }
                      >
                        <input
                          type='checkbox'
                          checked={checkedItems[item.id]?.[company] || false}
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
                  ))}
                </tr>
              ))}
              <tr className='border-b'>
                <td colSpan={3} className='p-3'>
                  <div className=' border border-green-600 max-w-[326px] p-4 rounded-md ml-auto text-green-600 flex justify-between'>
                    Grand Total:
                    <span>{overallGrandTotal}</span>
                  </div>
                </td>
                {data.companies.map((company, index) => (
                  <td key={index} colSpan={3} className='p-3 border-l'>
                    <div className=' border border-red-600 max-w-[326px] p-4 rounded-md ml-auto text-red-600 flex justify-between'>
                      Total:
                      <span>{grandTotal[company]}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Brand Input Row */}
              <tr className='border-b'>
                <td colSpan={3} className='p-3 '>
                  Brand
                </td>
                {data.companies.map((company, idx) => (
                  <td
                    key={`${company}-${idx}`}
                    colSpan={3}
                    className='border-l p-3'
                  >
                    <Textarea
                      value={brandInputs[company] || ""}
                      onChange={(e) =>
                        handleInputChange(company, e.target.value)
                      }
                      className='w-full border p-3'
                      placeholder='Enter list of brands'
                    />
                  </td>
                ))}
              </tr>

              {extraData.map((extra) => {
                return (
                  <tr key={extra.id} className='border-b'>
                    <td colSpan={3} className='p-3'>
                      {extra.title}
                    </td>
                    {data.companies.map((company, idx) => (
                      <td
                        key={`extra-${extra.id}-${company}-${idx}`}
                        colSpan={3}
                        className={`p-3 border-l`}
                      >
                        {extra[company].text}
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

const data: Data = {
  companies: ["Sunok", "Southgate", "TechX", "Alpha", "Beta", "Gamma"],
  items: [
    {
      id: 1,
      title: "Laptop",
      qty: 5,
      Sunok: { unitPrice: 500, total: 2500 },
      Southgate: { unitPrice: 520, total: 2600 },
      TechX: { unitPrice: 510, total: 2550 },
      Alpha: { unitPrice: 530, total: 2650 },
      Beta: { unitPrice: 550, total: 2750 },
      Gamma: { unitPrice: 540, total: 2700 },
    },
    {
      id: 2,
      title: "Projector",
      qty: 2,
      Sunok: { unitPrice: 800, total: 1600 },
      Southgate: { unitPrice: 820, total: 1640 },
      TechX: { unitPrice: 810, total: 1620 },
      Alpha: { unitPrice: 830, total: 1660 },
      Beta: { unitPrice: 850, total: 1700 },
      Gamma: { unitPrice: 840, total: 1680 },
    },
    {
      id: 3,
      title: "Printer",
      qty: 3,
      Sunok: { unitPrice: 300, total: 900 },
      Southgate: { unitPrice: 320, total: 960 },
      TechX: { unitPrice: 310, total: 930 },
      Alpha: { unitPrice: 330, total: 990 },
      Beta: { unitPrice: 350, total: 1050 },
      Gamma: { unitPrice: 340, total: 1020 },
    },
  ],
};

const extraData = [
  {
    id: 4,
    title: "Delivery Timeframe",
    Sunok: { text: "2-3 Weeks", bgColor: "bg-purple-100" },
    Southgate: { text: "2-3 Weeks", bgColor: "bg-purple-400" },
    TechX: { text: "2-3 Weeks", bgColor: "bg-purple-300" },
    Alpha: { text: "1-2 Weeks", bgColor: "bg-purple-500" },
    Beta: { text: "1-2 Weeks", bgColor: "bg-purple-600" },
    Gamma: { text: "3-4 Weeks", bgColor: "bg-purple-700" },
    isExtra: true,
  },
  {
    id: 5,
    title: "Bank Account",
    Sunok: { text: "YES", bgColor: "bg-purple-300" },
    Southgate: { text: "No", bgColor: "bg-purple-200" },
    TechX: { text: "YES", bgColor: "bg-purple-600" },
    Alpha: { text: "YES", bgColor: "bg-purple-500" },
    Beta: { text: "No", bgColor: "bg-purple-700" },
    Gamma: { text: "YES", bgColor: "bg-purple-800" },
    isExtra: true,
  },
  {
    id: 6,
    title: "Registration with C.A.C.",
    Sunok: { text: "YES", bgColor: "bg-green-300" },
    Southgate: { text: "No", bgColor: "bg-green-200" },
    TechX: { text: "YES", bgColor: "bg-green-600" },
    Alpha: { text: "YES", bgColor: "bg-green-500" },
    Beta: { text: "No", bgColor: "bg-green-600" },
    Gamma: { text: "YES", bgColor: "bg-green-800" },
    isExtra: true,
  },
];

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
