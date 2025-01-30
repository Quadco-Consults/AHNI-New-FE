import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import DataTable from "components/Table/DataTable";
import { Checkbox } from "components/ui/checkbox";
import clsx from "clsx"; // For conditional class handling

const CheckApproval = () => {
  const [selectedCompanies, setSelectedCompanies] = useState<
    Record<string, Record<number, boolean>>
  >({});
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [dummyData, setDummyData] = useState<any[]>([]);
  const [extraData, setExtraData] = useState<any[]>([]);

  // Dummy data simulating the response
  useEffect(() => {
    const data = {
      companies: ["Sunok", "Southgate", "TechX"], // Example of dynamic company names
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
        title: "Delivery Timefame",
        qty: 4,
        Sunok: "2-3 Weeks",
        Southgate: "2-3 Weeks",
        TechX: "2-3 Weeks",
      },
    ];

    setDummyData(data.items);
    setExtraData(extraData);
    setCompanyNames(data.companies);

    const initialSelections: Record<string, Record<number, boolean>> = {};
    data.companies.forEach((company) => {
      initialSelections[company] = {};
    });
    setSelectedCompanies(initialSelections);
  }, []);

  const toggleRowSelection = (company: string, id: number, value: boolean) => {
    setSelectedCompanies((prev) => ({
      ...prev,
      [company]: {
        ...prev[company],
        [id]: value,
      },
    }));
  };

  const toggleSelectAll = (company: string, value: boolean) => {
    const allIds = [
      ...dummyData.map((row) => row.id),
      ...extraData.map((row) => row.id),
    ];
    const newState = Object.fromEntries(allIds.map((id) => [id, value]));

    setSelectedCompanies((prev) => ({
      ...prev,
      [company]: newState,
    }));
  };

  // Function to calculate total for each company and grand total
  const calculateTotals = () => {
    let grandTotal = 0;
    const combinedData = [...dummyData, ...extraData]; // Combine both data sets

    companyNames.forEach((company) => {
      combinedData.forEach((row) => {
        grandTotal += row[company]?.total || 0;
      });
    });

    return grandTotal;
  };

  const grandTotal = calculateTotals();

  const combinedData = [...dummyData, ...extraData]; // Combine both data sets for rendering

  return (
    <div>
      <div className='flex justify-between items-center'>
        <GoBack />
      </div>
      <div className='my-8'>
        <Card>
          <DataTable
            data={combinedData}
            columns={columns(
              selectedCompanies,
              toggleRowSelection,
              toggleSelectAll,
              companyNames
            )}
          />
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

const columns = (
  selectedCompanies: Record<string, Record<number, boolean>>,
  toggleRowSelection: Function,
  toggleSelectAll: Function,
  companyNames: string[]
): ColumnDef<any>[] => {
  // Dynamically generate columns for each company
  return [
    {
      header: " ",
      columns: [
        {
          header: "S/N",
          accessorKey: "id",
          size: 50,
          cell: ({ row }) => row.original.id,
        },
        {
          header: "Items Description",
          accessorKey: "title",
          size: 420,
          cell: ({ row }) => row.original.title,
        },
        {
          header: "Qty",
          accessorKey: "qty",
          size: 50,
          cell: ({ row }) => row.original.qty,
        },
      ],
    },
    ...companyNames.map((company) => ({
      header: company.toUpperCase(), // Dynamic header name
      columns: [
        {
          id: `select_${company}`,
          size: 50,
          header: () => {
            const allSelected = Object.values(
              selectedCompanies[company] || {}
            ).every((val) => val);
            return (
              <Checkbox
                checked={allSelected}
                onCheckedChange={(value) => toggleSelectAll(company, !!value)}
              />
            );
          },
          cell: ({ row }) => (
            <Checkbox
              checked={!!selectedCompanies[company][row.original.id]}
              onCheckedChange={(value) =>
                toggleRowSelection(company, row.original.id, !!value)
              }
            />
          ),
        },
        {
          header: "Unit price",
          accessorKey: `${company}.unitPrice`,
          size: 150,
          cell: ({ row }) => (
            <div
              className={clsx(
                "",
                selectedCompanies[company][row.original.id] && "bg-blue-200"
              )}
            >
              {row.original[company]?.unitPrice}
            </div>
          ),
        },
        {
          header: "Total",
          accessorKey: `${company}.total`,
          size: 150,
          cell: ({ row }) => (
            <div
              className={clsx(
                "p-2",
                selectedCompanies[company][row.original.id] && "bg-blue-200"
              )}
            >
              {row.original[company]?.total}
            </div>
          ),
        },
      ],
    })),
  ];
};
