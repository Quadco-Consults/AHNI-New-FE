import Card from "components/shared/Card";

const TechnicalCapability = () => {
  return (
    <div className="space-y-5">
      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">Technical Capability</h4>
        </div>

        <hr />

        <div className="p-5 grid gap-5 grid-cols-2">
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Installed Capacity
            </h2>
            <h6>1500</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Latest Capacity and Utilization
            </h2>
            <h6>50</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Number of operational work shifts
            </h2>
            <h6>35</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Provide Brief Details of Quality Control Procedures
            </h2>
            <h6>ISO</h6>
          </div>
          <div className="space-y-2">
            <h2 className="text-yellow-darker font-semibold">
              Provide brief details of sampling procedures
            </h2>
            <h6>Kate Tanner</h6>
          </div>
        </div>
      </div>

      <div className="bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]">
        <div className="p-5 ">
          <h4 className="font-bold text-lg">Details of Production Equipment</h4>
        </div>

        <hr />

        <div className="p-5 grid grid-cols-2 gap-5">
          {Array(4)
            .fill({
              name: "Printing Machine",
              manufacturer: "HP",
              year: "2021",
            })
            .map(({ name, year, manufacturer }, index) => (
              <Card key={index} className="border-yellow-darker space-y-3">
                <div className="flex items-center gap-5">
                  <h4 className="w-1/3 font-medium">Equipment Name:</h4>
                  <h4>{name}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/3 font-medium">Manufacturer:</h4>
                  <h4>{manufacturer}</h4>
                </div>
                <div className="flex items-center gap-5">
                  <h4 className="w-1/3 font-medium">Year:</h4>
                  <h4>{year}</h4>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicalCapability;
