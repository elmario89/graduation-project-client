import * as React from 'react';
import { useState, FC } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SubmitHandler, useForm } from "react-hook-form";
import { Auth } from "../types/auth";
import { useAuth } from "../providers/AuthProvider";
import { UserRole } from '../enums/user-role';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { StorageService } from '../services/storage.service';

const defaultTheme = createTheme();

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function SignIn() {
    const storageService = new StorageService();
    const [role, setRole] = useState<number>(storageService.getItem('signInRole') || 0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setRole(newValue);
        storageService.setItem('signInRole', newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={role} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Авторизоваться как студент" {...a11yProps(0)} />
                    <Tab label="Авторизоваться как преподаватель" {...a11yProps(1)} />
                    <Tab label="Авторизоваться как админ" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={role} index={0}>
                <SignInContent role={UserRole.Student} />
            </CustomTabPanel>
            <CustomTabPanel value={role} index={1}>
                <SignInContent role={UserRole.Teacher} />
            </CustomTabPanel>
            <CustomTabPanel value={role} index={2}>
                <SignInContent role={UserRole.Admin} />
            </CustomTabPanel>
        </Box>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

type SignInContentProps = {
    role: UserRole;
};

const SignInContent: FC<SignInContentProps> = ({ role }) => {
    const { signIn } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Auth>()

    const onSubmit: SubmitHandler<Auth> = async (data) => signIn({ ...data, role });

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="md">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Авторизоваться
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            {...register("login", { required: true })}
                            margin="normal"
                            error={!!errors.login}
                            required
                            fullWidth
                            id="login"
                            label="Логин"
                            name="login"
                            autoComplete="login"
                            autoFocus
                        />
                        <TextField
                            {...register("password", { required: true })}
                            margin="normal"
                            error={!!errors.password}
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Авторизоваться
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}