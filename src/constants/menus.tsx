import { BaseLayoutMenu } from "../types/base-layout-menu";
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ApartmentIcon from '@mui/icons-material/Apartment';

export const ADMIN_MENU: BaseLayoutMenu[] = [
    {
        path: '/admin/groups',
        label: 'Группы',
        icon: <GroupIcon />,
    },
    {
        path: '/admin/faculties',
        label: 'Факультеты',
        icon: <AccountBalanceIcon />,
    },
    {
        path: '/admin/students',
        label: 'Студенты',
        icon: <SchoolIcon />,
    },
    {
        path: '/admin/teachers',
        label: 'Учителя',
        icon: <TextIncreaseIcon />,
    },
    {
        path: '/admin/disciplines',
        label: 'Дисциплины',
        icon: <MenuBookIcon />,
    },
    {
        path: '/admin/auditories',
        label: 'Аудитории',
        icon: <AddLocationIcon />,
    },
    {
        path: '/admin/buildings',
        label: 'Здания',
        icon: <ApartmentIcon />,
    },
];

export const STUDENT_MENU: BaseLayoutMenu[] = [
    {
        path: '/student/schedule',
        label: 'Расписание',
        icon: <SchoolIcon />,
    }
];

export const TEACHER_MENU: BaseLayoutMenu[] = [
    {
        path: '/teacher/schedule',
        label: 'Расписание',
        icon: <AccessAlarmIcon />,
    },
    {
        path: '/teacher/disciplines',
        label: 'Дисциплины',
        icon: <SchoolIcon />,
    },
];