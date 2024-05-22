import { FC, useEffect, useState } from "react";
import { useBuildings } from "../providers/BuildingProvider";
import { CircularProgress } from "@mui/material";
import { Building as BuildingModel } from "../types/building";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";

type BuildingData = Omit<BuildingModel, "id">;

const Building: FC = () => {
  const [building, setBuilding] = useState<BuildingData | null>(null);
  const { getBuildingById, createBuilding, updateBuilding } = useBuildings();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getBuildingById(id).then((building) => {
        if (building) {
          setBuilding(building);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<BuildingData>();

  const onSubmit: SubmitHandler<BuildingData> = async (data) => {
    if (id) {
      const building = await updateBuilding({ id, ...data });
      if (building) {
        setBuilding(building);
        reset({ ...building });
      }
    } else {
      const building = await createBuilding(data);

      if (building) {
        navigate(`/admin/building/${building.id}`);
      }
    }
  };

  if ((id && !building) || loading) {
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
        Здание
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
              label="Номер здания"
              name="number"
              defaultValue={building?.number || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register("address", { required: true })}
              margin="normal"
              error={!!errors.address}
              required
              fullWidth
              label="Адресс"
              name="address"
              defaultValue={building?.address || ""}
              sx={{ mb: 2 }}
            />

            <Box display="flex" gap={1}>
              <Button
                disabled={!isDirty}
                type={"submit"}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {id ? "Обновить здание" : "Добавить здание"}
              </Button>
              <Button
                onClick={() => navigate(`/admin/buildings`)}
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

export default Building;
