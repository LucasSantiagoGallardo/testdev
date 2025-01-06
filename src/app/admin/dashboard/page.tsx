
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/layout-admin/DefaultLaout";
import Dashboard from "@/components/admin/dashboard";



export const metadata: Metadata = {
  title: "Dashboard",
  description: "admin",
};


const Dashboard1 = () => {

return (
    <DefaultLayout>

<Dashboard></Dashboard>


</DefaultLayout>
);

};


export default Dashboard1;
