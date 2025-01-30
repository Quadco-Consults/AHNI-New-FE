import { useState, useEffect } from "react";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
} from "components/ui/table";
import { Checkbox } from "components/ui/checkbox";
import clsx from "clsx";

const CheckApproval = () => {
  const [selectedCompanies, setSelectedCompanies] = useState({});
  const [companyNames, setCompanyNames] = useState([]);
  const [dummyData, setDummyData] = useState([]);
  const [extraData, setExtraData] = useState([]);

  useEffect(() => {
    const data = {
      companies: ["Sunok", "Southgate", "TechX"],
      items: [
        {
          id: 1,
          title: "Laptop",
          qty: 5,
          Sunok: { unitPrice: 500, total: 2500 },
          Southgate: { unitPrice: 520, total: 2600 },
          TechX: { unitPrice: 510, total: 2550 },
        },
        {
          id: 2,
          title: "Projector",
          qty: 2,
          Sunok: { unitPrice: 800, total: 1600 },
          Southgate: { unitPrice: 820, total: 1640 },
          TechX: { unitPrice: 810, total: 1620 },
        },
        {
          id: 3,
          title: "Printer",
          qty: 3,
          Sunok: { unitPrice: 300, total: 900 },
          Southgate: { unitPrice: 320, total: 960 },
          TechX: { unitPrice: 310, total: 930 },
        },
      ],
    };

    const extraData = [
      {
        id: 4,
        title: "Delivery Timeframe",
        qty: 4,
        Sunok: "2-3 Weeks",
        Southgate: "2-3 Weeks",
        TechX: "2-3 Weeks",
      },
    ];

    setDummyData(data.items);
    setExtraData(extraData);
    setCompanyNames(data.companies);

    const initialSelections = {};
    data.companies.forEach((company) => {
      initialSelections[company] = {};
    });
    setSelectedCompanies(initialSelections);
  }, []);

  const toggleRowSelection = (company, id, value) => {
    setSelectedCompanies((prev) => ({
      ...prev,
      [company]: { ...prev[company], [id]: value },
    }));
  };

  const toggleSelectAll = (company, value) => {
    const allIds = [
      ...dummyData.map((row) => row.id),
      ...extraData.map((row) => row.id),
    ];
    const newState = Object.fromEntries(allIds.map((id) => [id, value]));
    setSelectedCompanies((prev) => ({ ...prev, [company]: newState }));
  };

  const calculateTotals = () => {
    let grandTotal = 0;
    const combinedData = [...dummyData, ...extraData];
    companyNames.forEach((company) => {
      combinedData.forEach((row) => {
        grandTotal += row[company]?.total || 0;
      });
    });
    return grandTotal;
  };

  const grandTotal = calculateTotals();
  const combinedData = [...dummyData, ...extraData];

  return (
    <div>
      <div className='flex justify-between items-center'>
        <GoBack />
      </div>
      <div className='my-8'>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                {companyNames.map((company) => (
                  <TableCell
                    colSpan={3}
                    className='text-center font-bold'
                    key={company}
                  >
                    {company.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className='font-bold'>S/N</TableCell>
                <TableCell className='font-bold'>Items Description</TableCell>
                <TableCell className='font-bold'>Qty</TableCell>
                {companyNames.map((company) => (
                  <>
                    <TableCell className='font-bold'>
                      <Checkbox
                        checked={Object.values(
                          selectedCompanies[company] || {}
                        ).every(Boolean)}
                        onCheckedChange={(value) =>
                          toggleSelectAll(company, !!value)
                        }
                      />
                    </TableCell>
                    <TableCell className='font-bold'>Unit Price</TableCell>
                    <TableCell className='font-bold'>Total</TableCell>
                  </>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {combinedData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.qty}</TableCell>
                  {companyNames.map((company) => (
                    <>
                      <TableCell>
                        <Checkbox
                          checked={!!selectedCompanies[company]?.[row.id]}
                          onCheckedChange={(value) =>
                            toggleRowSelection(company, row.id, !!value)
                          }
                        />
                      </TableCell>
                      <TableCell
                        className={clsx(
                          "p-2",
                          selectedCompanies[company]?.[row.id] && "bg-blue-200"
                        )}
                      >
                        {row[company]?.unitPrice || "-"}
                      </TableCell>
                      <TableCell
                        className={clsx(
                          "p-2",
                          selectedCompanies[company]?.[row.id] && "bg-blue-200"
                        )}
                      >
                        {row[company]?.total || "-"}
                      </TableCell>
                    </>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className='font-bold'>
                  Grand Total:
                </TableCell>
                {companyNames.map((company) => (
                  <TableCell colSpan={3} key={company}></TableCell>
                ))}
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
      </div>
      <div className='mt-4'>
        <div>
          <strong>Grand Total: </strong>
          {grandTotal}
        </div>
      </div>
      Approval
    </div>
  );
};

export default CheckApproval;
