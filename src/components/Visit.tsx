import { FC } from 'react';
import { Schedule } from '../types/schedule';
import './visit.css';
import { Box, Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Visit } from '../types/visit';

type VisitType = 'visited' | 'absent' | 'future' | 'partial';

type VisitCardProps = {
    date: Date;
    schedules: Schedule[];
    visits: Visit[];
}

const VisitCard: FC<VisitCardProps> = ({ date, schedules, visits }) => {
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

        return null;
    }

    return (
        <div className={`visit ${getVisitType(date)}`}>
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
                                return dayjs(f.date).format('HHmmss') > start && dayjs(f.date).format('HHmmss') < finish
                            })
                            return (
                                <>
                                    <Box key={schedule.id} display={'flex'} flexDirection={'row'} gap={1} alignItems={'center'}>

                                        <Typography variant='h6'>
                                            {schedule.timeStart.slice(0, 5)} - {schedule.timeFinish.slice(0, 5)}
                                        </Typography>
                                        <Typography fontWeight={'bold'} variant='caption' color={filteredByTime.length ? "rgb(102, 187, 106)" : "rgb(244, 67, 54)"}>
                                            {getVisitType(date) === 'partial' || getVisitType(date) === 'visited'
                                                ? filteredByTime.length ? '(Visited)'
                                                    : '(Absent)' : null}
                                        </Typography>

                                    </Box>
                                    <Typography variant='caption' color={'rgba(0, 0, 0, 0.6)'}>Teacher</Typography>
                                    <Typography variant='subtitle2'>{schedule.teacher.name} {schedule.teacher.surname}</Typography>
                                    <Divider sx={{ mb: 2, mt: 1 }} />
                                </>
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