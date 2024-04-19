import * as React from 'react';
import {FC, useEffect, useState} from "react";
import {useFaculties} from "../providers/FacultiesProvider";
import {CircularProgress} from "@mui/material";
import {Faculty as FacultyModel} from "../types/faculty";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {SubmitHandler, useForm} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import {useNavigate, useParams} from "react-router-dom";

type FacultyData = Omit<FacultyModel, 'id'>;

type FormValues = {
    name: string;
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
        formState: { errors },
    } = useForm<FacultyData>()

    const onSubmit: SubmitHandler<FacultyData> = async (data) => {
        const { name} = data;

        if (id) {
            await updateFaculty({ id, name });
        } else {
            const faculty = await createFaculty({ name });

            if (faculty) {
                navigate(`/admin/faculty/${faculty.id}`)
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
                Faculty
            </Typography>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box justifyContent="flex-start" component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            {...register("name", { required: true })}
                            margin="normal"
                            error={!!errors.name}
                            required
                            fullWidth
                            id="name"
                            label="Faculty name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            defaultValue={faculty?.name || ''}
                        />
                        <Box display="flex" gap={1}>
                            <Button
                                type={'submit'}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {id ? 'Update faculty' : 'Create faculty'}
                            </Button>
                            <Button
                                onClick={() => navigate('/admin/faculties')}
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

export default Faculty;