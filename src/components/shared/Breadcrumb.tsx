import { Fragment } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";

export interface TBreadcrumbList {
    name: string;
    icon: boolean;
}

type TProps = {
    list: TBreadcrumbList[];
};

export default function BreadcrumbCard({ list }: TProps) {
    return (
        <Fragment>
            {list.length > 0 ? (
                <Breadcrumb>
                    <BreadcrumbList>
                        {list.map((item: any, index: number) => (
                            <Fragment key={index}>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {item?.name}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                                {item?.icon && (
                                    <BreadcrumbSeparator>
                                        <Icon icon="iconoir:slash" />
                                    </BreadcrumbSeparator>
                                )}
                            </Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            ) : (
                ""
            )}
        </Fragment>
    );
}
