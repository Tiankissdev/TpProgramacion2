import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: "",
  });

  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "30d38b26954359266708f92e1317dac0"; //Clave api / si se trata de un proyecto para publicar deberiamos esconder esto

  const mayusculas = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: "",
    });

    const consulta = new URLSearchParams({
      q: city.trim(),
      units: "metric",
      appid: API_KEY,
      lang: "es",
    }).toString();

    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };

      const response = await fetch(`${API_URL}?${consulta}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError({ error: true, message: "Ciudad No Encontrada" });
        } else {
          setError({
            error: true,
            message: "Error al obtener datos climáticos de la ciudad",
          });
        }
        return;
      }

      const data = await response.json();
      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        condition: data.weather[0].main,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        conditionText: mayusculas(data.weather[0].description),
      });
    } catch (error) {
      console.log(error);
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        App Clima
      </Typography>

      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="larger"
          required
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Buscando Ciudad..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="h5">
            {weather.city}, {weather.country}
          </Typography>
          <Typography variant="h6">{weather.temp} °C</Typography>
          <Typography variant="subtitle1">{weather.conditionText}</Typography>
          <img src={weather.icon} alt={weather.conditionText} />
        </Box>
      )}

      <Typography textAlign="center" sx={{ mt: 2, fontSize: "11px" }}>
        Powered by:{" "}
        <a href="https://openweathermap.org" title="Weather API">
          OpenWeather.org
        </a>
      </Typography>
    </Container>
  );
}
