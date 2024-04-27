import * as React from 'react';
import {FC, useEffect, useState} from "react";
import {useLocations} from "../providers/LocationsProvider";
import {CircularProgress} from "@mui/material";
import {Location as LocationModel} from "../types/location";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {SubmitHandler, useForm} from "react-hook-form";
import {LocalizationProvider} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import {useNavigate, useParams} from "react-router-dom";
import {useFaculties} from "../providers/FacultiesProvider";

type LocationData = Omit<LocationModel, 'id'>;

type FormValues = {
    buildingNumber: number,
    auditory: number,
    floor: number,
    address: string,
    coordinates: string[],
}

const Location: FC = () => {
    const [location, setLocation] =
        useState<FormValues | null>(null);
    const { getLocationById, createLocation, updateLocation } = useLocations();
    const { getAllFaculties, faculties } = useFaculties();
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect( () => {
        if (id) {
            setLoading(true);
            getLocationById(id)
                .then((location) => {
                    if (location) {
                        setLocation(location);
                    }
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect( () => {
        getAllFaculties();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<LocationData>()

    const onSubmit: SubmitHandler<LocationData> = async (data) => {
        if (id) {
            await updateLocation({ id, ...data });
        } else {
            const location = await createLocation(data);

            if (location) {
                navigate(`/admin/location/${location.id}`)
            }
        }
    };

    if ((id && !location) || loading || !faculties)  {
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
                Location
            </Typography>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box justifyContent="flex-start" component="form" width={600} onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <TextField
                            {...register("buildingNumber", { required: true })}
                            margin="normal"
                            error={!!errors.buildingNumber}
                            type={'number'}
                            required
                            fullWidth
                            label="Building number"
                            name="buildingNumber"
                            autoFocus
                            defaultValue={location?.buildingNumber || ''}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register("auditory", { required: true })}
                            margin="normal"
                            error={!!errors.auditory}
                            type={'number'}
                            required
                            fullWidth
                            label="Auditory"
                            name="auditory"
                            autoFocus
                            defaultValue={location?.auditory || ''}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register("floor", { required: true })}
                            margin="normal"
                            error={!!errors.floor}
                            type={'number'}
                            required
                            fullWidth
                            label="Floor"
                            name="floor"
                            autoFocus
                            defaultValue={location?.floor || ''}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register("address", { required: true })}
                            margin="normal"
                            error={!!errors.address}
                            required
                            fullWidth
                            label="Address"
                            name="address"
                            autoFocus
                            defaultValue={location?.address || ''}
                            sx={{ mb: 2 }}
                        />

                        <Box display="flex" gap={1}>
                            <Button
                                disabled={!isDirty}
                                type={'submit'}
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {id ? 'Update location' : 'Create location'}
                            </Button>
                            <Button
                                onClick={() => navigate(`/admin/locations`)}
                                variant="contained"
                                color="warning"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Back
                            </Button>
                        </Box>
                    </Box>
                </LocalizationProvider>
            </Box>
        </>
    );
}

export default Location;