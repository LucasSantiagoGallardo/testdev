"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";

import {
  FaHamburger,
  FaClipboardList,
  FaUserTie,
  FaChartBar,
  FaCogs,
  FaBell,
  FaWarehouse,
  FaUsers,
  FaCommentDots,
  FaCalendarAlt,
  FaChartPie,
  FaLifeRing,
  FaFileAlt,
} from "react-icons/fa";

// Tipado de las props
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuGroups = [
  {
    name: "MAIN MENU",
    menuItems: [
      { icon: <FaChartBar />, label: "Dashboard", route: "/admin/dashboard" },
      { icon: <FaHamburger />, label: "Cargar Menú", route: "/admin/crudmenu" },
      { icon: <FaClipboardList />, label: "Pedidos", route: "/admin/pedidos" },
      { icon: <FaUserTie />, label: "Empleados", route: "#" },
      { icon: <FaUsers />, label: "Gestión de Usuarios", route: "#" },
      { icon: <FaCommentDots />, label: "Feedback de Clientes", route: "#" },
      { icon: <FaCalendarAlt />, label: "Programación de Menús", route: "/admin/programacion-menus" },
      { icon: <FaChartPie />, label: "Estadísticas", route: "#" },
      { icon: <FaWarehouse />, label: "Inventario", route: "#" },
      { icon: <FaChartBar />, label: "Reportes", route: "#" },
      { icon: <FaCogs />, label: "Configuración", route: "#" },
      { icon: <FaBell />, label: "Notificaciones", route: "#" },
      { icon: <FaLifeRing />, label: "Soporte y Ayuda", route: "#" },
      { icon: <FaFileAlt />, label: "Logs del Sistema", route: "#" },
    ],
  },
];

// Componente Sidebar con tipos
const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 duration-300 ease-linear" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link href="/">
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo-dark.svg"}
              alt="Logo"
              priority
              className="dark:hidden"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo.svg"}
              alt="Logo"
              priority
              className="hidden dark:block"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>

          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="block lg:hidden">
            <FaChartBar size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>
                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem key={menuIndex} item={menuItem} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
