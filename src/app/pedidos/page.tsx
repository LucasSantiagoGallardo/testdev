
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ProfileBox from "@/components/ProfileBox";
import HistoricOrders from "@/components/pedidos/historicouser";


export const metadata: Metadata = {
  title: "Pedidos",
  description: "Pedidos",
};


const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Pedidos" />
<HistoricOrders>

</HistoricOrders>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
