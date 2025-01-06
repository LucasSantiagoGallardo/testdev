
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/layout-admin/DefaultLaout";
import CrudMenu from "@/components/admin/CrudMenu";


export const metadata: Metadata = {
  title: "Lista de Menus ",
  description: "Crud",
};


const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        
<CrudMenu>

</CrudMenu>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
