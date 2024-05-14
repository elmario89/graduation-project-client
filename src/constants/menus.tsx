import { BaseLayoutMenu } from "../types/base-layout-menu";
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

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
    {
        path: '/admin/locations',
        label: 'Locations',
        icon: <AddLocationIcon />,
    },
];

export const STUDENT_MENU: BaseLayoutMenu[] = [
    {
        path: '/student/schedule',
        label: 'Schedule',
        icon: <SchoolIcon />,
    }
];

export const TEACHER_MENU: BaseLayoutMenu[] = [
    {
        path: '/teacher/schedule',
        label: 'Schedule',
        icon: <AccessAlarmIcon />,
    },
    {
        path: '/teacher/disciplines',
        label: 'Disciplines',
        icon: <SchoolIcon />,
    },
];