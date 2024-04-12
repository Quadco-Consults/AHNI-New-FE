import Card from "components/shared/Card";
import welcomePng from "assets/imgs/welcome.png";

const Questionnaire = () => {
  return (
    <div className="space-y-5">
      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">Vendor Questionniare</h4>
        </div>

        <hr />

        <div className="p-5 grid gap-5 grid-cols-2">
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Company Chairman/Managing Director
            </h2>
            <h6>Joseph B Grayson</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Contact Telephone
            </h2>
            <h6>+234705253687745</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Company&apos; Bankers
            </h2>
            <h6>Kate Tanner</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Company&apos; Bankers Address
            </h2>
            <h6>
              Off Latif Salami/Fatai Irawo Street, M.M. International Airport
              Road, Ajao
            </h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Number of permanent staff:
            </h2>
            <h6>Joseph B Grayson</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Company&apos; Tax Identification Number (TIN)
            </h2>
            <h6>+234705253687745</h6>
          </div>
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">Branch Office(s) Address</h4>
        </div>

        <hr />

        <div className="p-5 grid grid-cols-2 gap-5">
          {Array(4)
            .fill({
              address: "52/54, Murtala Mohammed Way",
              contact: "Tony Danza",
              tel: "+2348108563735",
            })
            .map(({ address, tel, contact }, index) => (
              <Card key={index} className="border-yellow-darker space-y-3">
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Branch Address:</h4>
                  <h4>{address}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Contact Person:</h4>
                  <h4>{contact}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Tel:</h4>
                  <h4>{tel}</h4>
                </div>
              </Card>
            ))}
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">
            Majority Shareholders & Directors
          </h4>
        </div>

        <hr />

        <div className="p-5 grid grid-cols-2 gap-5">
          {Array(4)
            .fill({
              address: "52/54, Murtala Mohammed Way",
              contact: "Tony Danza",
              tel: "+2348108563735",
            })
            .map(({ address, tel, contact }, index) => (
              <Card key={index} className="border-yellow-darker space-y-3">
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Name:</h4>
                  <h4>{address}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Address:</h4>
                  <h4>{contact}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Tel:</h4>
                  <h4>{tel}</h4>
                </div>
              </Card>
            ))}
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">
            Names & Qualifications of Key Staff
          </h4>
        </div>

        <hr />

        <div className="p-5 grid grid-cols-2 gap-5">
          {Array(4)
            .fill({
              name: "Willie Tanner",
              qualification: "PHD",
              tel: "+2348108563735",
            })
            .map(({ name, tel, qualification }, index) => (
              <Card key={index} className="border-yellow-darker space-y-3">
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Name:</h4>
                  <h4>{name}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Qualification:</h4>
                  <h4>{qualification}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Tel:</h4>
                  <h4>{tel}</h4>
                </div>
              </Card>
            ))}
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">
            Subsidiaries, Associates, Affiliates or technical Partners
          </h4>
        </div>

        <hr />

        <div className="p-5 grid grid-cols-2 gap-5">
          {Array(4)
            .fill({
              address: "52/54, Murtala Mohammed Way",
              name: "Tony Danza",
              tel: "+2348108563735",
            })
            .map(({ address, tel, name }, index) => (
              <Card key={index} className="border-yellow-darker space-y-3">
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Name:</h4>
                  <h4>{name}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Address:</h4>
                  <h4>{address}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/4 font-medium">Tel:</h4>
                  <h4>{tel}</h4>
                </div>
              </Card>
            ))}
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">Questions</h4>
        </div>

        <hr />

        <div className="p-5 grid gap-5 grid-cols-2">
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Has any of the Company’s products failed to receive a NAFDAC
              certification in the last 5 years?
            </h2>
            <h6>Joseph B Grayson</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Does the Company engage in R&D to improve the company’s products
              and services?
            </h2>
            <h6>+234705253687745</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              How much was spent on R&D last year?
            </h2>
            <h6>
              Off Latif Salami/Fatai Irawo Street, M.M. International Airport
              Road, Ajao
            </h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Are you ready to allow us to inspect your plant premises at any
              time upon receipt of 2 days’ notice?
            </h2>
            <h6>Kate Tanner</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Has any of your products been rejected by your customers in the
              last 3 years? If yes, provide details
            </h2>
            <h6>Joseph B Grayson</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Has any of your products been rejected by your customers in the
              last 3 years? If yes, provide details
            </h2>
            <h6>Kate Tanner</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Is there any pending regulatory investigation, hearing or
              sanctions against your company? If yes, provide details.
            </h2>
            <h6>Kate Tanner</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Has any of your products been rejected by your customers in the
              last 3 years? If yes, provide details
            </h2>
            <h6>Joseph B Grayson</h6>
          </div>
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">
            Name and address of key client who we can contact for references (if
            any)
          </h4>
        </div>

        <hr />

        <div className="p-5 text-center space-y-4">
          <img src={welcomePng} alt="img" className="mx-auto" width={150} />
          <h6>No response for in this section</h6>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
