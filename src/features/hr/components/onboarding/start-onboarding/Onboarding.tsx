import CheckIcon from "assets/svgs/CheckIcon";

import { useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "store/index";
import { generatePath } from "utils/generatePath";

const Onboarding = ({id} : {
  id?: string;}) => {
  const steps = useSelector((state: RootState) => state?.steps?.steps);

  return (
    <div className='space-y-10 max-w-2xl mx-auto'>
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-medium'>New Staff!</h2>
        <p className='text-small'>
          Complete the following steps to fully onboard this staff.
        </p>
      </div>
      <div className='space-y-6 divide-y'>
        {steps.map(({ label, description, isCompleted, path,  }, index) => 
        { 
          return(
            <Link 
            href={generatePath(path, {
              id: id!, 
            })}
            key={index}
            className='flex items-center pt-5 gap-x-4'
          >
            {isCompleted ? (
              <CheckIcon />
            ) : (
              <div className='size-10 rounded-full bg-gray-100 grid place-content-center'>
                <p>{index + 1}</p>
              </div>
            )}
            <div>
              <h4 className='text-lg font-medium'>{label}</h4>
              <p className='text-small'>{description}</p>
            </div>
          </Link>
          )
        })}
      </div>
    </div>
  );
};

export default Onboarding;
