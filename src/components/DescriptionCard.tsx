import { cn } from "lib/utils";

type TProps = {
  label: string;
  description?: string | number;
  aside?: boolean;
  className?: string;
};

export default function DescriptionCard({
  label,
  description,
  aside,
  className,
}: TProps) {
  return (
    <>
      {aside ? (
        <div className='flex flex-col'>
          <p className='font-bold basis-1/4'>{label}</p>
          <p className='flex-1'>{description ? description : "---"}</p>
        </div>
      ) : (
        <div className={cn("space-y-2", className)}>
          <p className='font-bold'>{label}</p>
          <p className='text-small'>{description ? description : "---"}</p>
        </div>
      )}
    </>
  );
}
