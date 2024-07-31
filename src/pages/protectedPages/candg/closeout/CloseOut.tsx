import SearchBar from "atoms/SearchBar";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { CandGRoutes } from "constants/RouterConstants";
import React from "react";
import { useNavigate } from "react-router-dom";

const CloseOut: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="w-full flex flex-col justify-center items-center gap-y-[1.5rem]">
      <section className="flex items-center w-full justify-between">
        <SearchBar onchange={() => ""} />
        <Button
          onClick={() => {
            navigate(CandGRoutes.NEW_CLOSE_OUT_PLAN);
          }}
        >
          <AddSquareIcon />
          <p>Create New Close Out Plan</p>
        </Button>
      </section>
    </main>
  );
};

export default CloseOut;
