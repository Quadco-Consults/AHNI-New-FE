import RoundBack from "assets/svgs/RoundBack";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

type PagepProps = {
  extraText?: string;
};
const BackNavigation: FC<PagepProps> = ({ extraText }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-x-2">
      <div onClick={() => navigate(-1)}>
        <RoundBack />
      </div>
      {extraText && <h4 className="text-xl font-bold">{extraText}</h4>}
    </div>
  );
};

export default BackNavigation;
