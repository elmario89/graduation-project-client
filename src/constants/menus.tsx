import {BaseLayoutMenu} from "../types/base-layout-menu";
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import MenuBookIcon from '@mui/icons-material/MenuBook';

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
        path: '/admin/students',
        label: 'Students',
        icon: <SchoolIcon />,
    },
    {
        path: '/admin/teachers',
        label: 'Teachers',
        icon: <TextIncreaseIcon />,
    },
    {
        path: '/admin/disciplines',
        label: 'Disciplines',
        icon: <MenuBookIcon />,
    },
];