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
import { useAuth } from '../providers/AuthProvider';
import { useVisits } from '../providers/VisitsProvider';
import { PieChart } from '@mui/x-charts/PieChart';

const StudentVisits: FC = () => {
    const { getScheduleByGroupAndDiscipline } = useSchedules();
    const { user } = useAuth();
    const { getVisitByScheduleAndStudent } = useVisits();
    const [loading, setLoading] = useState<boolean>(false);
    const [dates, setDates] = useState<Date[]>([]);
    const [filteredDates, setFilteredDates] = useState<Date[] | null>(null);
    const [visits, setVisits] = useState<VisitModel[]>([]);
    const [filterBusyDays, setFilterBusyDats] = useState<boolean>(false);
    const [schedules, setSchedules] = useState<Schedule[] | undefined>([]);
    const { groupId, disciplineId } = useParams();

    useEffect(() => {
        if (groupId && disciplineId) {
            setLoading(true);
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
                        return getVisitByScheduleAndStudent(user?.id || '', schedules[0].id);
                    }
                })
                .then((visits) => {
                    setVisits(visits || []);
                    setLoading(false);
                })
        }
    }, [groupId]);

    useEffect(() => {
        if (filterBusyDays) {
            const filtered = schedules?.map(s => Number(s.day) + 1);
            setFilteredDates(dates.filter(d => filtered?.includes(d.getDay())))
        } else {
            setFilteredDates(null);
        }
    }, [filterBusyDays]);

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

    if (loading || !schedules?.length || !dates || !visits) {
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
            {countFact(schedules) && (
                <>
                    <Typography sx={{ mb: 2 }} variant='h3'>Discipline name: {schedules[0].discipline.name}</Typography>
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
            <Typography sx={{ mb: 2 }} variant='h3'>Discipline name: {schedules[0].discipline.name}</Typography>
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

            <FormControlLabel control={<Switch onChange={() => setFilterBusyDats(prev => !prev)} />} label="Show only busy days" sx={{ mb: 6 }} />

            <Grid container spacing={4} alignItems="stretch">
                {(filteredDates && filteredDates !== null ? filteredDates : dates).map((date, index) => (
                    <Grid key={index} item xs={3}>
                        <Visit
                            date={date}
                            visits={visits}
                            schedules={schedules.filter(schedule => Number(schedule.day) === date.getDay() - 1)}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default StudentVisits;