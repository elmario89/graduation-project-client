import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {FC, useEffect, useState} from "react";
import {useDisciplines} from "../providers/DisciplinesProvider";
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
import {Discipline} from "../types/discipline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {Teacher} from "../types/teacher";

function createData(
    id: string,
    name: string,
    teachers: Teacher[],
) {
    return { id, name, teachers };
}

const Disciplines: FC = () => {
    const [rows, setRow] = useState<any | null>(null);
    const { disciplines , getAllDisciplines, deleteDiscipline } = useDisciplines();
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteDialogOpened, setDeleteDialogOpened] =
        React.useState<boolean>(false);
    const [deleteCandidate, setDeleteCandidate] =
        React.useState<string | null>(null);

    const navigate = useNavigate();

    const getRows = (data: Discipline[]) => data?.map((discipline) => {
        const { id,name, teachers } = discipline;
        return createData(id, name, teachers || []);
    })

    useEffect( () => {
        getAllDisciplines()
            .then(() => setLoading(false));
    }, []);

    useEffect( () => {
        if (disciplines) {
            setRow(getRows(disciplines));
        }
    }, [disciplines]);

    if (loading || !disciplines || !rows) {
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
                Disciplines
            </Typography>
            <Box sx={{py: 2}}>
                <Button
                    variant={'contained'}
                    color={'success'}
                    onClick={() => navigate('/admin/discipline')}
                >
                    Add discipline
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    <Alert severity="warning">No disciplines, try to create one</Alert>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Discipline name</TableCell>
                                    <TableCell>Teachers</TableCell>
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row: { id: string; name: string, teachers: Teacher[] }) => (
                                    <TableRow
                                        style={{ cursor: 'pointer' }}
                                        hover={true}
                                        onClick={() => navigate(`/admin/discipline/${row.id}`)}
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                        <TableCell>
                                            {
                                                row.teachers.map((t) =>
                                                    <Link component={RouterLink} to={`/admin/teacher/${t.id}`}>
                                                        {t.name} {t.surname}<br/>
                                                    </Link>)
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                type={'submit'}
                                                variant="contained"
                                                color="warning"
                                                onClick={() => navigate(`/admin/discipline/${row.id}`)}
                                            >
                                                Update discipline
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
                                                Delete discipline
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
                    Delete discipline
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete discipline?
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
                                await deleteDiscipline(deleteCandidate);
                                await getAllDisciplines();
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

export default Disciplines;