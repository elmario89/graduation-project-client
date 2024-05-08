import { FC } from 'react';
import {
    CircularProgress,
} from "@mui/material";
import {redirect} from "react-router-dom";
import { useAuth } from '../providers/AuthProvider';

const StudentSchedule: FC = () => {
    const { user } = useAuth();

    debugger;
    if (user && user.groupId) {
        redirect(`/student/schedule/${user?.groupId}`);
        return null;
    }

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

export default StudentSchedule;