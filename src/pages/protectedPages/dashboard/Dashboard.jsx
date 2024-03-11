/* eslint-disable react/prop-types */
import Card from "components/shared/Card";
import IconButton from "components/shared/IconButton";
import { cn } from "lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Checkbox } from "components/ui/checkbox";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import useTable from "hooks/useTable";
import Table from "lib/react-table/Table";
import { Icon } from "@iconify/react";
import logoPng from "assets/imgs/logo.png";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "components/ui/progress";

const Dashboard = () => {
  const tableInstance = useTable({
    columns,
    data,
    //  state: { pagination },
    //  pageCount: customersQueryResult?.data?.number_of_pages,
    //  manualPagination: true,
    //  onPaginationChange: setPagination,
  });
  return (
    <div className="space-y-10">
      <h4 className="font-bold text-lg">Dasboard</h4>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <Card className="space-y-5">
          <div className="flex justify-between">
            <h4 className="font-bold text-base">Notifications</h4>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="iconBtn">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.3">
                        <path
                          d="M13.8107 1.8934H16.1723C16.8061 1.8934 17.3486 2.10979 17.8 2.54257C18.2496 2.97535 18.4744 3.50664 18.4744 4.13646V6.4191C18.4744 7.03836 18.2496 7.56701 17.8 8.00507C17.3486 8.44488 16.8061 8.66479 16.1723 8.66479H13.8107C13.1751 8.66479 12.6325 8.44488 12.1829 8.00507C11.7316 7.56701 11.5059 7.03836 11.5059 6.4191V4.13646C11.5059 3.50664 11.7316 2.97535 12.1829 2.54257C12.6325 2.10979 13.1751 1.8934 13.8107 1.8934Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <g opacity="0.3">
                        <path
                          d="M4.51497 10.929H6.87664C7.5122 10.929 8.05477 11.1489 8.50435 11.5887C8.95574 12.0267 9.18143 12.5554 9.18143 13.1746V15.4573C9.18143 16.0871 8.95574 16.6184 8.50435 17.0512C8.05477 17.484 7.5122 17.7003 6.87664 17.7003H4.51497C3.88122 17.7003 3.33865 17.484 2.88727 17.0512C2.43768 16.6184 2.21289 16.0871 2.21289 15.4573V13.1746C2.21289 12.5554 2.43768 12.0267 2.88727 11.5887C3.33865 11.1489 3.88122 10.929 4.51497 10.929Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <path
                        d="M13.8107 10.9474H16.1723C16.8061 10.9474 17.3486 11.1673 17.8 11.6071C18.2496 12.0452 18.4744 12.5739 18.4744 13.1931V15.4942C18.4744 16.1117 18.2496 16.6404 17.8 17.0802C17.3486 17.5183 16.8061 17.7373 16.1723 17.7373H13.8107C13.1751 17.7373 12.6325 17.5183 12.1829 17.0802C11.7316 16.6404 11.5059 16.1117 11.5059 15.4942V13.1931C11.5059 12.5739 11.7316 12.0452 12.1829 11.6071C12.6325 11.1673 13.1751 10.9474 13.8107 10.9474Z"
                        fill="#FD4A36"
                      />
                      <path
                        d="M4.51497 1.85645H6.87664C7.5122 1.85645 8.05477 2.07547 8.50435 2.51353C8.95574 2.95334 9.18143 3.482 9.18143 4.0995V6.40061C9.18143 7.01987 8.95574 7.54853 8.50435 7.98658C8.05477 8.4264 7.5122 8.64631 6.87664 8.64631H4.51497C3.88122 8.64631 3.33865 8.4264 2.88727 7.98658C2.43768 7.54853 2.21289 7.01987 2.21289 6.40061V4.0995C2.21289 3.482 2.43768 2.95334 2.88727 2.51353C3.33865 2.07547 3.88122 1.85645 4.51497 1.85645Z"
                        fill="#FD4A36"
                      />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <h4 className="font-medium p-5 text-base">Filter Options</h4>
                  <hr />

                  <div className="p-5 space-y-5">
                    <div className="space-y-1">
                      <h4 className="font-medium">Status:</h4>
                      <Select>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>Fruits</SelectLabel> */}
                            <SelectItem value="apple">Approved</SelectItem>
                            <SelectItem value="banana">Pending</SelectItem>
                            <SelectItem value="blueberry">
                              In Progress
                            </SelectItem>
                            <SelectItem value="grapes">Rejected</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Member Type:</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Checkbox />{" "}
                          <h6 className="text-grey-light">Author</h6>
                        </div>
                        <div className="flex items-center gap-1">
                          <Checkbox checked />{" "}
                          <h6 className="text-grey-light">Customer</h6>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Notifications:</h4>
                      <div className="flex items-center space-x-2">
                        <Switch id="notifications-mode" checked />
                        <Label htmlFor="notifications-mode">Enabled</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="ghost">Reset</Button>
                      <Button>Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                name: "ERP System Maintenance Scheduled",
                description: "Due in 2 Days",
                percentage: "+28%",
                backgroundColor: "bg-yellow-light",
                textColor: "text-yellow-dark",
                svg: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9199 10.3428L3.09961 7.33312C2.89107 7.24756 2.72044 7.1121 2.58773 6.92673C2.45503 6.73932 2.38867 6.53154 2.38867 6.30339C2.38867 6.07321 2.45503 5.86849 2.58773 5.68923C2.72044 5.51201 2.89107 5.3796 3.09961 5.29201L10.9199 2.28534C11.0674 2.2283 11.219 2.18552 11.3749 2.15701C11.5308 2.12849 11.6972 2.11423 11.8742 2.11423C12.0511 2.11423 12.2175 2.12849 12.3734 2.15701C12.5293 2.18552 12.6809 2.2283 12.8284 2.28534L20.6045 5.29201C20.8278 5.3796 21.0058 5.51201 21.1385 5.68923C21.2712 5.86849 21.3375 6.07321 21.3375 6.30339C21.3375 6.53154 21.2712 6.73932 21.1385 6.92673C21.0058 7.1121 20.8351 7.24756 20.6266 7.33312H20.6045L12.8284 10.3428C12.6809 10.3999 12.5293 10.4427 12.3734 10.4712C12.2175 10.4997 12.0511 10.514 11.8742 10.514C11.6972 10.514 11.5308 10.4997 11.3749 10.4712C11.219 10.4427 11.0674 10.3999 10.9199 10.3428Z"
                      fill="#FFC700"
                    />
                    <g opacity="0.3">
                      <path
                        d="M20.6487 17.2393L12.8284 20.2459C12.6809 20.303 12.5261 20.3498 12.3639 20.3865C12.1996 20.4211 12.029 20.4384 11.852 20.4384C11.6751 20.4384 11.5013 20.4211 11.3307 20.3865C11.1601 20.3498 11.001 20.303 10.8536 20.2459H10.8757L3.09961 17.2393C2.89107 17.1537 2.72044 17.0213 2.58773 16.842C2.45503 16.6628 2.38867 16.458 2.38867 16.2279C2.38867 15.9997 2.45503 15.7919 2.58773 15.6045C2.72044 15.4192 2.89107 15.2837 3.09961 15.1981L4.29714 14.7245L10.1647 17.0009C10.4154 17.1028 10.6819 17.1822 10.9642 17.2393C11.2443 17.2963 11.5403 17.3248 11.852 17.3248C12.1491 17.3248 12.4419 17.2963 12.7304 17.2393C13.019 17.1822 13.296 17.1028 13.5615 17.0009H13.5393L19.4512 14.7245L20.6708 15.1981C20.8794 15.2837 21.05 15.4161 21.1827 15.5954C21.3154 15.7746 21.3818 15.9783 21.3818 16.2065C21.3818 16.4509 21.3123 16.6628 21.1732 16.842C21.0321 17.0213 20.8573 17.1537 20.6487 17.2393ZM12.8284 15.3051L20.6045 12.274C20.813 12.1884 20.9836 12.056 21.1163 11.8768C21.2491 11.6995 21.3154 11.4958 21.3154 11.2656C21.3154 11.0375 21.2533 10.8338 21.129 10.6545C21.0026 10.4753 20.8351 10.3429 20.6266 10.2573H20.6045L12.8284 7.2262C12.6809 7.18342 12.5293 7.1437 12.3734 7.10703C12.2175 7.0724 12.0511 7.05508 11.8742 7.05508C11.6972 7.05508 11.5308 7.0724 11.3749 7.10703C11.219 7.1437 11.0674 7.19055 10.9199 7.24758V7.2262L3.09961 10.2573C2.89107 10.3429 2.7236 10.4753 2.59721 10.6545C2.47293 10.8338 2.41079 11.0375 2.41079 11.2656C2.41079 11.4958 2.47293 11.6995 2.59721 11.8768C2.7236 12.056 2.89107 12.1884 3.09961 12.274L10.9199 15.3051C11.0674 15.3479 11.219 15.3876 11.3749 15.4243C11.5308 15.4589 11.6972 15.4762 11.8742 15.4762C12.0511 15.4762 12.2175 15.4589 12.3734 15.4243C12.5293 15.3876 12.6809 15.3407 12.8284 15.2837V15.3051Z"
                        fill="#FFC700"
                      />
                    </g>
                  </svg>
                ),
              },
              {
                name: "New ERP Module Deployment",
                description: "Due in 5 Days",
                percentage: "+50%",
                backgroundColor: "bg-green-light",
                textColor: "text-green-dark",
                svg: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9199 11.0529L3.09961 8.04314C2.89107 7.95758 2.72044 7.82212 2.58773 7.63675C2.45503 7.44934 2.38867 7.24156 2.38867 7.01342C2.38867 6.78323 2.45503 6.57851 2.58773 6.39925C2.72044 6.22203 2.89107 6.08962 3.09961 6.00203L10.9199 2.99536C11.0674 2.93832 11.219 2.89555 11.3749 2.86703C11.5308 2.83851 11.6972 2.82425 11.8742 2.82425C12.0511 2.82425 12.2175 2.83851 12.3734 2.86703C12.5293 2.89555 12.6809 2.93832 12.8284 2.99536L20.6045 6.00203C20.8278 6.08962 21.0058 6.22203 21.1385 6.39925C21.2712 6.57851 21.3375 6.78323 21.3375 7.01342C21.3375 7.24156 21.2712 7.44934 21.1385 7.63675C21.0058 7.82212 20.8351 7.95758 20.6266 8.04314H20.6045L12.8284 11.0529C12.6809 11.1099 12.5293 11.1527 12.3734 11.1812C12.2175 11.2097 12.0511 11.224 11.8742 11.224C11.6972 11.224 11.5308 11.2097 11.3749 11.1812C11.219 11.1527 11.0674 11.1099 10.9199 11.0529Z"
                      fill="#50CD89"
                    />
                    <g opacity="0.3">
                      <path
                        d="M20.6487 17.9493L12.8284 20.9559C12.6809 21.013 12.5261 21.0598 12.3639 21.0965C12.1996 21.1311 12.029 21.1484 11.852 21.1484C11.6751 21.1484 11.5013 21.1311 11.3307 21.0965C11.1601 21.0598 11.001 21.013 10.8536 20.9559H10.8757L3.09961 17.9493C2.89107 17.8637 2.72044 17.7313 2.58773 17.5521C2.45503 17.3728 2.38867 17.1681 2.38867 16.9379C2.38867 16.7097 2.45503 16.502 2.58773 16.3146C2.72044 16.1292 2.89107 15.9937 3.09961 15.9082L4.29714 15.4346L10.1647 17.7109C10.4154 17.8128 10.6819 17.8922 10.9642 17.9493C11.2443 18.0063 11.5403 18.0348 11.852 18.0348C12.1491 18.0348 12.4419 18.0063 12.7304 17.9493C13.019 17.8922 13.296 17.8128 13.5615 17.7109H13.5393L19.4512 15.4346L20.6708 15.9082C20.8794 15.9937 21.05 16.1261 21.1827 16.3054C21.3154 16.4846 21.3818 16.6883 21.3818 16.9165C21.3818 17.1609 21.3123 17.3728 21.1732 17.5521C21.0321 17.7313 20.8573 17.8637 20.6487 17.9493ZM12.8284 16.0151L20.6045 12.984C20.813 12.8984 20.9836 12.766 21.1163 12.5868C21.2491 12.4096 21.3154 12.2058 21.3154 11.9757C21.3154 11.7475 21.2533 11.5438 21.129 11.3646C21.0026 11.1853 20.8351 11.0529 20.6266 10.9673H20.6045L12.8284 7.93622C12.6809 7.89344 12.5293 7.85372 12.3734 7.81705C12.2175 7.78242 12.0511 7.76511 11.8742 7.76511C11.6972 7.76511 11.5308 7.78242 11.3749 7.81705C11.219 7.85372 11.0674 7.90057 10.9199 7.95761V7.93622L3.09961 10.9673C2.89107 11.0529 2.7236 11.1853 2.59721 11.3646C2.47293 11.5438 2.41079 11.7475 2.41079 11.9757C2.41079 12.2058 2.47293 12.4096 2.59721 12.5868C2.7236 12.766 2.89107 12.8984 3.09961 12.984L10.9199 16.0151C11.0674 16.0579 11.219 16.0976 11.3749 16.1343C11.5308 16.1689 11.6972 16.1862 11.8742 16.1862C12.0511 16.1862 12.2175 16.1689 12.3734 16.1343C12.5293 16.0976 12.6809 16.0508 12.8284 15.9937V16.0151Z"
                        fill="#50CD89"
                      />
                    </g>
                  </svg>
                ),
              },
              {
                name: "ERP User Access Issues Reported",
                description: "Due in 1 Days",
                percentage: "-21%",
                backgroundColor: "bg-red-light",
                textColor: "text-red-dark",
                svg: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9199 10.7629L3.09961 7.75317C2.89107 7.66762 2.72044 7.53216 2.58773 7.34679C2.45503 7.15938 2.38867 6.9516 2.38867 6.72345C2.38867 6.49327 2.45503 6.28855 2.58773 6.10929C2.72044 5.93206 2.89107 5.79966 3.09961 5.71206L10.9199 2.7054C11.0674 2.64836 11.219 2.60558 11.3749 2.57706C11.5308 2.54855 11.6972 2.53429 11.8742 2.53429C12.0511 2.53429 12.2175 2.54855 12.3734 2.57706C12.5293 2.60558 12.6809 2.64836 12.8284 2.7054L20.6045 5.71206C20.8278 5.79966 21.0058 5.93206 21.1385 6.10929C21.2712 6.28855 21.3375 6.49327 21.3375 6.72345C21.3375 6.9516 21.2712 7.15938 21.1385 7.34679C21.0058 7.53216 20.8351 7.66762 20.6266 7.75317H20.6045L12.8284 10.7629C12.6809 10.8199 12.5293 10.8627 12.3734 10.8912C12.2175 10.9198 12.0511 10.934 11.8742 10.934C11.6972 10.934 11.5308 10.9198 11.3749 10.8912C11.219 10.8627 11.0674 10.8199 10.9199 10.7629Z"
                      fill="#F1416C"
                    />
                    <g opacity="0.3">
                      <path
                        d="M20.6487 17.6593L12.8284 20.6659C12.6809 20.723 12.5261 20.7698 12.3639 20.8065C12.1996 20.8411 12.029 20.8584 11.852 20.8584C11.6751 20.8584 11.5013 20.8411 11.3307 20.8065C11.1601 20.7698 11.001 20.723 10.8536 20.6659H10.8757L3.09961 17.6593C2.89107 17.5737 2.72044 17.4413 2.58773 17.2621C2.45503 17.0828 2.38867 16.8781 2.38867 16.6479C2.38867 16.4197 2.45503 16.212 2.58773 16.0246C2.72044 15.8392 2.89107 15.7037 3.09961 15.6182L4.29714 15.1446L10.1647 17.4209C10.4154 17.5228 10.6819 17.6022 10.9642 17.6593C11.2443 17.7163 11.5403 17.7448 11.852 17.7448C12.1491 17.7448 12.4419 17.7163 12.7304 17.6593C13.019 17.6022 13.296 17.5228 13.5615 17.4209H13.5393L19.4512 15.1446L20.6708 15.6182C20.8794 15.7037 21.05 15.8361 21.1827 16.0154C21.3154 16.1946 21.3818 16.3984 21.3818 16.6265C21.3818 16.8709 21.3123 17.0828 21.1732 17.2621C21.0321 17.4413 20.8573 17.5737 20.6487 17.6593ZM12.8284 15.7251L20.6045 12.694C20.813 12.6084 20.9836 12.476 21.1163 12.2968C21.2491 12.1196 21.3154 11.9159 21.3154 11.6857C21.3154 11.4575 21.2533 11.2538 21.129 11.0746C21.0026 10.8953 20.8351 10.7629 20.6266 10.6773H20.6045L12.8284 7.64622C12.6809 7.60345 12.5293 7.56372 12.3734 7.52706C12.2175 7.49243 12.0511 7.47511 11.8742 7.47511C11.6972 7.47511 11.5308 7.49243 11.3749 7.52706C11.219 7.56372 11.0674 7.61058 10.9199 7.66761V7.64622L3.09961 10.6773C2.89107 10.7629 2.7236 10.8953 2.59721 11.0746C2.47293 11.2538 2.41079 11.4575 2.41079 11.6857C2.41079 11.9159 2.47293 12.1196 2.59721 12.2968C2.7236 12.476 2.89107 12.6084 3.09961 12.694L10.9199 15.7251C11.0674 15.7679 11.219 15.8076 11.3749 15.8443C11.5308 15.8789 11.6972 15.8962 11.8742 15.8962C12.0511 15.8962 12.2175 15.8789 12.3734 15.8443C12.5293 15.8076 12.6809 15.7608 12.8284 15.7037V15.7251Z"
                        fill="#F1416C"
                      />
                    </g>
                  </svg>
                ),
              },
              {
                name: "ERP Data Backup Completed",
                description: "Completed Yesterday",
                percentage: "+8%",
                backgroundColor: "bg-purple-light",
                textColor: "text-purple-dark",
                svg: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9199 10.4729L3.09961 7.46319C2.89107 7.37763 2.72044 7.24217 2.58773 7.0568C2.45503 6.86939 2.38867 6.66162 2.38867 6.43347C2.38867 6.20328 2.45503 5.99856 2.58773 5.8193C2.72044 5.64208 2.89107 5.50967 3.09961 5.42208L10.9199 2.41541C11.0674 2.35837 11.219 2.3156 11.3749 2.28708C11.5308 2.25856 11.6972 2.2443 11.8742 2.2443C12.0511 2.2443 12.2175 2.25856 12.3734 2.28708C12.5293 2.3156 12.6809 2.35837 12.8284 2.41541L20.6045 5.42208C20.8278 5.50967 21.0058 5.64208 21.1385 5.8193C21.2712 5.99856 21.3375 6.20328 21.3375 6.43347C21.3375 6.66162 21.2712 6.86939 21.1385 7.0568C21.0058 7.24217 20.8351 7.37763 20.6266 7.46319H20.6045L12.8284 10.4729C12.6809 10.5299 12.5293 10.5727 12.3734 10.6012C12.2175 10.6298 12.0511 10.644 11.8742 10.644C11.6972 10.644 11.5308 10.6298 11.3749 10.6012C11.219 10.5727 11.0674 10.5299 10.9199 10.4729Z"
                      fill="#7239EA"
                    />
                    <g opacity="0.3">
                      <path
                        d="M20.6487 17.3693L12.8284 20.376C12.6809 20.433 12.5261 20.4799 12.3639 20.5165C12.1996 20.5512 12.029 20.5685 11.852 20.5685C11.6751 20.5685 11.5013 20.5512 11.3307 20.5165C11.1601 20.4799 11.001 20.433 10.8536 20.376H10.8757L3.09961 17.3693C2.89107 17.2837 2.72044 17.1513 2.58773 16.9721C2.45503 16.7928 2.38867 16.5881 2.38867 16.3579C2.38867 16.1298 2.45503 15.922 2.58773 15.7346C2.72044 15.5492 2.89107 15.4137 3.09961 15.3282L4.29714 14.8546L10.1647 17.131C10.4154 17.2328 10.6819 17.3123 10.9642 17.3693C11.2443 17.4263 11.5403 17.4549 11.852 17.4549C12.1491 17.4549 12.4419 17.4263 12.7304 17.3693C13.019 17.3123 13.296 17.2328 13.5615 17.131H13.5393L19.4512 14.8546L20.6708 15.3282C20.8794 15.4137 21.05 15.5462 21.1827 15.7254C21.3154 15.9047 21.3818 16.1084 21.3818 16.3365C21.3818 16.581 21.3123 16.7928 21.1732 16.9721C21.0321 17.1513 20.8573 17.2837 20.6487 17.3693ZM12.8284 15.4351L20.6045 12.404C20.813 12.3185 20.9836 12.1861 21.1163 12.0068C21.2491 11.8296 21.3154 11.6259 21.3154 11.3957C21.3154 11.1675 21.2533 10.9638 21.129 10.7846C21.0026 10.6053 20.8351 10.4729 20.6266 10.3874H20.6045L12.8284 7.35625C12.6809 7.31347 12.5293 7.27375 12.3734 7.23708C12.2175 7.20245 12.0511 7.18513 11.8742 7.18513C11.6972 7.18513 11.5308 7.20245 11.3749 7.23708C11.219 7.27375 11.0674 7.3206 10.9199 7.37764V7.35625L3.09961 10.3874C2.89107 10.4729 2.7236 10.6053 2.59721 10.7846C2.47293 10.9638 2.41079 11.1675 2.41079 11.3957C2.41079 11.6259 2.47293 11.8296 2.59721 12.0068C2.7236 12.1861 2.89107 12.3185 3.09961 12.404L10.9199 15.4351C11.0674 15.4779 11.219 15.5176 11.3749 15.5543C11.5308 15.5889 11.6972 15.6062 11.8742 15.6062C12.0511 15.6062 12.2175 15.5889 12.3734 15.5543C12.5293 15.5176 12.6809 15.4708 12.8284 15.4137V15.4351Z"
                        fill="#7239EA"
                      />
                    </g>
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center p-5 text-sm rounded-lg md:text-md",
                  item.backgroundColor
                )}
              >
                <div className="w-[15%]">{item.svg}</div>
                <div className="w-[70%]">
                  <h4 className="font-medium">{item.name}</h4>
                  <h6 className="text-sm text-grey-dark">{item.description}</h6>
                </div>
                <div className="w-[15%]">
                  <h4 className={item.textColor}>{item.percentage}</h4>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex justify-between">
            <h4 className="font-bold text-base">AHNi Tasks</h4>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="iconBtn">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.3">
                        <path
                          d="M13.8107 1.8934H16.1723C16.8061 1.8934 17.3486 2.10979 17.8 2.54257C18.2496 2.97535 18.4744 3.50664 18.4744 4.13646V6.4191C18.4744 7.03836 18.2496 7.56701 17.8 8.00507C17.3486 8.44488 16.8061 8.66479 16.1723 8.66479H13.8107C13.1751 8.66479 12.6325 8.44488 12.1829 8.00507C11.7316 7.56701 11.5059 7.03836 11.5059 6.4191V4.13646C11.5059 3.50664 11.7316 2.97535 12.1829 2.54257C12.6325 2.10979 13.1751 1.8934 13.8107 1.8934Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <g opacity="0.3">
                        <path
                          d="M4.51497 10.929H6.87664C7.5122 10.929 8.05477 11.1489 8.50435 11.5887C8.95574 12.0267 9.18143 12.5554 9.18143 13.1746V15.4573C9.18143 16.0871 8.95574 16.6184 8.50435 17.0512C8.05477 17.484 7.5122 17.7003 6.87664 17.7003H4.51497C3.88122 17.7003 3.33865 17.484 2.88727 17.0512C2.43768 16.6184 2.21289 16.0871 2.21289 15.4573V13.1746C2.21289 12.5554 2.43768 12.0267 2.88727 11.5887C3.33865 11.1489 3.88122 10.929 4.51497 10.929Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <path
                        d="M13.8107 10.9474H16.1723C16.8061 10.9474 17.3486 11.1673 17.8 11.6071C18.2496 12.0452 18.4744 12.5739 18.4744 13.1931V15.4942C18.4744 16.1117 18.2496 16.6404 17.8 17.0802C17.3486 17.5183 16.8061 17.7373 16.1723 17.7373H13.8107C13.1751 17.7373 12.6325 17.5183 12.1829 17.0802C11.7316 16.6404 11.5059 16.1117 11.5059 15.4942V13.1931C11.5059 12.5739 11.7316 12.0452 12.1829 11.6071C12.6325 11.1673 13.1751 10.9474 13.8107 10.9474Z"
                        fill="#FD4A36"
                      />
                      <path
                        d="M4.51497 1.85645H6.87664C7.5122 1.85645 8.05477 2.07547 8.50435 2.51353C8.95574 2.95334 9.18143 3.482 9.18143 4.0995V6.40061C9.18143 7.01987 8.95574 7.54853 8.50435 7.98658C8.05477 8.4264 7.5122 8.64631 6.87664 8.64631H4.51497C3.88122 8.64631 3.33865 8.4264 2.88727 7.98658C2.43768 7.54853 2.21289 7.01987 2.21289 6.40061V4.0995C2.21289 3.482 2.43768 2.95334 2.88727 2.51353C3.33865 2.07547 3.88122 1.85645 4.51497 1.85645Z"
                        fill="#FD4A36"
                      />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <h4 className="font-medium p-5 text-base">Filter Options</h4>
                  <hr />

                  <div className="p-5 space-y-5">
                    <div className="space-y-1">
                      <h4 className="font-medium">Status:</h4>
                      <Select>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>Fruits</SelectLabel> */}
                            <SelectItem value="apple">Approved</SelectItem>
                            <SelectItem value="banana">Pending</SelectItem>
                            <SelectItem value="blueberry">
                              In Progress
                            </SelectItem>
                            <SelectItem value="grapes">Rejected</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Member Type:</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Checkbox />{" "}
                          <h6 className="text-grey-light">Author</h6>
                        </div>
                        <div className="flex items-center gap-1">
                          <Checkbox checked />{" "}
                          <h6 className="text-grey-light">Customer</h6>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Notifications:</h4>
                      <div className="flex items-center space-x-2">
                        <Switch id="notifications-mode" checked />
                        <Label htmlFor="notifications-mode">Enabled</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="ghost">Reset</Button>
                      <Button>Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-7">
            {[
              {
                name: "Prepare Health Report",
                description: "Due in 2 Days",
                status: "Urgent",
                backgroundColor: "bg-yellow-light",
                textColor: "text-yellow-dark",
                bgColor: "bg-yellow-dark",
              },
              {
                name: "Organize Health Seminar",
                description: "Due in 5 Days",
                status: "Upcoming",
                backgroundColor: "bg-green-light",
                textColor: "text-green-dark",
                bgColor: "bg-green-dark",
              },
              {
                name: "Review Nutrition Guidelines",
                description: "Due in 1 Days",
                status: "Review",
                backgroundColor: "bg-red-light",
                textColor: "text-red-dark",
                bgColor: "bg-red-dark",
              },
              {
                name: "Update Financial Projections",
                description: "Due in 1 Week",
                status: "Important",
                backgroundColor: "bg-red-light",
                textColor: "text-red-dark",
                bgColor: "bg-red-dark",
              },
              {
                name: "Finalize Partnership Deal",
                description: "Due in 2 Days",
                status: "Partnership",
                backgroundColor: "bg-yellow-light",
                textColor: "text-yellow-dark",
                bgColor: "bg-yellow-dark",
              },
              {
                name: "Coordinate with Education Dept.",
                description: "Due in 1 Days",
                status: "Finance",
                backgroundColor: "bg-yellow-light",
                textColor: "text-yellow-dark",
                bgColor: "bg-yellow-dark",
              },
            ].map(
              ({
                name,
                description,
                status,
                backgroundColor,
                textColor,
                bgColor,
              }) => (
                <div
                  key={name}
                  className="flex gap-5 items-center text-sm md:text-md"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-[5px] h-10 rounded-t-full rounded-b-full",
                        bgColor
                      )}
                    />
                    <div className="w-6 h-6 bg-gray-300 rounded-lg" />
                  </div>

                  <div className="w-[70%]">
                    <h4 className="font-medium">{name}</h4>
                    <h6 className="text-sm text-grey-dark">{description}</h6>
                  </div>

                  <div>
                    <Badge className={cn(textColor, backgroundColor)}>
                      {status}
                    </Badge>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <h4 className="font-bold text-lg">Funding Received by Projects</h4>
            <h6 className="text-xs">
              List of funding&apos;s for AHNI projects
            </h6>
          </div>

          <Table
            instance={tableInstance}
            // loading={customersQueryResult.isFetching}
            // error={customersQueryResult.isError}
            // onReload={customersQueryResult.refetch}
          />
        </Card>

        <Card className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-lg">Projects Expenditure</h4>
              <h6 className="text-xs">
                Total Funds Expended on Major Initiatives
              </h6>
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="iconBtn">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.3">
                        <path
                          d="M13.8107 1.8934H16.1723C16.8061 1.8934 17.3486 2.10979 17.8 2.54257C18.2496 2.97535 18.4744 3.50664 18.4744 4.13646V6.4191C18.4744 7.03836 18.2496 7.56701 17.8 8.00507C17.3486 8.44488 16.8061 8.66479 16.1723 8.66479H13.8107C13.1751 8.66479 12.6325 8.44488 12.1829 8.00507C11.7316 7.56701 11.5059 7.03836 11.5059 6.4191V4.13646C11.5059 3.50664 11.7316 2.97535 12.1829 2.54257C12.6325 2.10979 13.1751 1.8934 13.8107 1.8934Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <g opacity="0.3">
                        <path
                          d="M4.51497 10.929H6.87664C7.5122 10.929 8.05477 11.1489 8.50435 11.5887C8.95574 12.0267 9.18143 12.5554 9.18143 13.1746V15.4573C9.18143 16.0871 8.95574 16.6184 8.50435 17.0512C8.05477 17.484 7.5122 17.7003 6.87664 17.7003H4.51497C3.88122 17.7003 3.33865 17.484 2.88727 17.0512C2.43768 16.6184 2.21289 16.0871 2.21289 15.4573V13.1746C2.21289 12.5554 2.43768 12.0267 2.88727 11.5887C3.33865 11.1489 3.88122 10.929 4.51497 10.929Z"
                          fill="#FD4A36"
                        />
                      </g>
                      <path
                        d="M13.8107 10.9474H16.1723C16.8061 10.9474 17.3486 11.1673 17.8 11.6071C18.2496 12.0452 18.4744 12.5739 18.4744 13.1931V15.4942C18.4744 16.1117 18.2496 16.6404 17.8 17.0802C17.3486 17.5183 16.8061 17.7373 16.1723 17.7373H13.8107C13.1751 17.7373 12.6325 17.5183 12.1829 17.0802C11.7316 16.6404 11.5059 16.1117 11.5059 15.4942V13.1931C11.5059 12.5739 11.7316 12.0452 12.1829 11.6071C12.6325 11.1673 13.1751 10.9474 13.8107 10.9474Z"
                        fill="#FD4A36"
                      />
                      <path
                        d="M4.51497 1.85645H6.87664C7.5122 1.85645 8.05477 2.07547 8.50435 2.51353C8.95574 2.95334 9.18143 3.482 9.18143 4.0995V6.40061C9.18143 7.01987 8.95574 7.54853 8.50435 7.98658C8.05477 8.4264 7.5122 8.64631 6.87664 8.64631H4.51497C3.88122 8.64631 3.33865 8.4264 2.88727 7.98658C2.43768 7.54853 2.21289 7.01987 2.21289 6.40061V4.0995C2.21289 3.482 2.43768 2.95334 2.88727 2.51353C3.33865 2.07547 3.88122 1.85645 4.51497 1.85645Z"
                        fill="#FD4A36"
                      />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <h4 className="font-medium p-5 text-base">Filter Options</h4>
                  <hr />

                  <div className="p-5 space-y-5">
                    <div className="space-y-1">
                      <h4 className="font-medium">Status:</h4>
                      <Select>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>Fruits</SelectLabel> */}
                            <SelectItem value="apple">Approved</SelectItem>
                            <SelectItem value="banana">Pending</SelectItem>
                            <SelectItem value="blueberry">
                              In Progress
                            </SelectItem>
                            <SelectItem value="grapes">Rejected</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Member Type:</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Checkbox />{" "}
                          <h6 className="text-grey-light">Author</h6>
                        </div>
                        <div className="flex items-center gap-1">
                          <Checkbox checked />{" "}
                          <h6 className="text-grey-light">Customer</h6>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">Notifications:</h4>
                      <div className="flex items-center space-x-2">
                        <Switch id="notifications-mode" checked />
                        <Label htmlFor="notifications-mode">Enabled</Label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="ghost">Reset</Button>
                      <Button>Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex relative gap-5 flex-col md:flex-row">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width={400} height={400}>
                <Tooltip />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="block md:hidden">
              {pieData.map(({ name, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: color }}
                    className="h-3 w-3 rounded-full"
                  />
                  <h4>{name}</h4>
                </div>
              ))}
            </div>
            <div className="absolute hidden top-5 right-5 md:block">
              {pieData.map(({ name, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: color }}
                    className="h-3 w-3 rounded-full"
                  />
                  <h4>{name}</h4>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-lg">
            Projects <span className="text-sm text-grey-dark">by Status</span>
          </h4>

          <Select>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Fruits</SelectLabel> */}
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {Array(3)
            .fill({
              status: "complete",
              name: "Public Health Surveillance",
              description: "A project to enhance disease",
              date: "Dec 31, 2023",
              amount: 10000000,
            })
            .map((data, index) => (
              <Card
                key={index}
                className="border space-y-5 hover:border-primary"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <img src={logoPng} alt="logo" width={50} />
                  </div>
                  <div className="bg-green-light text-green-dark px-2 py-1 rounded-lg">
                    {data.status}
                  </div>
                </div>

                <div className="">
                  <h4 className="font-bold text-lg">{data.name}</h4>
                  <h6>{data.description}</h6>
                </div>

                <div className="flex gap-5 items-center">
                  <div className="p-3 border border-dashed rounded-lg">
                    <h4 className="font-bold text-lg">{data.date}</h4>
                    <h6>Due Date</h6>
                  </div>
                  <div className="p-3 border border-dashed rounded-lg">
                    <h4 className="font-bold text-lg">{data.amount}</h4>
                    <h6>Budget</h6>
                  </div>
                </div>

                <Progress value={83} />

                <div className="flex">
                  <div className="p-3 font-bold rounded-full text-center bg-[#7239EA] text-white">
                    PL
                  </div>
                  <div className="p-3 font-bold -ml-3 rounded-full text-center bg-[#7239EA] text-white">
                    HA
                  </div>
                  <div className="p-3 font-bold -ml-3 rounded-full text-center bg-[#7239EA] text-white">
                    DM
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const columns = [
  {
    header: "Project",
    accessorKey: "project",
    size: 250,
    cell: ({ row }) => <ProjectAction data={row.original} />,
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ getValue }) => <h6>${getValue()}</h6>,
  },
  {
    header: "Date Received",
    accessorKey: "date",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => {
      return (
        <Badge
          className={cn(
            "p-1 rounded-lg",
            getValue() === "Approved" && "bg-green-light text-green-dark",
            getValue() === "Reject" && "bg-red-light text-red-dark",
            getValue() === "Pending" && "bg-yellow-light text-yellow-dark",
            getValue() === "In Progress" && "bg-purple-light text-purple-dark"
          )}
        >
          {getValue()}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => <ActionListAction data={row.original} />,
  },
];

const data = [
  {
    ref: { name: "AHNI Health Project", desc: "Targeting rural areas" },
    amount: 25000,
    date: "11th Oct 2023",
    status: "Pending",
  },
  {
    ref: {
      name: "AHNI Education Initiative",
      desc: "Promoting digital education",
    },
    amount: 48000,
    date: "15th Oct 2023",
    status: "Comfirmed",
  },
  {
    ref: { name: "AHNI Health Project", desc: "Targeting rural areas" },
    amount: 25000,
    date: "11th Oct 2023",
    status: "Delayed",
  },
  {
    ref: {
      name: "AHNI Education Initiative",
      desc: "Promoting digital education",
    },
    amount: 48000,
    date: "15th Oct 2023",
    status: "In Progress",
  },
];

const ActionListAction = () => {
  return (
    <div className="flex items-center gap-2">
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="solar:pen-bold-duotone" fontSize={15} />
      </IconButton>
      <IconButton className="bg-[#F9F9F9] hover:text-primary">
        <Icon icon="ant-design:delete-twotone" fontSize={15} />
      </IconButton>
    </div>
  );
};

const ProjectAction = ({ data }) => {
  return (
    <div className="flex gap-3 items-center">
      <div>
        <img src={logoPng} alt="logo" width={50} />
      </div>
      <div>
        <h4 className="font-bold">{data.ref.name}</h4>
        <h6>{data.ref.desc}</h6>
      </div>
    </div>
  );
};

const pieData = [
  { name: "Group A", value: 400, color: "#0088FE" },
  { name: "Group B", value: 300, color: "#00C49F" },
  { name: "Group C", value: 300, color: "#FFBB28" },
  { name: "Group D", value: 200, color: "#FF8042" },
  { name: "Group E", value: 100, color: "#775DD0" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#775DD0"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
