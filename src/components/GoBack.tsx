"use client";

import LongArrowLeft from "components/icons/LongArrowLeft";
import { useRouter } from "next/navigation";

const GoBack = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center"
    >
      <LongArrowLeft />
    </button>
  );
};

export default GoBack;
