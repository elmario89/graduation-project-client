import * as React from 'react';
import {FC, useEffect, useState} from 'react';
import {Card, CardContent, Chip, CircularProgress} from "@mui/material";
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

const INITIAL_TIME = [800, 940, 1130];

const Schedule: FC = () => {
    const { getSchedulesByGroupId, schedules } = useSchedules();
    const [loading, setLoading] = useState<boolean>(false);
    const [config, setConfig] =
        useState<Record<number, ScheduleModel | null>[]| null>(null);

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
                <Card key={index} sx={{ minWidth: 275, maxWidth: 600, my: 4 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {index}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box>
                            <Typography gutterBottom variant="body2">
                                Select time
                            </Typography>
                            <Box style={{ display: 'flex', flexDirection: 'row',  gap: '8px', flexWrap: 'wrap' }}>
                                {Object.entries(day).map(([time, schedule]) => (
                                    <Chip
                                        key={`${index}-${time}`}
                                        onClick={() => navigate(`/admin/schedule/${groupId}/${index}/${time}/${schedule?.id || ''}`)}
                                        color={schedule ? 'success' : undefined}
                                        label={time.toString()}
                                        size="medium"
                                        icon={!schedule ? <AddCircleIcon /> : undefined}
                                        onDelete={schedule ? () => console.log('delete schedule slot!') : undefined}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}

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