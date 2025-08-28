import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/Card";
import PdfContent from "components/PdfContent";
import { AdminRoutes } from "constants/RouterConstants";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
// import { Link, useSearchParams }

export default function CreateAssetRequestUploads() {
  const searchParams = useSearchParams();
  const id = searchParams!.get("id");

  return (
    <>
      <Link
        href={{
          pathname: AdminRoutes.ASSETS_REQUEST_CREATE,
          search: `?id=${id}`,
        }}
        className='w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center'
      >
        <LongArrowLeft />
      </Link>
      <Card className='mt-5'>
        <PdfContent />
      </Card>
    </>
  );
}
