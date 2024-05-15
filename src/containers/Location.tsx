import { FC, useEffect, useState, useRef } from "react";
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
import { YMaps, Map, Polygon } from "@pbe/react-yandex-maps";

type LocationData = Omit<LocationModel, "id">;

const Location: FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const { getLocationById, createLocation, updateLocation } = useLocations();
  const [loading, setLoading] = useState<boolean>(false);

  const YMref = useRef<ymaps.Map | undefined>(undefined);
  const PolyRef = useRef<ymaps.Map | undefined>(undefined);

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
    reset,
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
      const location = await updateLocation({ id, ...data });
      if (location) {
        setLocation(location);
        reset({ ...location });
      }
    } else {
      const location = await createLocation(data);

      if (location) {
        navigate(`/admin/location/${location.id}`);
      }
    }
  };

  const setCenter = () => {
    if (YMref.current && PolyRef.current) {
      // @ts-ignore
      const pixelBounds = PolyRef.current.geometry?.getPixelGeometry().getBounds();
      if (pixelBounds) {
        const pixelCenter = [pixelBounds[0][0] + (pixelBounds[1][0] - pixelBounds[0][0]) / 2, (pixelBounds[1][1] - pixelBounds[0][1]) / 2 + pixelBounds[0][1]];
        // @ts-ignore
        const geoCenter = YMref.current.options.get('projection').fromGlobalPixels(pixelCenter, YMref.current.getZoom());
        YMref.current.setCenter(geoCenter);
      }
    }
  }

  useEffect(() => {
    if (YMref.current && PolyRef.current) {
      YMref.current.container.fitToViewport();
      YMref.current.setZoom(17);

      setCenter();
    }
  }, [location?.coordinates]);

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
              <div key={field.id}>
                <Grid
                  container
                  alignItems={"center"}
                  spacing={3}
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
                      defaultValue={location?.coordinates[index] ? location?.coordinates[index]?.lng : ""}
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
                      defaultValue={location?.coordinates[index] ? location?.coordinates[index]?.lat : ""}
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
              </div>
            ))}

            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={() => append({ lng: "", lat: "" })}
              sx={{ mb: 2 }}
            >
              Add point
            </Button>

            {location && location?.coordinates?.length > 0 && (
              <YMaps>
                <Map
                  instanceRef={YMref}
                  width={500}
                  height={500}
                  apikey={process.env.REACT_APP_YM_API_KEY || ''}
                  defaultState={{
                    center: [Number(location.coordinates[0].lng), Number(location.coordinates[0].lat)],
                    zoom: 17
                  }}
                  onLoad={setCenter}
                >
                  <Polygon
                  onLoad={setCenter}
                    instanceRef={PolyRef}
                    geometry={[location.coordinates.map((c) => [c.lng, c.lat])]}
                    options={{
                      fillColor: "#1976d2",
                      strokeColor: "#0000FF",
                      opacity: 0.4,
                      strokeWidth: 2,
                      strokeStyle: "solid",
                    }}
                  />
                </Map>
              </YMaps>
            )}

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
