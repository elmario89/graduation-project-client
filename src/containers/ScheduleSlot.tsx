import * as React from 'react';
import {FC, useEffect, useState} from "react";
import {useSchedules} from "../providers/ScheduleProvider";
import {Autocomplete, CircularProgress} from "@mui/material";
import {Schedule as ScheduleModel} from "../types/schedule";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {useNavigate, useParams} from "react-router-dom";
import {Teacher} from "../types/teacher";
import {useDisciplines} from "../providers/DisciplinesProvider";
import {useTeachers} from "../providers/TeachersProvider";
import {Discipline} from "../types/discipline";
import {Day} from "../types/day";
import {ScheduleType} from "../enums/schedule-type.enum";
import useRoleMessageHook from "../hook/use-week-day.hook";
import {TimeMapper} from "./mappers/time.mapper";

type ScheduleData = ScheduleModel & { groupId: string; disciplineId: string; teacherId: string; };

type FormValues = {
    day: Day;
    time: string;
    scheduleType: ScheduleType;
    teacher: Teacher;
    discipline: Discipline;
}

const ScheduleSlot: FC = () => {
    const [schedule, setSchedule] =
        useState<FormValues | null>(null);
    const [config, setConfig] =
        useState<{ disciplines: Discipline[]; teachers: Teacher[] } | null>(null);
    const { getScheduleById, createSchedule, updateSchedule } = useSchedules();
    const { getAllDisciplines } = useDisciplines();
    const { getAllTeachers } = useTeachers();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const { id, groupId, day, time,  } = useParams();

    const weekDayName = useRoleMessageHook(day as Day);
    useEffect( () => {
        if (id) {
            setLoading(true);
            getScheduleById(id)
                .then((schedule) => {
                    if (schedule) {
                        setSchedule(schedule);
                    }
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect( () => {
        Promise.all([getAllDisciplines(), getAllTeachers()])
            .then(([disciplines, teachers]) => {
                setConfig({ disciplines: disciplines || [], teachers: teachers || [] });
            })
    }, []);

    const {
        handleSubmit,
        formState: { errors, isDirty },
        control,
    } = useForm<ScheduleData>()

    const onSubmit: SubmitHandler<ScheduleData> = async (data) => {
        if (id) {
            await updateSchedule({ ...data, id, groupId: groupId || '', day: day as Day, time: time || '' });
        } else {
            const schedule =
                await createSchedule({ ...data, groupId: groupId || '', day: day as Day, time: time || ''  });

            if (schedule) {
                navigate(`/admin/schedule/${groupId}}`)
            }
        }
    };

    if ((id && !schedule) || loading || !config)  {
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
                Schedule {weekDayName} {time ? TimeMapper[time as keyof typeof TimeMapper] : 'Unknown...'}
            </Typography>
            <Box justifyContent="flex-start" component="form" width={600} onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                <Controller
                    control={control}
                    rules={ { required: true }}
                    name="teacherId"
                    defaultValue={schedule?.teacher
                        ? schedule?.teacher.id
                        : undefined
                    }
                    render={({ field: { onChange } }) => (
                        <Autocomplete
                            disablePortal
                            defaultValue={schedule?.teacher
                                ? {
                                    label: `${schedule?.teacher.name} ${schedule?.teacher.surname}`,
                                    value: schedule?.teacher.id,
                                }
                                : null
                            }
                            onChange={(_, chosen) =>
                                onChange(chosen?.value)
                            }
                            options={config?.teachers.map((t) =>
                                    ({ label: `${t.name} ${t.surname}`, value: t.id }))
                            }
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Teacher"
                                    error={!!errors.teacherId}
                                />
                            }
                            sx={{ mt: 2 }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    rules={ { required: true }}
                    name="disciplineId"
                    defaultValue={schedule?.discipline
                        ? schedule?.discipline.id
                        : undefined
                    }
                    render={({ field: { onChange } }) => (
                        <Autocomplete
                            disablePortal
                            defaultValue={schedule?.discipline
                                ? {
                                    label: `${schedule?.discipline.name}`,
                                    value: schedule?.discipline.id,
                                }
                                : null
                            }
                            onChange={(_, chosen) =>
                                onChange(chosen?.value)
                            }
                            options={config?.disciplines.map((d) =>
                                ({ label: `${d.name}`, value: d.id }))
                            }
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Discipline"
                                    error={!!errors.disciplineId}
                                />
                            }
                            sx={{ mt: 2 }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    rules={ { required: true }}
                    name="scheduleType"
                    defaultValue={schedule?.scheduleType
                        ? schedule?.scheduleType
                        : undefined
                    }
                    render={({ field: { onChange } }) => (
                        <Autocomplete
                            disablePortal
                            defaultValue={schedule?.discipline
                                ? {
                                    label: schedule?.scheduleType,
                                    value: schedule?.scheduleType,
                                }
                                : null
                            }
                            onChange={(_, chosen) =>
                                onChange(chosen?.value)
                            }
                            options={[
                                {
                                    label: 'Lecture',
                                    value: ScheduleType.Lecture,
                                },
                                {
                                    label: 'Laboratory',
                                    value: ScheduleType.Laboratory,
                                },
                                {
                                    label: 'Practice',
                                    value: ScheduleType.Practice,
                                },
                            ]}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Class type"
                                    error={!!errors.scheduleType}
                                />
                            }
                            sx={{ mt: 2 }}
                        />
                    )}
                />
                <Box display="flex" gap={1}>
                    <Button
                        disabled={!isDirty}
                        type={'submit'}
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {id ? 'Update student' : 'Create student'}
                    </Button>
                    <Button
                        onClick={() => navigate(`/admin/schedule/${groupId}`, { replace: true })}
                        variant="contained"
                        color="warning"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Back
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default ScheduleSlot;