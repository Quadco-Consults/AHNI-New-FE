const DescriptionCard = ({
  label,
  description,
  aside,
}: {
  label: string;
  description?: string;
  aside?: boolean;
}) => {
  return (
    <>
      {aside ? (
        <div className="flex items-center">
          <p className="font-medium basis-1/4">{label}</p>
          <p className="flex-1">{description}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="font-medium">{label}</p>
          <p className="text-small">{description}</p>
        </div>
      )}
    </>
  );
};

export default DescriptionCard;
