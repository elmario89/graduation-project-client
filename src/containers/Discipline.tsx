import * as React from 'react';
import {FC, useEffect, useState} from "react";
import {useDisciplines} from "../providers/DisciplinesProvider";
import {CircularProgress, Link} from "@mui/material";
import {Discipline as DisciplineModel} from "../types/discipline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {SubmitHandler, useForm} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import {useNavigate, useParams, Link as RouterLink} from "react-router-dom";
import {useFaculties} from "../providers/FacultiesProvider";
import {Teacher} from "../types/teacher";

type DisciplineData = Omit<DisciplineModel, 'id'>;

type FormValues = {
    name: string;
    teachers?: Teacher[];
}

const Discipline: FC = () => {
    const [discipline, setDiscipline] =
        useState<FormValues | null>(null);
    const { getDisciplineById, createDiscipline, updateDiscipline } = useDisciplines();
    const { getAllFaculties, faculties } = useFaculties();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect( () => {
        if (id) {
            setLoading(true);
            getDisciplineById(id)
                .then((discipline) => {
                    if (discipline) {
                        setDiscipline(discipline);
                    }
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect( () => {
        getAllFaculties();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DisciplineData>()

    const onSubmit: SubmitHandler<DisciplineData> = async (data) => {
        const { name} = data;

        if (id) {
            await updateDiscipline({ id, name });
        } else {
            const discipline = await createDiscipline(data);

            if (discipline) {
                navigate(`/admin/discipline/${discipline.id}`)
            }
        }
    };

    if ((id && !discipline) || loading || !faculties)  {
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
                Discipline
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
                            label="Discipline name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            defaultValue={discipline?.name || ''}
                            sx={{ mb: 2 }}
                        />

                        {discipline?.teachers && discipline.teachers.length > 0 && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                                    Teachers:
                                </Typography>
                                <Box display="flex" flexDirection={'column'} gap={1} sx={{ my: 2 }}>
                                    {
                                        discipline.teachers.map((teacher) =>
                                            <Link component={RouterLink} to={`/admin/teacher/${teacher.id}`}>
                                                {teacher.name} {teacher.surname}
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
                                {id ? 'Update discipline' : 'Create discipline'}
                            </Button>
                            <Button
                                onClick={() => navigate(`/admin/disciplines`)}
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

export default Discipline;