import { TabsContent } from "@radix-ui/react-tabs";
import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import RoleList from "./RoleList";
import AuthList from "./AuthList";

const Authorization = () => {
    return (
        <div>
            <BackNavigation extraText="Authorization" />
            <div>
                <Tabs defaultValue="roles">
                    <TabsList>
                        <TabsTrigger value="roles">Roles</TabsTrigger>
                        <TabsTrigger value="authorization">
                            Permissions
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="roles">
                        <RoleList />
                    </TabsContent>
                    <TabsContent value="authorization">
                        {/* <AuthList /> */}
                        <></>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Authorization;
