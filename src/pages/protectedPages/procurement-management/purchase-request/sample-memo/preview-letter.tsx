import LongArrowRight from "components/icons/LongArrowRight";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import logoPng from "assets/svgs/logo-bg.svg";

import { generatePath, Link } from "react-router-dom";

const Preview = () => {
  return (
    <div className='bg-white p-8'>
      <div className='flex justify-center items-center flex-col'>
        <img src={logoPng} alt='logo' width={200} />
        <h1>Achieving Health Nigeria Initiative (AHNI)</h1>
        <p>INTERNAL MEMO</p>
      </div>

      <div>
        <h2>To:</h2>
        <h2 className='my-8'>THROUGH:</h2>
        <h2>FROM:</h2>

        <div className='mt-8'>
          <div className='flex'>
            <p>Budget Line #: 916</p>
            <p>FCO#: N-THRIP </p>
          </div>
          <p>Module: Program management </p>
          <p>Intervention: Grant management </p>
          <div className='flex'>
            <p>Cost Grouping #: 11.0</p>
            <p>Cost Input #: 11.1</p>
          </div>
          <p className='mt-8'>Date: 15/07/2024</p>

          <p className='my-8'>
            Subject: 9.2.2 Anambra State Office Admin Cost Q3(July - September
            2024)
          </p>
        </div>

        <div className=''>
          <p>
            To ensure smooth, efficient, and uninterrupted service
            delivery/program implementation at the Anambra State Surge Office on
            the Global Fund N-THRIP, the State Office is requesting approval to
            implement operational Cost items as approved in BL916 of the state
            workplan for Quarter 3(July– September 2024). The expense head as
            per the attached list is considered necessary and immediately
            required for the daily running and maintenance of the Anambra State
            office. This is therefore a request to approve the sum of Eight
            Million, Five Hundred and Seven Thousand, Four Hundred and
            Fifty-three Naira (₦8,507,453.00 ) only to be charged to BL916 for
            immediate purchase of listed items/execution of maintenance for
            effective operations in the state Site for Quarter 3(July– September
            2024). Please, attached is the activity budget for your review and
            approval.{" "}
          </p>
          <p className='mt-8'>Thank you</p>
        </div>
        <div className='w-full px-4 justify-end flex'>
          <Link className='w-fit' to={generatePath(RouteEnum.FINAL_PREVIEW)}>
            <Button
              type='submit'
              className='mt-4 px-4 py-2 bg-primary text-white rounded'
            >
              <LongArrowRight />
              Next
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Preview;
