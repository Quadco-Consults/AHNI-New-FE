import { Card, CardContent } from "components/ui/card";
import { ChevronRight } from "lucide-react";
import { useRolesQuery } from "services/users";

const RoleList = () => {
  const { data } = useRolesQuery({
    no_paginate: false,
  });
  return (
    <div className="mt-6">
      <Card>
        <CardContent className="p-4">
          {data?.results?.map((item, i) => {
            return (
              <div key={item.id} className="flex justify-between py-5 border-b">
                <div className="flex item-center gap-x-4">
                  <p className=" rounded-full bg-[#DBDFE9] h-6 w-6 flex items-center justify-center text-sm ">
                    {i + 1}
                  </p>
                  <h4 className="text-lg font-bold">{item.name}</h4>
                </div>
                <div>
                  <ChevronRight />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleList;
