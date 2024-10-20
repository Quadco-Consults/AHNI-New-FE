const DescriptionCard = ({
  label,
  description,
}: {
  label: string;
  description: string;
}) => {
  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>
      <p className="text-small">{description}</p>
    </div>
  );
};

export default DescriptionCard;
