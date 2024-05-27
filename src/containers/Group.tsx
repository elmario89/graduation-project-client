import * as React from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { FC, useEffect, useState } from "react";
import { useGroups } from "../providers/GroupsProvider";
import { Autocomplete, CircularProgress, Link } from "@mui/material";
import { Group as GroupModel } from "../types/group";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import { useFaculties } from "../providers/FacultiesProvider";
import { Faculty } from "../types/faculty";
import { Student } from "../types/student";

type GroupData = Omit<GroupModel & { dates: [Date, Date], facultyId: string }, 'finish' | 'start' | 'id'>;

type FormValues = {
    name: string;
    start: Date | null;
    finish: Date | null;
    faculty: Faculty;
    students?: Student[];
}

const Group: FC = () => {
    const [group, setGroup] =
        useState<FormValues | null>(null);
    const { getGroupById, createGroup, updateGroup } = useGroups();
    const { getAllFaculties, faculties } = useFaculties();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setLoading(true);
            getGroupById(id)
                .then((group) => {
                    if (group) {
                        setGroup(group);
                    }
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect(() => {
        getAllFaculties();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        control,
    } = useForm<GroupData>()

    const onSubmit: SubmitHandler<GroupData> = async (data) => {
        const { name, dates, facultyId } = data;
        const [start, finish] = dates;

        if (id) {
            await updateGroup({ id, name, finish, start, facultyId });
        } else {
            const group = await createGroup({ name, finish, start, facultyId });

            if (group) {
                navigate(`/admin/group/${group.id}`)
            }
        }
    };

    if ((id && !group) || loading || !faculties) {
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
                Группа
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
                            label="Название группы"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            defaultValue={group?.name || ''}
                            sx={{ mb: 2 }}
                        />

                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="dates"
                            defaultValue={[
                                group?.start ? group?.start : new Date(),
                                group?.finish ? group?.finish : new Date(),
                            ]}
                            render={({ field: { onChange } }) => (
                                <DateRangePicker
                                    format={'DD/MM/YYYY'}
                                    onChange={onChange}
                                    defaultValue={[
                                        group?.start ? dayjs(group?.start) : null,
                                        group?.finish ? dayjs(group?.finish) : null,
                                    ]}
                                    localeText={{ start: 'Начало обучения', end: 'Конец обучения' }}
                                />
                            )}
                        />
                        {errors.dates && <FormHelperText error={!!errors.dates}>Пожалуйста выберете даты</FormHelperText>}

                        <Controller
                            control={control}
                            rules={{ required: true }}
                            name="facultyId"
                            defaultValue={group?.faculty
                                ? group?.faculty.id
                                : undefined
                            }
                            render={({ field: { onChange } }) => (
                                <Autocomplete
                                    disablePortal
                                    defaultValue={group?.faculty
                                        ? { label: group?.faculty.name, value: group?.faculty.id }
                                        : null
                                    }
                                    onChange={(_, chosen) =>
                                        onChange(chosen?.value)
                                    }
                                    options={faculties
                                        .map((faculty) =>
                                            ({ label: faculty.name, value: faculty.id }))
                                    }
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label="Институт"
                                            error={!!errors.facultyId}
                                        />
                                    }
                                    sx={{ mt: 2 }}
                                />
                            )}
                        />

                        {id && (
                            <Button
                                variant="contained"
                                color="info"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => navigate(`/admin/schedule/${id}`)}
                            >
                                Обновить расписание
                            </Button>
                        )}

                        {group?.students && group.students.length > 0 && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                                    Студенты:
                                </Typography>
                                <Box display="flex" flexDirection={'column'} gap={1} sx={{ my: 2 }}>
                                    {
                                        group.students.map((student) =>
                                            <Link
                                                style={{ alignSelf: 'flex-start' }}
                                                key={student.id}
                                                component={RouterLink}
                                                to={`/admin/student/${student.id}`}
                                            >
                                                {student.name} {student.surname}
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
                                {id ? 'Обновить группу' : 'Создать группу'}
                            </Button>
                            <Button
                                onClick={() => navigate(`/admin/groups`)}
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

export default Group;