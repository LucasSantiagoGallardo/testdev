
"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ProfileBox from "@/components/ProfileBox";
import UserMenuSelection from '../../components/usermenuselection';





//      <--UserMenuSelection--> <--/UserMenuSelection--> 

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Reserva Menu" />

      </div>
      <UserMenuSelection/> 
    </DefaultLayout>
  );
};

export default Profile;
