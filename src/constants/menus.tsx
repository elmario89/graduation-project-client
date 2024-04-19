import {BaseLayoutMenu} from "../types/base-layout-menu";
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export const ADMIN_MENU: BaseLayoutMenu[] = [
    {
        path: '/admin/groups',
        label: 'Groups',
        icon: <GroupIcon />,
    },
    {
        path: '/admin/faculties',
        label: 'Faculties',
        icon: <AccountBalanceIcon />,
    },
    {
        path: '/admin/add-student',
        label: 'Student',
        icon: <SchoolIcon />,
    },
];