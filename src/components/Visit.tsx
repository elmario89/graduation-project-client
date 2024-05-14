import { FC } from 'react';
import { Schedule } from '../types/schedule';
import '../styles/card.css';
import { Box, Button, Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Visit } from '../types/visit';
import { ScheduleMapper } from '../containers/mappers/schedule.mapper';

type VisitType = 'visited' | 'absent' | 'future' | 'partial' | 'unavailable';

type VisitCardProps = {
    date: Date;
    schedules: Schedule[];
    visits: Visit[];
    forTeacher?: boolean;
    setVisit?: (time: string) => void;
    deleteVisit?: (visitId: string) => void;
}

const VisitCard: FC<VisitCardProps> = ({ date, schedules, visits, forTeacher, setVisit, deleteVisit }) => {
    const getVisitType = (date: Date): VisitType | null => {
        const filtered = visits.filter(v => dayjs(v.date).format('DD-MM-YYYY') === dayjs(date).format('DD-MM-YYYY'));
        if (visits.some(v => dayjs(v.date).format('DD-MM-YYYY') === dayjs(date).format('DD-MM-YYYY'))) {
            if (schedules.length !== filtered.length) {
                return 'partial';
            }
            return 'visited';
        }

        if (date < new Date() && schedules.length > 0 && !filtered.some(v => v.date === date)) {
            return 'absent';
        }

        if (date > new Date() && schedules.length > 0) {
            return 'future';
        }

        return 'unavailable';
    }

    return (
        <div className={`card ${getVisitType(date)}`}>
            <Typography variant='subtitle2'>{dayjs(date).locale('en').format('ddd, MMM D, YYYY ')}</Typography>
            <Divider sx={{ mb: 2, mt: 1 }} />
            {schedules.length > 0 ? (
                <>
                    <Box display={'flex'} flexDirection={'row'} gap={5}>
                        <Typography variant='caption' color={'rgba(0, 0, 0, 0.6)'}>Start</Typography>
                        <Typography variant='caption' color={'rgba(0, 0, 0, 0.6)'}>Finish</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'}>
                        {schedules.map((schedule) => {
                            const start = schedule.timeStart.split(':').join('');
                            const finish = schedule.timeFinish.split(':').join('');
                            const filteredByDay = visits.filter(v => {
                                return dayjs(v.date).format('DD-MM-YYYY') === dayjs(date).format('DD-MM-YYYY');
                            });
                            const filteredByTime = filteredByDay.filter(f => {
                                return dayjs(f.date).format('HHmmss') >= start && dayjs(f.date).format('HHmmss') < finish
                            });
                            return (
                                <div key={schedule.id}>
                                    <Box display={'flex'} flexDirection={'row'} gap={1} alignItems={'center'} justifyContent={forTeacher ? 'space-between' : 'flex-start'}>
                                        <Typography variant='h6'>
                                            {schedule.timeStart.slice(0, 5)} - {schedule.timeFinish.slice(0, 5)}
                                        </Typography>
                                        {!forTeacher && (getVisitType(date) === 'partial' || getVisitType(date) === 'visited' || getVisitType(date) === 'absent') && (
                                            <Typography fontWeight={'bold'} variant='caption' color={filteredByTime.length ? "rgb(102, 187, 106)" : "rgb(244, 67, 54)"}>
                                                {filteredByTime.length ? '(Visited)' : '(Absent)'}
                                            </Typography>
                                        )}
                                        {forTeacher && (getVisitType(date) === 'partial' || getVisitType(date) === 'visited' || getVisitType(date) === 'absent') && (
                                            <>
                                                {filteredByTime.length ? (
                                                    <Button onClick={() => {
                                                        if (deleteVisit) {
                                                            return deleteVisit(filteredByTime[0].id);
                                                        }
                                                    }} size='small' color='error' variant='contained'>Mark out</Button>
                                                ) : (
                                                    <Button onClick={() => {
                                                        if (setVisit) {
                                                            return setVisit(schedule.timeStart)
                                                        }
                                                    }} size='small' color='success' variant='contained'>Mark in</Button>
                                                )}
                                            </>
                                        )}
                                    </Box>
                                    <Box display={'flex'} flexDirection={'row'} gap={5} alignItems={'center'} justifyContent={'space-between'}>
                                        <div>
                                            <Typography variant='caption' color={'rgba(0, 0, 0, 0.6)'}>Teacher</Typography>
                                            <Typography variant='subtitle2'>{schedule.teacher.name} {schedule.teacher.surname}</Typography>
                                        </div>
                                        <div>
                                            <Typography variant='caption' color={'rgba(0, 0, 0, 0.6)'}>Class type</Typography>
                                            <Typography variant='subtitle2'>
                                                {/* @ts-ignore */}
                                                {ScheduleMapper[schedule?.scheduleType as keyof typeof ScheduleMapper]}
                                            </Typography>
                                        </div>
                                    </Box>
                                    <Divider sx={{ mb: 2, mt: 1 }} />
                                </div>
                            );
                        })}
                    </Box>
                </>
            ) : (
                <Typography variant='subtitle2'>There is no class for this discipline</Typography>
            )}
        </div>
    );
};

export default VisitCard;