import { FC, useEffect, useState, useRef } from "react";
import { useAuditories } from "../providers/AuditoriesProvider";
import { Autocomplete, CircularProgress, Divider, Grid } from "@mui/material";
import { Auditory as AuditoryModel } from "../types/auditory";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import {
  SubmitHandler,
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";
import { YMaps, Map, Polygon } from "@pbe/react-yandex-maps";
import { useBuildings } from "../providers/BuildingProvider";
import { Building } from "../types/building";

type AuditoryData = Omit<AuditoryModel, "id">;

const Auditory: FC = () => {
  const [auditory, setAuditory] = useState<AuditoryData | null>(null);
  const { getAuditoryById, createAuditory, updateAuditory } = useAuditories();
  const { getAllBuildings, buildings } = useBuildings();
  const [loading, setLoading] = useState<boolean>(false);

  const YMref = useRef<ymaps.Map | undefined>(undefined);
  const PolyRef = useRef<ymaps.Map | undefined>(undefined);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAuditoryById(id).then(
        (auditory) => {
          if (auditory) {
            setAuditory(auditory);
            auditory.coordinates.forEach((c, index) => update(index, c));
          }
          setLoading(false);
        }
      );
    }
  }, [id]);

  useEffect(() => {
    getAllBuildings();
}, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<AuditoryData>({
    defaultValues: {
      coordinates: [
        { lng: "", lat: "" },
        { lng: "", lat: "" },
        { lng: "", lat: "" },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray<
    AuditoryData,
    "coordinates"
  >({
    control,
    name: "coordinates",
  });

  const onSubmit: SubmitHandler<AuditoryData> = async (data) => {
    if (id) {
      const auditory = await updateAuditory({ id, ...data });
      if (auditory) {
        setAuditory(auditory);
        reset({ ...auditory });
      }
    } else {
      const auditory = await createAuditory(data);

      if (auditory) {
        navigate(`/admin/auditory/${auditory.id}`);
      }
    }
  };

  const setCenter = () => {
    if (YMref.current && PolyRef.current) {
      // @ts-ignore
      const pixelBounds = PolyRef.current.geometry
        ?.getPixelGeometry()
        .getBounds();
      if (pixelBounds) {
        const pixelCenter = [
          pixelBounds[0][0] + (pixelBounds[1][0] - pixelBounds[0][0]) / 2,
          (pixelBounds[1][1] - pixelBounds[0][1]) / 2 + pixelBounds[0][1],
        ];
        // @ts-ignore
        const geoCenter = YMref.current.options.get("projection").fromGlobalPixels(pixelCenter, YMref.current.getZoom());
        YMref.current.setCenter(geoCenter);
      }
    }
  };

  useEffect(() => {
    if (YMref.current && PolyRef.current) {
      YMref.current.container.fitToViewport();
      YMref.current.setZoom(17);

      setCenter();
    }
  }, [auditory?.coordinates]);

  if ((id && !auditory) || loading || !buildings) {
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
        Аудитория
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
              {...register("number", { required: true })}
              margin="normal"
              error={!!errors.number}
              type={"number"}
              required
              fullWidth
              label="Номер аудитории"
              name="number"
              defaultValue={auditory?.number || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register("floor", { required: true })}
              margin="normal"
              error={!!errors.floor}
              type={"number"}
              required
              fullWidth
              label="Этаж"
              name="floor"
              defaultValue={auditory?.floor || ""}
              sx={{ mb: 2 }}
            />

            <Controller
              control={control}
              rules={{ required: true }}
              name="buildingId"
              defaultValue={auditory?.building ? auditory?.building.id : undefined}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  disablePortal
                  defaultValue={
                    auditory?.building
                      ? { label: auditory?.building.address, value: auditory?.building.id }
                      : null
                  }
                  onChange={(_, chosen) => onChange(chosen?.value)}
                  options={buildings.map((building: Building) => ({
                    label: building.address,
                    value: building.id,
                  }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Здание"
                      error={!!errors.buildingId}
                    />
                  )}
                  sx={{ mt: 2 }}
                />
              )}
            />

            {fields.map((field, index) => (
              <div key={field.id}>
                <Grid container alignItems={"center"} spacing={3}>
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
                      label="Долгота (Longitude)"
                      defaultValue={
                        auditory?.coordinates[index]
                          ? auditory?.coordinates[index]?.lng
                          : ""
                      }
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
                      label="Широта (Latitude)"
                      defaultValue={
                        auditory?.coordinates[index]
                          ? auditory?.coordinates[index]?.lat
                          : ""
                      }
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
                        Удалить
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
              Добавить точку
            </Button>

            {auditory && auditory?.coordinates?.length > 0 && (
              <YMaps>
                <Map
                  instanceRef={YMref}
                  width={500}
                  height={500}
                  apikey={process.env.REACT_APP_YM_API_KEY || ""}
                  defaultState={{
                    center: [
                      Number(auditory.coordinates[0].lng),
                      Number(auditory.coordinates[0].lat),
                    ],
                    zoom: 17,
                  }}
                  onLoad={setCenter}
                >
                  <Polygon
                    onLoad={setCenter}
                    instanceRef={PolyRef}
                    geometry={[auditory.coordinates.map((c) => [c.lng, c.lat])]}
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
                {id ? "Обновить аудиторию" : "Создать аудиторию"}
              </Button>
              <Button
                onClick={() => navigate(`/admin/auditories`)}
                variant="contained"
                color="warning"
                sx={{ mt: 3, mb: 2 }}
              >
                Назад
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Box>
    </>
  );
};

export default Auditory;
