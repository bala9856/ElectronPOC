import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  TextField,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Send, Refresh, PowerSettingsNew } from "@mui/icons-material";

function LuminometerScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const status = await window.electronAPI.checkLuminometerConnection();
      setIsConnected(status.connected);
      if (status.connected) {
        setDeviceData(status.deviceInfo);
      }
    } catch (err) {
      setError("Failed to check device connection");
    }
  };

  const connectDevice = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.connectLuminometer();
      setIsConnected(result.success);
      if (result.success) {
        setDeviceData(result.deviceInfo);
        setError("");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Connection failed");
    }
    setLoading(false);
  };

  const sendCommand = async () => {
    if (!command.trim()) return;

    setLoading(true);
    try {
      const result = await window.electronAPI.sendLuminometerCommand(command);
      setResponse(result.response);
      setError("");
    } catch (err) {
      setError("Failed to send command");
    }
    setLoading(false);
  };

  const readData = async () => {
    setLoading(true);
    try {
      const data = await window.electronAPI.readLuminometerData();
      setDeviceData(data);
      setError("");
    } catch (err) {
      setError("Failed to read data");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Luminometer Control
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Connection Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Status
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <PowerSettingsNew color={isConnected ? "success" : "error"} />
                <Typography>{isConnected ? "Connected" : "Disconnected"}</Typography>
                <Button variant="outlined" onClick={connectDevice} disabled={loading} size="small">
                  {isConnected ? "Reconnect" : "Connect"}
                </Button>
              </Box>

              {deviceData && (
                <Box>
                  <Typography variant="body2">Model: {deviceData.model || "Unknown"}</Typography>
                  <Typography variant="body2">Serial: {deviceData.serial || "Unknown"}</Typography>
                  <Typography variant="body2">
                    Last Reading: {deviceData.lastReading || "No data"}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Data Display */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Current Data</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={readData}
                  disabled={!isConnected || loading}
                  size="small"
                >
                  Refresh
                </Button>
              </Box>

              {deviceData && (
                <Box>
                  <Typography variant="body1">
                    Luminescence: {deviceData.luminescence || "N/A"} RLU
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Temperature: {deviceData.temperature || "N/A"}°C
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Timestamp: {deviceData.timestamp || "N/A"}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Command Interface */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Send Command
            </Typography>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                label="Command"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                disabled={!isConnected}
                placeholder="Enter luminometer command..."
              />
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={sendCommand}
                disabled={!isConnected || loading || !command.trim()}
              >
                Send
              </Button>
            </Box>

            {response && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Response:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
                  <Typography variant="body2" component="pre">
                    {response}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}

export default LuminometerScreen;
