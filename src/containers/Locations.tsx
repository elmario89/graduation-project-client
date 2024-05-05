import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {FC, useEffect, useState} from "react";
import {useLocations} from "../providers/LocationsProvider";
import {
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack
} from "@mui/material";
import {Location} from "../types/location";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

function createData(
    id: string,
    buildingNumber: number,
    auditory: number,
    floor: number,
    address: string,
) {
    return { id, buildingNumber, auditory, floor, address };
}

const Locations: FC = () => {
    const [rows, setRow] = useState<any | null>(null);
    const { locations , getAllLocations, deleteLocation } = useLocations();
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteDialogOpened, setDeleteDialogOpened] =
        React.useState<boolean>(false);
    const [deleteCandidate, setDeleteCandidate] =
        React.useState<string | null>(null);

    const navigate = useNavigate();

    const getRows = (data: Location[]) => data?.map((location) => {
        const { id,buildingNumber, auditory, floor, address } = location;
        return createData(id, buildingNumber, auditory, floor, address);
    })

    useEffect( () => {
        getAllLocations()
            .then(() => setLoading(false));
    }, []);

    useEffect( () => {
        if (locations) {
            setRow(getRows(locations));
        }
    }, [locations]);

    if (loading || !locations || !rows) {
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
                Locations
            </Typography>
            <Box sx={{py: 2}}>
                <Button
                    variant={'contained'}
                    color={'success'}
                    onClick={() => navigate('/admin/location')}
                >
                    Add location
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Stack sx={{ width: '100%' }} spacing={2}>
                                    <Alert severity="warning">No locations, try to create one</Alert>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Building number </TableCell>
                                    <TableCell>Auditory</TableCell>
                                    <TableCell>Floor</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row: { id: string, buildingNumber: number, auditory: number, floor: number, address: string }) => (
                                    <TableRow
                                        style={{ cursor: 'pointer' }}
                                        hover={true}
                                        onClick={() => navigate(`/admin/location/${row.id}`)}
                                        key={row.id || row.address}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{row.buildingNumber}</TableCell>
                                        <TableCell component="th" scope="row">{row.auditory}</TableCell>
                                        <TableCell component="th" scope="row">{row.floor}</TableCell>
                                        <TableCell component="th" scope="row">{row.address}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                type={'submit'}
                                                variant="contained"
                                                color="warning"
                                                onClick={() => navigate(`/admin/location/${row.id}`)}
                                            >
                                                Update location
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
                                                Delete location
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
                    Delete location
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete location?
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
                                await deleteLocation(deleteCandidate);
                                await getAllLocations();
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

export default Locations;