import * as React from 'react';
import {FC, useEffect, useState} from "react";
import {useStudents} from "../providers/StudentsProvider";
import {Autocomplete, CircularProgress} from "@mui/material";
import {Student as StudentModel} from "../types/student";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {SubmitHandler, useForm, Controller} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import {useNavigate, useParams} from "react-router-dom";
import {Group} from "../types/group";
import {useGroups} from "../providers/GroupsProvider";

type StudentData = Omit<StudentModel & { groupId: string }, 'id'>;

type FormValues = {
    name: string;
    surname: string;
    login: string;
    password: string;
    group: Group;
}

const Student: FC = () => {
    const [student, setStudent] =
        useState<FormValues | null>(null);
    const { getStudentById, createStudent, updateStudent } = useStudents();
    const { getAllGroups, groups } = useGroups();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect( () => {
        if (id) {
            setLoading(true);
            getStudentById(id)
                .then((student) => {
                    if (student) {
                        setStudent(student);
                    }
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect( () => {
        getAllGroups();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<StudentData>()

    const onSubmit: SubmitHandler<StudentData> = async (data) => {
        if (id) {
            await updateStudent({ id, ...data });
        } else {
            const student = await createStudent(data);

            if (student) {
                navigate(`/admin/student/${student.id}`)
            }
        }
    };

    if ((id && !student) || loading || !groups)  {
        return (
            <div
                style={{
                    height: '100vh',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress />
            </div>
        )
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Student
            </Typography>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box justifyContent="flex-start" component="form" width={600} onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            {...register("name", { required: true })}
                            margin="normal"
                            error={!!errors.name}
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            defaultValue={student?.name || ''}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register("surname", { required: true })}
                            margin="normal"
                            error={!!errors.surname}
                            required
                            fullWidth
                            id="surname"
                            label="Surname"
                            name="surname"
                            autoComplete="surname"
                            autoFocus
                            defaultValue={student?.surname || ''}
                            sx={{ mb: 2 }}
                        />

                        {!id && (
                            <>
                                <TextField
                                    {...register("login", { required: true })}
                                    margin="normal"
                                    error={!!errors.login}
                                    required
                                    fullWidth
                                    id="login"
                                    label="Login"
                                    name="login"
                                    autoComplete="login"
                                    autoFocus
                                    defaultValue={student?.login || ''}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    {...register("password", { required: true })}
                                    margin="normal"
                                    error={!!errors.password}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                            </>
                        )}

                        <Controller
                            control={control}
                            rules={ { required: true }}
                            name="groupId"
                            defaultValue={student?.group
                                ? student?.group.id
                                : undefined
                            }
                            render={({ field: { onChange } }) => (
                                <Autocomplete
                                    disablePortal
                                    defaultValue={student?.group
                                        ? { label: student?.group.name, value: student?.group.id }
                                        : undefined
                                    }
                                    onChange={(_, chosen) =>
                                        onChange(chosen?.value)
                                    }
                                    options={groups
                                        .map((group) =>
                                            ({ label: group.name, value: group.id }))
                                    }
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Group"
                                            error={!!errors.groupId}
                                        />
                                    }
                                    sx={{ mt: 2 }}
                                />
                            )}
                        />

                        <Box display="flex" gap={1}>
                            <Button
                                type={'submit'}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {id ? 'Update student' : 'Create student'}
                            </Button>
                            <Button
                                onClick={() => navigate(`/admin/students`)}
                                variant="contained"
                                color="warning"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Back
                            </Button>
                        </Box>
                    </Box>
                </LocalizationProvider>
            </Box>
        </>
    );
}

export default Student;