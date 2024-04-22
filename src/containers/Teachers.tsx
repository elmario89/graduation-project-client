import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {FC, useEffect, useState} from "react";
import {useTeachers} from "../providers/TeachersProvider";
import {
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Link,
    Stack
} from "@mui/material";
import {Teacher} from "../types/teacher";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useNavigate, Link as RouterLink} from "react-router-dom";
import {Discipline} from "../types/discipline";

function createData(
    id: string,
    name: string,
    surname: string,
    disciplines: Discipline[],
    login: string,
) {
    return { id, name, surname, disciplines, login };
}

const Teachers: FC = () => {
    const [rows, setRow] = useState<any | null>(null);
    const { teachers , getAllTeachers, deleteTeacher } = useTeachers();
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteDialogOpened, setDeleteDialogOpened] =
        React.useState<boolean>(false);
    const [deleteCandidate, setDeleteCandidate] =
        React.useState<string | null>(null);

    const navigate = useNavigate();

    const getRows = (data: Teacher[]) => data?.map((teacher) => {
        const { id, name, disciplines, surname, login } = teacher;
        return createData(id, name, surname, disciplines || [], login);
    })

    useEffect( () => {
        getAllTeachers()
            .then(() => setLoading(false));
    }, []);

    useEffect( () => {
        if (teachers) {
            setRow(getRows(teachers));
        }
    }, [teachers]);

    if (loading || !teachers || !rows) {
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
        );
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Teachers
            </Typography>
            <Box sx={{py: 2}}>
                <Button
                    variant={'contained'}
                    color={'success'}
                    onClick={() => navigate('/admin/teacher')}
                >
                    Add teacher
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    <Alert severity="warning">No teachers, try to create one</Alert>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Surname</TableCell>
                                    <TableCell>Disciplines</TableCell>
                                    <TableCell>Login</TableCell>
                                    <TableCell align="right"></TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row: { id: string; name: string; surname: string; disciplines: Discipline[]; login: string }) => (
                                    <TableRow
                                        style={{ cursor: 'pointer' }}
                                        hover={true}
                                        onClick={() => navigate(`/admin/teacher/${row.id}`)}
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                        <TableCell component="th" scope="row">{row.surname}</TableCell>
                                        <TableCell>
                                            {
                                                row.disciplines.map((d) =>
                                                    <Link
                                                        style={{ alignSelf: 'flex-start'}}
                                                        onClick={e => e.stopPropagation()}
                                                        key={d.id}
                                                        component={RouterLink}
                                                        to={`/admin/discipline/${d.id}`}
                                                    >
                                                        {d.name}<br />
                                                    </Link>)
                                            }
                                        </TableCell>
                                        <TableCell>{row.login}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                type={'submit'}
                                                variant="contained"
                                                color="warning"
                                                onClick={() => navigate(`/admin/teacher/${row.id}`)}
                                            >
                                                Update teacher
                                            </Button>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                type={'submit'}
                                                variant="contained"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteDialogOpened(true);
                                                    setDeleteCandidate(row.id);
                                                }}
                                            >
                                                Delete teacher
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </>
                    )}
                </Table>
            </TableContainer>
            <Dialog
                open={deleteDialogOpened}
                onClose={() => setDeleteDialogOpened(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete teacher
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete teacher?
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
                                await deleteTeacher(deleteCandidate);
                                await getAllTeachers();
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
        </>
    );
}

export default Teachers;