import Card from "components/shared/Card";

const Performance = () => {
  return (
    <Card className="space-y-7">
      <h4 className="font-semibold text-lg">Project Performance</h4>
      <hr />

      <div className="space-y-3">
        <h3 className="font-semibold">Achievement against the target</h3>
        <p className="text-sm text-gray-500">450,454</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Narrative</h3>
        <p className="text-sm text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa
          mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,
          mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis
          tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non
          suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at
          maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales
          sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat
          placerat.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Budget performance</h3>
        <p className="text-sm text-gray-500">50</p>
      </div>
    </Card>
  );
};

export default Performance;
