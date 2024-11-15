import BackNavigation from "atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { userColums } from "components/Table/columns/users";
import DataTable from "components/Table/DataTable";
import TableFilters from "components/Table/TableFilters";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { TUser } from "definations/users";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetUserQuery } from "services/users";

const UsersList = () => {
    const { data, isLoading } = useGetUserQuery(
        { no_paginate: false },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const drivedData = useMemo(() => {
        return data?.results.map((user) => ({
            id: user.id,
            fullName: `${user.first_name} ${user.last_name}`,
            email: user.email,
            department: user.designation,
            position: user?.roles?.length > 0 ? user.roles[0].name : "N/A",
            roles: user.roles,
            lastLogin: new Date(user.last_login).toLocaleString(),
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            phone_number: user.phone_number,
            designation: user.designation,
        }));
    }, [data?.results]);

    console.log({ users: data });

    return (
        <div>
            <div className="flex items-center justify-between">
                <BackNavigation extraText="Users" />
                <Link to={RouteEnum.CREATE_USERS}>
                    <Button className="gap-x-2" size="sm">
                        <AddSquareIcon />
                        Add Users
                    </Button>
                </Link>
            </div>
            <div>
                <TableFilters>
                    <DataTable
                        columns={userColums}
                        data={(drivedData as unknown as TUser[]) || []}
                        isLoading={isLoading}
                    />
                </TableFilters>
            </div>
        </div>
    );
};

export default UsersList;
