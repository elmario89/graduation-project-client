import * as React from "react";
import { FC, useEffect, useState } from "react";
import { useLocations } from "../providers/LocationsProvider";
import { CircularProgress, Divider, Grid } from "@mui/material";
import { Location as LocationModel } from "../types/location";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";

type LocationData = Omit<LocationModel, "id">;

const Location: FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const { getLocationById, createLocation, updateLocation } = useLocations();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getLocationById(id).then((location) => {
        if (location) {
          setLocation(location);
          location.coordinates.forEach((c, index) => update(index, c));
        }
        setLoading(false);
      });
    }
  }, [id]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LocationData>({
    defaultValues: {
      coordinates: [
        { lng: "", lat: "" },
        { lng: "", lat: "" },
        { lng: "", lat: "" },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray<
    LocationData,
    "coordinates"
  >({
    control,
    name: "coordinates",
  });

  const onSubmit: SubmitHandler<LocationData> = async (data) => {
    if (id) {
      await updateLocation({ id, ...data });
    } else {
      const location = await createLocation(data);

      if (location) {
        navigate(`/admin/location/${location.id}`);
      }
    }
  };

  if ((id && !location) || loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Location
      </Typography>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            justifyContent="flex-start"
            component="form"
            width={800}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              {...register("buildingNumber", { required: true })}
              margin="normal"
              error={!!errors.buildingNumber}
              type={"number"}
              required
              fullWidth
              label="Building number"
              name="buildingNumber"
              defaultValue={location?.buildingNumber || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register("auditory", { required: true })}
              margin="normal"
              error={!!errors.auditory}
              type={"number"}
              required
              fullWidth
              label="Auditory"
              name="auditory"
              defaultValue={location?.auditory || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register("floor", { required: true })}
              margin="normal"
              error={!!errors.floor}
              type={"number"}
              required
              fullWidth
              label="Floor"
              name="floor"
              defaultValue={location?.floor || ""}
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
              defaultValue={location?.address || ""}
              sx={{ mb: 2 }}
            />

            {fields.map((field, index) => (
              <>
                <Grid
                  container
                  alignItems={"center"}
                  spacing={3}
                  key={field.id}
                >
                  <Grid item xs={fields.length > 3 ? 5 : 6}>
                    <TextField
                      {...register(`coordinates.${index}.lng` as const, {
                        required: true,
                      })}
                      type="number"
                      fullWidth
                      margin="normal"
                      error={
                        errors.coordinates
                          ? !!errors.coordinates[index]?.lng
                          : false
                      }
                      required
                      label="Longitude"
                      defaultValue={location?.coordinates[index]?.lng || ""}
                    />
                  </Grid>

                  <Grid item xs={fields.length > 3 ? 5 : 6}>
                    <TextField
                      {...register(`coordinates.${index}.lat` as const, {
                        required: true,
                      })}
                      type="number"
                      error={
                        errors.coordinates
                          ? !!errors.coordinates[index]?.lat
                          : false
                      }
                      required
                      fullWidth
                      margin="normal"
                      label="Latitude"
                      defaultValue={location?.coordinates[index]?.lat || ""}
                    />
                  </Grid>
                  {fields.length > 3 && (
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => remove(index)}
                      >
                        Delete point
                      </Button>
                    </Grid>
                  )}
                </Grid>
                <Divider sx={{ my: 2 }} />
              </>
            ))}

            <Button
              variant="contained"
              color="success"
              onClick={() => append({ lng: "", lat: "" })}
            >
              Add point
            </Button>

            <Box display="flex" gap={1}>
              <Button
                disabled={!isDirty}
                type={"submit"}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {id ? "Update location" : "Create location"}
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
};

export default Location;
