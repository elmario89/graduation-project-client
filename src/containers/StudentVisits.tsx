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
            <Typography sx={{ mb: 2 }} variant='h3'>{schedules[0].discipline.name}</Typography>
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