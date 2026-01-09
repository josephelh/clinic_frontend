// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";
import { MdCalendarToday, MdPeople } from 'react-icons/md';
import AgendaView from 'views/admin/agenda';
import PatientsView from 'views/admin/patients';
import EMRHub from "views/admin/medical/EMRHub";
import { Permission } from "src/types/permissions";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    requiredPermissions: [Permission.VIEW_APPOINTMENTS], // Anyone can view
  },
  {
    name: 'Agenda',
    layout: '/admin',
    path: 'agenda',
    icon: <MdCalendarToday className="h-6 w-6" />,
    component: <AgendaView />,
    requiredPermissions: [Permission.VIEW_APPOINTMENTS],
  },
  {
    name: "Patients",
    layout: "/admin",
    path: "patients",
    icon: <MdPeople className="h-6 w-6" />,
    component: <PatientsView />,
    requiredPermissions: [Permission.VIEW_PATIENTS],
  },
  {
    name: "EMR Session",
    layout: "/admin",
    path: "patients/:patientId/emr",
    component: <EMRHub />,
    secondary: true, // Hides from sidebar in some Horizon versions or treat as secondary
    requiredPermissions: [Permission.VIEW_PATIENTS], 
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
    requiredPermissions: [Permission.VIEW_PATIENTS],
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    // No permissions needed - everyone can view their own profile
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "rtl",
    icon: <MdHome className="h-6 w-6" />,
    component: <RTLDefault />,
  },
];
export default routes;
