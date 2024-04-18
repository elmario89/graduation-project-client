import * as React from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import {FC, useEffect, useState} from "react";
import {useGroups} from "../providers/GroupsProvider";
import {CircularProgress} from "@mui/material";
import {Group as GroupModel} from "../types/group";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {SubmitHandler, useForm, Controller} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import FormHelperText from '@mui/material/FormHelperText';
import {useNavigate, useParams} from "react-router-dom";
import dayjs from "dayjs";

type GroupData = Omit<GroupModel & { dates: [Date, Date] } , 'finish' | 'start' | 'id'>;

type FormValues = {
    name: string;
    start: Date | null;
    finish: Date | null;
}

const Group: FC = () => {
    const [group, setGroup] =
        useState<FormValues | null>(null);
    const { getGroupById, createGroup, updateGroup } = useGroups();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect( () => {
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

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<GroupData>()

    const onSubmit: SubmitHandler<GroupData> = async (data) => {
        const { name, dates } = data;
        const [start, finish] = dates;

        if (id) {
            await updateGroup({ id, name, finish, start });
        } else {
            const group = await createGroup({ name, finish, start });

            if (group) {
                navigate(`/admin/group/${group.id}`)
            }
        }
    };

    if ((id && !group) || loading)  {
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
                Group
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
                            label="Group name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            defaultValue={group?.name || ''}
                        />
                        <Controller
                            control={control}
                            rules={ { required: true }}
                            name="dates"
                            render={({ field: { onChange } }) => (
                                <DateRangePicker
                                    format={'DD/MM/YYYY'}
                                    disablePast
                                    onChange={onChange}
                                    defaultValue={[
                                        group?.start ? dayjs(group?.start) : null,
                                        group?.finish ? dayjs(group?.finish) : null,
                                    ]}
                                    localeText={{ start: 'Start education', end: 'Finish education' }}
                                />
                            )}
                        />
                        {errors.dates && <FormHelperText error={!!errors.dates}>Please choose range</FormHelperText>}
                        <Box display="flex" gap={1}>
                            <Button
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {id ? 'Update group' : 'Create group'}
                            </Button>
                            <Button
                                onClick={() => navigate('/admin/groups')}
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

export default Group;