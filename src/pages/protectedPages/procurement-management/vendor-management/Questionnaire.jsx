import Card from "components/shared/Card";

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
                  <h4 className=" font-medium">Branch Address:</h4>
                  <h4>{address}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className=" font-medium">Contact Person:</h4>
                  <h4>{contact}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className=" font-medium">Tel:</h4>
                  <h4>{tel}</h4>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
