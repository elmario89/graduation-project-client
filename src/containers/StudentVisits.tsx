import { FC, useEffect, useState } from 'react';
import {
    Box,
    CircularProgress,
    FormControlLabel,
    Grid,
    Switch,
    Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useSchedules } from "../providers/ScheduleProvider";
import { Schedule } from '../types/schedule';
import { eachDayOfInterval } from 'date-fns';
import Visit from '../components/Visit';
import { Visit as VisitModel } from '../types/visit';
import { useVisits } from '../providers/VisitsProvider';
import { PieChart } from '@mui/x-charts/PieChart';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { StorageService } from '../services/storage.service';
import GroupVisits from '../components/GroupVisits';
import { useStudents } from '../providers/StudentsProvider';
import { Student } from '../types/student';
import { useTeachers } from '../providers/TeachersProvider';

type StudentVisitsProps = {
    forTeacher?: boolean;
}

const StudentVisits: FC<StudentVisitsProps> = ({ forTeacher }) => {
    const storageService = new StorageService();
    const { getScheduleByGroupAndDiscipline } = useSchedules();
    const { getVisitByScheduleAndStudent, getVisitsBySchedule } = useVisits();
    const { getStudentById } = useStudents();
    const { setVisit, deleteVisit } = useTeachers();
    const [loading, setLoading] = useState<boolean>(false);
    const [dates, setDates] = useState<Date[]>([]);
    const [student, setStudent] = useState<Student | null>(null);
    const [filteredDates, setFilteredDates] = useState<Date[] | null>(null);
    const [visits, setVisits] = useState<VisitModel[]>([]);
    const [groupVisits, setGroupVisits] = useState<VisitModel[]>([]);
    const [filterBusyDays, setFilterBusyDats] = useState<boolean>(storageService.getItem('busyDays'));
    const [schedules, setSchedules] = useState<Schedule[] | undefined>([]);
    const { groupId, disciplineId, studentId } = useParams();

    const generateData = () => {
        if (groupId && disciplineId) {
            getScheduleByGroupAndDiscipline(groupId, disciplineId)
                .then((schedules) => {
                    if (schedules?.length) {
                        setDates(eachDayOfInterval({ start: schedules[0].group?.start || new Date(), end: schedules[0].group?.finish || new Date() }));
                        setSchedules(schedules);
                    }

                    return new Promise<Schedule[] | undefined>(resolve => resolve(schedules));
                })
                .then((schedules) => {
                    if (schedules?.length) {
                        return Promise.all([
                            getVisitByScheduleAndStudent(studentId || '', schedules.map(s => s.id)),
                            getVisitsBySchedule(schedules.map(s => s.id)),
                        ]);
                    }
                })
                .then((result) => {
                    if (result) {
                        setVisits(result[0] || []);
                        setGroupVisits(result[1] || []);
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        setLoading(true);
        generateData();
    }, [groupId]);

    useEffect(() => {
        if (studentId) {
            setLoading(true);
            getStudentById(studentId)
                .then((student) => {
                    if (student) {
                        setStudent(student);
                    }

                    setLoading(false);
                });
        }
    }, [studentId]);

    useEffect(() => {
        if (filterBusyDays) {
            const filtered = schedules?.map(s => Number(s.day) + 1);
            setFilteredDates(dates.filter(d => filtered?.includes(d.getDay())));
        } else {
            setFilteredDates(null);
        }
    }, [filterBusyDays, dates]);

    const countFact = (schedules: Schedule[]): number => {
        const sch = schedules?.map(s => Number(s.day) + 1);
        const filtered = dates.filter((d) => sch.includes(d.getDay()));
        return sch.reduce((acc, cur) => {
            const f = filtered.filter((d) => d.getDay() === cur);
            return acc + f.length;
        }, 0);
    }

    const countAbsents = (schedules: Schedule[]): number => {
        const sch = schedules?.map(s => Number(s.day) + 1);
        const filtered = dates.filter((d) => sch.includes(d.getDay())).filter(d => d < new Date());
        return sch.reduce((acc, cur) => {
            const f = filtered.filter((d) => d.getDay() === cur);
            return acc + f.length;
        }, 0) - visits.length;
    }

    const [value, setValue] = useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    if (loading || !schedules?.length || !dates || !visits || !groupId) {
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
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label="Schedule" value="1" />
                        <Tab label="Personal statistic" value="2" />
                        <Tab label="Group statistic" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Typography sx={{ mb: 4 }} variant='h3'>Discipline: {schedules[0].discipline.name} {student && `, Student: ${student.name} ${student.surname}`}</Typography>
                    <Box display={'flex'} flexDirection={'column'} gap={2} sx={{ mb: 4 }}>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={1}>
                            <div className="legend future" />
                            <span>Class will be in the future</span>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={1}>
                            <div className="legend visited" />
                            <span>You visited all classes by {schedules[0].discipline.name} that day</span>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={1}>
                            <div className="legend partial" />
                            <span>You visited at least one clase by {schedules[0].discipline.name} that day</span>
                        </Box>
                        <Box display={'flex'} alignItems={'center'} flexDirection={'row'} gap={1}>
                            <div className="legend absent" />
                            <span>You were absent</span>
                        </Box>
                    </Box>

                    <FormControlLabel control={
                        <Switch defaultChecked={storageService.getItem('busyDays')} onChange={() => {
                            setFilterBusyDats(prev => {
                                storageService.setItem('busyDays', !prev);
                                return !prev;
                            });

                        }} />} label="Hide empty days" sx={{ mb: 6 }}
                    />

                    <Grid container spacing={4} alignItems="stretch">
                        {(filteredDates && filteredDates !== null ? filteredDates : dates).map((date, index) => (
                            <Grid key={index} item xs={3}>
                                <Visit
                                    date={date}
                                    visits={visits}
                                    schedules={schedules.filter(schedule => Number(schedule.day) === date.getDay() - 1)}
                                    forTeacher={forTeacher}
                                    setVisit={forTeacher ? async (schedule: Schedule) => {
                                        if (studentId && schedule) {
                                            const { timeStart, id } = schedule;
                                            const [hours, minutes, seconds] = timeStart.split(':');
                                            const dateTime = date.setHours(Number(hours), Number(minutes), Number(seconds));
                                            await setVisit({ studentId, scheduleId: id, date: new Date(dateTime) });
                                            generateData();
                                        }
                                    } : undefined}
                                    deleteVisit={forTeacher ? async (visitId, schedule) => {
                                        await deleteVisit(visitId);
                                        generateData();
                                    } : undefined}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>
                <TabPanel value="2">
                    {countFact(schedules) && (
                        <>
                            <Typography sx={{ mb: 2 }} variant='h3'>Discipline: {schedules[0].discipline.name} {student && `, Student: ${student.name} ${student.surname}`}</Typography>
                            <Box sx={{ mt: 5 }} display={'flex'} flexDirection={'row'} gap={5}>
                                <Box>
                                    <Typography variant='h4' sx={{ mb: 4 }}>Visits plan</Typography>
                                    <PieChart
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: visits.length, label: 'Visited', color: 'rgb(102, 187, 106)' },
                                                    { id: 1, value: countAbsents(schedules), label: 'Absent', color: 'rgb(244, 67, 54)' },
                                                    { id: 2, value: countFact(schedules) - countAbsents(schedules) - visits.length, label: 'Future', color: 'rgba(0, 0, 0, 0.12)' },
                                                ],
                                                innerRadius: 30,
                                                cornerRadius: 5,
                                                outerRadius: 100,
                                                paddingAngle: 1,
                                                cx: 200,
                                                cy: 100,
                                            },
                                        ]}
                                        width={500}
                                        height={220}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant='h4' sx={{ mb: 4 }}>Visits fact</Typography>
                                    <PieChart
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: visits.length, label: 'Visited', color: 'rgb(102, 187, 106)' },
                                                    { id: 1, value: countAbsents(schedules), label: 'Absent', color: 'rgb(244, 67, 54)' },
                                                ],
                                                innerRadius: 30,
                                                cornerRadius: 5,
                                                outerRadius: 100,
                                                paddingAngle: 1,
                                                cx: 200,
                                                cy: 100,
                                            },
                                        ]}
                                        width={500}
                                        height={220}
                                    />
                                </Box>
                            </Box>
                        </>
                    )}
                </TabPanel>
                <TabPanel value="3">
                    <GroupVisits groupId={groupId} visits={groupVisits} visitPlan={countFact(schedules)} disciplineName={schedules[0].discipline.name} />
                </TabPanel>
            </TabContext>
        </Box>
    );
}

export default StudentVisits;