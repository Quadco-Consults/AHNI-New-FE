import { TFundRequestActivity } from "features/programs/types/program-validator";
import { useMemo } from "react";
import {
    Table as ShadTable,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "components/ui/table";

type TProps = {
    data: TFundRequestActivity[];
    availableBalance: string;
    currency: string;
};

const groupByCategory = (
    data: TFundRequestActivity[] | undefined
): Record<string, TFundRequestActivity[]> => {
    return (
        data?.reduce(
            (
                acc: Record<string, TFundRequestActivity[]>,
                row: TFundRequestActivity
            ) => {
                const category = row.category?.name;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(row);
                return acc;
            },
            {}
        ) || {}
    );
};

const columns = [
    "S/N",
    "Description of Activity",
    "Unit Cost",
    "Qty",
    "Frq",
    "Requested Amount (NGN)",
    "Comment",
];

export default function FundActivityTable({
    data,
    availableBalance,
    currency,
}: TProps) {
    const groupedData = useMemo(() => groupByCategory(data), [data]);

    const subtotal = data
        .map((activity) => activity.amount)
        .reduce(
            (accumulator, value) =>
                (Number(accumulator as any) + Number(value as any)) as any
        );

    const currencySybmol = currency === "NGN" ? "₦" : "$";

    return (
        <div>
            <ShadTable>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                className={`font-semibold ${
                                    col === "Comment"
                                        ? "text-red-500"
                                        : "text-black"
                                } cursor-pointer dark:text-gray-300 text-center`}
                            >
                                {col}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.keys(groupedData).map((key) => {
                        const activities = groupedData[key];

                        return (
                            <>
                                <TableRow>
                                    <TableCell className="bg-gray-200"></TableCell>
                                    <TableCell className="bg-gray-200 text-red-500 font-semibold">
                                        {key}
                                    </TableCell>
                                    <TableCell className="bg-gray-200"></TableCell>
                                    <TableCell className="bg-gray-200"></TableCell>
                                    <TableCell className="bg-gray-200"></TableCell>
                                    <TableCell className="bg-gray-200"></TableCell>
                                    <TableCell className="bg-gray-200"></TableCell>
                                </TableRow>
                                {activities.map(
                                    (
                                        {
                                            activity_description,
                                            unit_cost,
                                            quantity,
                                            frequency,
                                            amount,
                                            comment,
                                        },
                                        index
                                    ) => (
                                        <TableRow>
                                            <TableCell>
                                                {(index + 1).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {activity_description}
                                            </TableCell>
                                            <TableCell>
                                                {currencySybmol}
                                                {unit_cost}
                                            </TableCell>
                                            <TableCell>{quantity}</TableCell>
                                            <TableCell>{frequency}</TableCell>
                                            <TableCell>₦{amount}</TableCell>
                                            <TableCell>{comment}</TableCell>
                                        </TableRow>
                                    )
                                )}

                                <TableRow>
                                    {[1, 2, 3, 4, 5, 6].map(() => (
                                        <TableCell></TableCell>
                                    ))}
                                </TableRow>
                            </>
                        );
                    })}

                    <TableRow>
                        <TableCell></TableCell>
                        {/* <TableCell>{(data.length + 1).toFixed(2)}</TableCell> */}
                        <TableCell className="font-semibold">
                            Subtotal
                        </TableCell>
                        <TableCell>
                            {currencySybmol}
                            {subtotal}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell></TableCell>
                        {/* <TableCell>{(data.length + 2).toFixed(2)}</TableCell> */}
                        <TableCell className="font-semibold">
                            Less Cash Balance
                        </TableCell>
                        <TableCell>
                            {currencySybmol}
                            {availableBalance}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell></TableCell>
                        {/* <TableCell>{(data.length + 3).toFixed(2)}</TableCell> */}
                        <TableCell className="font-semibold">
                            Amount Required
                        </TableCell>
                        <TableCell>
                            {currencySybmol}
                            {/* @ts-ignore */}
                            {subtotal - availableBalance}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </ShadTable>
        </div>
    );
}
