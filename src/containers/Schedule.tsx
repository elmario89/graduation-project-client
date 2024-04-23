import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Chip,
    CircularProgress, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import {useNavigate, useParams} from "react-router-dom";
import Divider from "@mui/material/Divider";
import {useSchedules} from "../providers/ScheduleProvider";
import {Day} from "../types/day";
import {Schedule as ScheduleModel} from '../types/schedule';
import {TimeMapper} from "./mappers/time.mapper";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {DayMapper} from "./mappers/day.mapper";
import {ScheduleMapper} from "./mappers/schedule.mapper";

const INITIAL_TIME = [800, 940, 1120, 1330, 1510, 1650, 1825, 2000];

const Schedule: FC = () => {
    const { getSchedulesByGroupId, deleteSchedule, schedules } = useSchedules();
    const [loading, setLoading] = useState<boolean>(false);
    const [config, setConfig] =
        useState<Record<number, ScheduleModel | null>[]| null>(null);

    const [deleteDialogOpened, setDeleteDialogOpened] =
        React.useState<boolean>(false);
    const [deleteCandidate, setDeleteCandidate] =
        React.useState<string | null>(null);

    const navigate = useNavigate();
    const { id, groupId } = useParams();

    const generateArray = (data: ScheduleModel[], day: Day, time: number) =>
        data?.filter((s: ScheduleModel) => s.day === day && s.time === time.toString())[0] || null;

    useEffect( () => {
        if (groupId) {
            setLoading(true);
            getSchedulesByGroupId(groupId)
                .then((response) => {
                    if (response) {
                        const configs = Array.from(Array(7).keys()).map((day) => {
                            let result = {};

                            INITIAL_TIME.forEach(time => {
                                result = {
                                    ...result,
                                    [time]: generateArray(response, day.toString() as Day, time),
                                }
                            })

                            return result;
                        });

                        setConfig(configs);

                        setLoading(false);
                    }
                });
        }
    }, [groupId]);

    if ((id && !schedules) || loading || !config)  {
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
                Schedule
            </Typography>
            <CssBaseline />
            {config.map((day, index) => (
                <Card key={index} sx={{ minWidth: 275, maxWidth: 1200, my: 4 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {DayMapper[index as keyof typeof DayMapper]}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box>
                            <Box style={{ display: 'flex', flexDirection: 'column',  gap: '8px', flexWrap: 'wrap' }}>
                                {Object.entries(day).map(([time, schedule]) => (
                                    <TableContainer component={Paper} sx={{ my: 2 }}>
                                        <Table style={{ tableLayout: 'fixed' }} sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Time</TableCell>
                                                    <TableCell>Discipline</TableCell>
                                                    <TableCell>Teacher</TableCell>
                                                    <TableCell>Class type</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow
                                                    onClick={() => navigate(`/admin/schedule/${groupId}/${index}/${time}/${schedule?.id || ''}`)}
                                                    style={{ cursor: 'pointer' }}
                                                    hover={true}
                                                    key={schedule?.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell style={{ width: 335 }}>
                                                        <Chip
                                                            style={{ width: 130 }}
                                                            onClick={() => navigate(`/admin/schedule/${groupId}/${index}/${time}/${schedule?.id || ''}`)}
                                                            color={schedule ? 'success' : undefined}
                                                            label={TimeMapper[time as keyof typeof TimeMapper]}
                                                            size="medium"
                                                            icon={!schedule ? <AddCircleIcon /> : undefined}
                                                            onDelete={schedule ? async (e) => {
                                                                e.stopPropagation();
                                                                setDeleteDialogOpened(true);
                                                                setDeleteCandidate(schedule?.id);
                                                            } : undefined}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{schedule?.discipline.name}</TableCell>
                                                    <TableCell>{schedule?.teacher.name} {schedule?.teacher.surname}</TableCell>
                                                    {/*@ts-ignore*/}
                                                    <TableCell>{ScheduleMapper[schedule?.scheduleType as keyof typeof ScheduleMapper]}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ))}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}

            <Dialog
                open={deleteDialogOpened}
                onClose={() => setDeleteDialogOpened(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete schedule slot
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete schedule slot?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={async () => {
                            if (deleteCandidate) {
                                setLoading(true);
                                setDeleteDialogOpened(false);
                                setLoading(true);
                                await deleteSchedule(deleteCandidate, groupId || '');
                                setLoading(false);
                            }
                        }}
                    >
                        Delete
                    </Button>
                    <Button variant="contained" color="success" onClick={() => setDeleteDialogOpened(false)} autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Box display="flex" gap={1}>
                <Button
                    onClick={() => navigate(`/admin/group/${groupId}`)}
                    variant="contained"
                    color="warning"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Back
                </Button>
            </Box>
        </>
    );
}

export default Schedule;