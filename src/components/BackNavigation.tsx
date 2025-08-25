"use client";

import RoundBack from "assets/svgs/RoundBack";
import { FC } from "react";
import { useRouter } from "next/navigation";

type PagepProps = {
  extraText?: string;
};
const BackNavigation: FC<PagepProps> = ({ extraText }) => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-x-2">
      <div onClick={() => router.back()}>
        <RoundBack />
      </div>
      {extraText && <h4 className="text-xl font-bold">{extraText}</h4>}
    </div>
  );
};

export default BackNavigation;
