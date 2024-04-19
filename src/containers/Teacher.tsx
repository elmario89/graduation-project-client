import * as React from 'react';
import {FC, useEffect, useState} from "react";
import {useTeachers} from "../providers/TeachersProvider";
import {Autocomplete, Checkbox, CircularProgress, Link} from "@mui/material";
import {Teacher as TeacherModel} from "../types/teacher";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {SubmitHandler, useForm, Controller} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import {Link as RouterLink, useNavigate, useParams} from "react-router-dom";
import {Discipline} from "../types/discipline";
import {useDisciplines} from "../providers/DisciplinesProvider";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

type TeacherData = Omit<TeacherModel & { disciplineIds: string[] }, 'id'>;

type FormValues = {
    name: string;
    surname: string;
    login: string;
    password: string;
    disciplines?: Discipline[];
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Teacher: FC = () => {
    const [teacher, setTeacher] =
        useState<FormValues | null>(null);
    const { getTeacherById, createTeacher, updateTeacher } = useTeachers();
    const { getAllDisciplines, disciplines } = useDisciplines();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect( () => {
        if (id) {
            setLoading(true);
            getTeacherById(id)
                .then((teacher) => {
                    if (teacher) {
                        setTeacher(teacher);
                    }
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect( () => {
        getAllDisciplines();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<TeacherData>()

    const onSubmit: SubmitHandler<TeacherData> = async (data) => {
        if (id) {
            await updateTeacher({ id, ...data });
        } else {
            const teacher = await createTeacher(data);

            if (teacher) {
                navigate(`/admin/teacher/${teacher.id}`)
            }
        }
    };

    if ((id && !teacher) || loading)  {
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
                Teacher
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
                            defaultValue={teacher?.name || ''}
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
                            defaultValue={teacher?.surname || ''}
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
                                    defaultValue={teacher?.login || ''}
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
                                    sx={{ mb: 2 }}
                                />
                            </>
                        )}

                        <Controller
                            control={control}
                            rules={ { required: true }}
                            name="disciplineIds"
                            defaultValue={teacher?.disciplines
                                ? teacher?.disciplines.map((discipline) => discipline.id) : []
                            }
                            render={({ field: { onChange } }) => (
                                <Autocomplete
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={disciplines?.map((discipline) =>
                                        ({ label: discipline.name, value: discipline.id })) || []}
                                    disableCloseOnSelect
                                    getOptionLabel={(option: { label: string }) => option.label}
                                    onChange={(_, chosen) => {
                                        onChange(chosen?.map((discipline) => discipline.value))
                                    }}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{marginRight: 8}}
                                                checked={selected}
                                            />
                                            {option.label}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            error={!!errors.disciplineIds}
                                            {...params}
                                            label="Choose disciplines"
                                            placeholder="Disciplines"
                                        />
                                    )}
                                    sx={{mb: 2, mt: 2}}
                                />
                            )}
                        />

                        {teacher?.disciplines && teacher.disciplines.length > 0 && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                                    Disciplines:
                                </Typography>
                                <Box display="flex" flexDirection={'column'} gap={1} sx={{ my: 2 }}>
                                    {
                                        teacher.disciplines.map((d) =>
                                            <Link component={RouterLink} to={`/admin/discipline/${d.id}`}>
                                                {d.name}
                                            </Link>)
                                    }
                                </Box>
                            </>
                        )}

                        <Box display="flex" gap={1}>
                            <Button
                                type={'submit'}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {id ? 'Update teacher' : 'Create teacher'}
                            </Button>
                            <Button
                                onClick={() => navigate(`/admin/teachers`)}
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

export default Teacher;