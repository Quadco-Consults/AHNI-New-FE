import { useNavigate } from 'react-router-dom';
import LongArrowLeft from 'components/icons/LongArrowLeft';


const PurchaseRequesttDetails = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="relative min-h-screen space-y-6">
      <button
        onClick={goBack}
        className="absolute -top-10 left-0 flex aspect-square w-[3rem] items-center justify-center rounded-full bg-white drop-shadow-md"
      >
        <LongArrowLeft />
      </button>
      <section className="relative top-5 w-full space-y-8 pb-[5rem]">
        <h3 className="text-primary text-xl font-semibold">
          Purchase Request Details
        </h3>
        <div className="grid grid-cols-4 gap-5">
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Date of Request:</h6>
            <p className="text-xs">4/27/2023</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Required Date:</h6>
            <p className="text-xs">4/27/2023</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Requesting Dept:</h6>
            <p className="text-xs">Admin</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Deliver to:</h6>
            <p className="text-xs">AHNi HQ-Abuja</p>
          </span>
        </div>

        {/* table showing all results of the page */}
        <table className="w-full">
          <thead>
            <tr className="text-amber-500 whitespace-nowrap border-b-2 py-4 text-sm font-semibold">
              <th className="w-fit py-4 text-left">S/N</th>
              <th className="w-fit py-4 text-left">
                Description of items/services
              </th>
              <th className="w-fit py-4 text-left">NO of Persons/Unit</th>
              <th className="w-fit py-4 text-left">No of Days</th>
              <th className="w-fit py-4 text-left">FCO</th>
              <th className="w-fit py-4 text-left">Unit Cost</th>
              <th className="w-fit py-4 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Title 1: FEEDING  */}
            <tr className="w-full whitespace-nowrap border-b-2 ">
              <td className="w-fit py-4 text-left ">
                <span className="bg-black rounded p-2 px-4 text-xs text-white">
                  1.
                </span>
              </td>
              <td className="w-fit py-4 text-left" colSpan={6}>
                <strong>FEEDING</strong>
              </td>
            </tr>
            {/* Data for FEEDING */}
            <tr className="w-full whitespace-nowrap border-b-2 ">
              <td className="w-fit py-4 text-left"></td>
              <td className="w-fit py-4 text-left">Dinner (Day 1)</td>
              <td className="w-fit py-4 text-left">50</td>
              <td className="w-fit py-4 text-left">3</td>
              <td className="w-fit py-4 text-left">004-HOPM</td>
              <td className="w-fit py-4 text-left">₦20,000 </td>
              <td className="w-fit py-4 text-left">₦300,000</td>
            </tr>

            {/* Title 2: ACCOMMODATION */}
            <tr className="w-full whitespace-nowrap border-b-2 ">
              <td className="w-fit py-4 text-left ">
                <span className="bg-black rounded p-2 px-4 text-xs text-white">
                  2.
                </span>
              </td>
              <td className="w-fit py-4 text-left" colSpan={6}>
                <strong>ACCOMMODATION</strong>
              </td>
            </tr>
            {/* Data for ACCOMMODATION */}
            <tr className="w-full whitespace-nowrap border-b-2 ">
              <td className="w-fit py-4 text-left"></td>
              <td className="w-fit py-4 text-left">Hotel rooms booked</td>
              <td className="w-fit py-4 text-left">25</td>
              <td className="w-fit py-4 text-left">5</td>
              <td className="w-fit py-4 text-left">004-HOPM</td>
              <td className="w-fit py-4 text-left">₦20,000 </td>
              <td className="w-fit py-4 text-left">₦300,000</td>
            </tr>

            {/* Title 3: TRANSPORTATION */}
            <tr className="w-full whitespace-nowrap border-b-2 ">
              <td className="w-fit py-4 text-left ">
                <span className="bg-black rounded p-2 px-4 text-xs text-white">
                  3.
                </span>
              </td>
              <td className="w-fit py-4 text-left" colSpan={6}>
                <strong>TRANSPORTATION</strong>
              </td>
            </tr>
            {/* Data for TRANSPORTATION */}
            <tr className="w-full whitespace-nowrap border-b-2 ">
              <td className="w-fit py-4 text-left"></td>
              <td className="w-fit py-4 text-left">Shuttle services</td>
              <td className="w-fit py-4 text-left">2</td>
              <td className="w-fit py-4 text-left">2</td>
              <td className="w-fit py-4 text-left">004-HOPM</td>
              <td className="w-fit py-4 text-left">₦20,000 </td>
              <td className="w-fit py-4 text-left">₦300,000</td>
            </tr>
          </tbody>
        </table>

        <div className="flex items-center justify-end">
          <div className="text-primary border-primary flex items-center justify-start gap-2 rounded border-2 px-6 py-3 text-base font-semibold">
            <span>Total:</span>
            <span>N0.00</span>
          </div>
        </div>

        <h3 className="text-primary text-xl font-semibold">Requested By</h3>
        <div className="grid grid-cols-4 gap-5">
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Name:</h6>
            <p className="text-xs">Dr Umar Adamu</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Name:</h6>
            <p className="text-xs">Dr Umar Adamu</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Name:</h6>
            <p className="text-xs">Dr Umar Adamu</p>
          </span>
          <span className="space-y-2">
            <h6 className="text-base font-semibold">Name:</h6>
            <p className="text-xs">Dr Umar Adamu</p>
          </span>
        </div>
      </section>
    </div>
  );
};

export default PurchaseRequesttDetails;
