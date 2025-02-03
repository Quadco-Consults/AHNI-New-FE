import logoPng from "assets/svgs/logo-bg.svg";
import Card from "components/shared/Card";
import DataTable from "components/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { toWords } from "number-to-words";

const Order = () => {
  // Calculate the grand total
  const grandTotal = tableData.reduce((sum, item) => sum + item.total_price, 0);
  // Convert number to words
  const grandTotalWords = toWords(grandTotal).toUpperCase() + " NAIRA ONLY";

  return (
    <div className='bg-white p-8'>
      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
      </div>
      <div className='mt-14 w-full flex justify-between items-center'>
        <Card className='bg-alternate border-primary'>
          <p className='text-primary text-[18px] text-center mb-4 font-semibold'>
            PURCHASE ORDER
          </p>
          <div className=''>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'> Purchase Date</p>
              <p className=''>10/04/23</p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Purchase Order No.</p>
              <p className=''>ANHI-010-002-ABJ-2023</p>
            </div>
          </div>
        </Card>
        <Card className='bg-alternate text-center border-primary'>
          <p className='text-primary text-[18px] mb-4 font-semibold'>
            REQUESTING UNIT/DEPT{" "}
          </p>{" "}
          <div className=''>
            <p className='font-semibold text-[12px]'>
              GLOBAL FUND ANHI Project
            </p>
          </div>
        </Card>
      </div>
      <div className='bg-[#BE8800] text-white font-semibold text-[20px] p-[10px] my-4'>
        Vendor: HYBRID TECHNICAL COMPANY LIMITED
      </div>
      <div className='my-5'>
        <DataTable
          columns={tableColumns}
          data={tableData || []}
          headClass='p-0'
        />
      </div>
      <div className='flex flex-row-reverse gap-4'>
        {/* Grand Total Section */}
        <div className=''>
          <h3 className='font-bold text-lg'>
            Grand Total:
            <span className='font-normal ml-2'>
              ₦{grandTotal.toLocaleString()}
            </span>
          </h3>
          <div className='flex  mt-4 h-[211px] items-center border bg-gray-100  border-gray-300'>
            <div className='p-4'>
              <p className='text-[10px] p-0 text-start'>{grandTotalWords}</p>
            </div>
          </div>
        </div>
        <div className='text-[10px] max-w-[725px] my-4'>
          <h3 className='font-semibold'>General Conditions/Instructions</h3>
          <ul className='space-y-3 text-[10px] max-w-[725px] my-3'>
            <li>
              1. 1. The Vendor hereby undertakes not to advertise or otherwise
              make public the fact that such vendor is a supplier to AHNi;
            </li>
            <li>
              2. The Vendor shall in no other manner whatsoever use the name,
              emblem, logo or official seal/stamp of AHNi in connection with its
              business or service;
            </li>
            <li>
              3. A Check/Bank transfer for the Grand Total less withholding tax
              for Goods, Works or Services render shall be made payable to the
              Vendor upon confirmation and acceptance by AHNi;
            </li>
            <li>
              4. Payment shall be made within 10 working days after acceptance
              by AHNi and submission of payment INVOICE by the Vendor;
            </li>
            <li>
              5. This Purchase Order once issued is valid only for a period of
              60days unless it is otherwise extended in writing by AHNi;
            </li>
            <li>
              6. All Items listed in the Purchase Order are subject to Final
              Inspection and Acceptance by AHNi before payment is made to the
              Vendor;
            </li>
            <li>
              7. Withholding Tax (WHT) will be deducted from the Grand Total in
              compliance with relevant Tax Laws;
            </li>
            8. The Vendor will carry out duties and functions as described in
            this Purchase Order and/or Scope of Work/Annex. The Scope of Work
            /Annex can be amended during the validity period of the Purchase
            Order with the Vendor&apos;s agreement. Such amended must be done in
            writing with signatures of both parties;
            <li>
              9. It is AHNi’ s policy to comply with the laws and regulations of
              Nigeria, United State Government, European Union and the United
              Nations concerning the ineligibility of vendors, contractors, and
              service providers for reasons of FRAUD, CORRUPTION, TERRORISM,
              CHILD ABUSE and HUMAN TRAFFICKING. AHNi is prohibited from doing
              business with or providing support to any persons or entities that
              have been found to be engaged in or provide support for any such
              activities.
            </li>
          </ul>
        </div>
      </div>
      <div className=' w-full flex justify-between flex-wrap gap-8'>
        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>Authorized By:</p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Signature:</p>
              <p className=''>-</p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Director of Finance</p>
              <p className=''>-</p>
            </div>
          </div>
          <p></p>
        </Card>
        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>Approved By:</p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Signature:</p>
              <p className=''>-</p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Director of Operation</p>
              <p className=''>-</p>
            </div>
          </div>
          <p></p>
        </Card>{" "}
        <Card className='flex-1 border-primary'>
          <p className='text-[16px] font-semibold mb-2'>
            Agreed and Accepted By:
          </p>
          <div className='space-y-2'>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Signature:</p>
              <p className=''>-</p>
            </div>
            <div className='flex gap-2 text-[12px]'>
              <p className=' w-[122px] font-semibold'>Date</p>
              <p className=''>-</p>
            </div>
          </div>
          <p></p>
        </Card>
      </div>
    </div>
  );
};

export default Order;

const tableData = [
  {
    fco: "FCO-001",
    quantity_1: 10,
    quantity: 5,
    description: "Laptops - Dell Inspiron 15",
    unit_price: 250000,
    total_price: 1250000,
  },
  {
    fco: "FCO-002",
    quantity_1: 20,
    quantity: 10,
    description: "Office Chairs - Ergonomic Mesh",
    unit_price: 50000,
    total_price: 500000,
  },
  {
    fco: "FCO-003",
    quantity_1: 5,
    quantity: 2,
    description: "Printers - HP LaserJet Pro MFP",
    unit_price: 150000,
    total_price: 300000,
  },
  {
    fco: "FCO-004",
    quantity_1: 50,
    quantity: 25,
    description: "A4 Paper - 80gsm (Carton)",
    unit_price: 12000,
    total_price: 300000,
  },
];

const tableColumns: ColumnDef<any>[] = [
  {
    id: "deliveryLeadTime",
    header: () => <div className='bg-gray-200 p-4'>DELIVERY LEAD TIME</div>,
    columns: [
      {
        id: "leadTime",
        header: () => <div className=' p-4'>3 days after Signed P.O</div>,
        size: 120,
        columns: [
          {
            id: "fco",
            header: () => <div className='bg-gray-200 p-4'>FCO/BL</div>,
            accessorKey: "fco",
            size: 104,
          },
          {
            id: "qty1",
            header: () => <div className='bg-gray-200 p-4'>QTY</div>,
            accessorKey: "quantity_1",
            size: 81,
          },
          {
            id: "qty2",
            header: () => <div className='bg-gray-200 p-4'>QTY</div>,
            accessorKey: "quantity",
            size: 81,
          },
        ],
      },
    ],
  },
  {
    id: "shipTo",
    header: () => <div className='bg-gray-200 p-4'>SHIP TO ADDRESS</div>,
    columns: [
      {
        id: "office",
        header: () => <div className='p-4'>ANHI Head Office, Abuja</div>,
        size: 120,
        columns: [
          {
            id: "description",
            header: () => (
              <div className='bg-gray-200 p-4'>
                DESCRIPTION OF GOODS, WORKS OR SERVICES
              </div>
            ),
            accessorKey: "description",
            size: 473,
          },
        ],
      },
    ],
  },
  {
    id: "fcoGroup",
    header: () => <div className='bg-gray-200 p-4'>FCO</div>,
    columns: [
      {
        id: "fcoCode",
        header: () => <div className=' p-4'>1373.0003/460</div>,
        size: 120,
        columns: [
          {
            id: "unitPrice",
            header: () => <div className='bg-gray-200 p-4'>UNIT PRICE</div>,
            accessorKey: "unit_price",
            size: 160,
          },
        ],
      },
    ],
  },
  {
    id: "paymentTerms",
    header: () => <div className='bg-gray-200 p-4'>PAYMENT TERMS</div>,
    columns: [
      {
        id: "payment",
        header: () => <div className=' p-4'>100% After Delivery</div>,
        size: 210,
        columns: [
          {
            id: "totalPrice",
            header: () => <div className='bg-gray-200 p-4'>TOTAL PRICE</div>,
            accessorKey: "total_price",
            size: 120,
          },
        ],
      },
    ],
  },
];
