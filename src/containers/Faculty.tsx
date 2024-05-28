import * as React from 'react';
import {FC, useEffect, useState} from "react";
import {useFaculties} from "../providers/FacultiesProvider";
import {CircularProgress, Link} from "@mui/material";
import {Faculty as FacultyModel} from "../types/faculty";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {SubmitHandler, useForm} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import {Link as RouterLink, useNavigate, useParams} from "react-router-dom";
import {Group} from "../types/group";

type FacultyData = Omit<FacultyModel, 'id'>;

type FormValues = {
    name: string;
    groups?: Group[];
}

const Faculty: FC = () => {
    const [faculty, setFaculty] =
        useState<FormValues | null>(null);
    const { getFacultyById, createFaculty, updateFaculty } = useFaculties();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect( () => {
        if (id) {
            setLoading(true);
            getFacultyById(id)
                .then((faculty) => {
                    if (faculty) {
                        setFaculty(faculty);
                    }
                    setLoading(false);
                });
        }
    }, [id]);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<FacultyData>()

    const onSubmit: SubmitHandler<FacultyData> = async (data) => {
        const { name} = data;

        if (id) {
            await updateFaculty({ id, name });
        } else {
            const faculty = await createFaculty({ name });

            if (faculty) {
                navigate(`/admin/institute/${faculty.id}`)
            }
        }
    };

    if ((id && !faculty) || loading)  {
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
                Институт
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
                            label="Название"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            defaultValue={faculty?.name || ''}
                        />

                        {faculty?.groups && faculty.groups.length > 0 && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                                    Группы:
                                </Typography>
                                <Box display="flex" flexDirection={'column'} gap={1} sx={{ my: 2 }}>
                                    {
                                        faculty.groups.map((group) =>
                                            <Link style={{ alignSelf: 'flex-start'}} key={group.id} component={RouterLink} to={`/admin/group/${group.id}`}>
                                                {group.name}
                                            </Link>)
                                    }
                                </Box>
                            </>
                        )}

                        <Box display="flex" gap={1}>
                            <Button
                                disabled={!isDirty}
                                type={'submit'}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {id ? 'Обновить институт' : 'Добавить институт'}
                            </Button>
                            <Button
                                onClick={() => navigate(`/admin/institutes`)}
                                variant="contained"
                                color="warning"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Назад
                            </Button>
                        </Box>
                    </Box>
                </LocalizationProvider>
            </Box>
        </>
    );
}

export default Faculty;