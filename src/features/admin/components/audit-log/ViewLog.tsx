import { CardContent } from "components/ui/card";

type ViewLogProps = {
  data: {
    user?: { full_name: string };
    ip_address?: string;
    description?: string;
    user_agent?: string;
    action_type_display?: string;
    metadata?: {
      model?: string;
    };
    content_type?: string;
  };
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div className='flex py-1'>
    <div className='w-1/3'>
      <p className='text-[12px] font-bold text-gray-700'>{label}</p>
    </div>
    <div className='w-2/3'>
      <p className='text-[12px] text-gray-800'>{value || "—"}</p>
    </div>
  </div>
);

const ViewLog = ({ data }: ViewLogProps) => {
  // console.log({ data });

  const fields = [
    { label: "User", value: data?.user?.full_name },
    { label: "IP Address", value: data?.ip_address },
    { label: "Description", value: data?.description },
    { label: "User Agent", value: data?.user_agent },
    { label: "Action Type", value: data?.action_type_display },
    { label: "Model", value: data?.metadata?.model },
    { label: "Content Type", value: data?.content_type },
  ];

  return (
    <CardContent>
      {fields.map(({ label, value }) => (
        <InfoRow key={label} label={label} value={value} />
      ))}
    </CardContent>
  );
};

export default ViewLog;