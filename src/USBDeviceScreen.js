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
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Divider,
} from "@mui/material";
import { Usb, Send, Refresh, Cable, DataUsage } from "@mui/icons-material";

function USBDeviceScreen() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transferData, setTransferData] = useState("");
  const [receivedData, setReceivedData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    scanDevices();
  }, []);

  const scanDevices = async () => {
    setLoading(true);
    try {
      const deviceList = await window.electronAPI.scanUSBDevices();
      setDevices(deviceList);
      setError("");
    } catch (err) {
      setError("Failed to scan USB devices");
    }
    setLoading(false);
  };

  const connectDevice = async (device) => {
    setLoading(true);
    try {
      const result = await window.electronAPI.connectUSBDevice(device.path);
      if (result.success) {
        setSelectedDevice(device);
        setIsConnected(true);
        setError("");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to connect to device");
    }
    setLoading(false);
  };

  const disconnectDevice = async () => {
    try {
      await window.electronAPI.disconnectUSBDevice();
      setSelectedDevice(null);
      setIsConnected(false);
      setReceivedData("");
    } catch (err) {
      setError("Failed to disconnect device");
    }
  };

  const sendData = async () => {
    if (!transferData.trim()) return;

    setLoading(true);
    try {
      const result = await window.electronAPI.sendUSBData(transferData);
      if (result.success) {
        setReceivedData((prev) => prev + `Sent: ${transferData}\n`);
        setTransferData("");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to send data");
    }
    setLoading(false);
  };

  const readData = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.readUSBData();
      if (result.success && result.data) {
        setReceivedData((prev) => prev + `Received: ${result.data}\n`);
      }
    } catch (err) {
      setError("Failed to read data");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        USB Device Manager
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Device List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Available USB Devices</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={scanDevices}
                  disabled={loading}
                  size="small"
                >
                  Scan
                </Button>
              </Box>

              <List>
                {devices.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No USB devices found" />
                  </ListItem>
                ) : (
                  devices.map((device, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        onClick={() => connectDevice(device)}
                        disabled={loading || isConnected}
                        selected={selectedDevice?.path === device.path}
                      >
                        <Box display="flex" alignItems="center" width="100%">
                          <Usb sx={{ mr: 2 }} />
                          <Box flexGrow={1}>
                            <Typography variant="body1">
                              {device.manufacturer || "Unknown"} - {device.productId}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {device.path}
                            </Typography>
                          </Box>
                          {selectedDevice?.path === device.path && isConnected && (
                            <Chip label="Connected" color="success" size="small" />
                          )}
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  ))
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Connection Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Connection Status
              </Typography>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Cable color={isConnected ? "success" : "error"} />
                <Typography>{isConnected ? "Connected" : "Disconnected"}</Typography>
                {isConnected && (
                  <Button variant="outlined" onClick={disconnectDevice} size="small" color="error">
                    Disconnect
                  </Button>
                )}
              </Box>

              {selectedDevice && (
                <Box>
                  <Typography variant="body2">
                    Device: {selectedDevice.manufacturer || "Unknown"}
                  </Typography>
                  <Typography variant="body2">Product ID: {selectedDevice.productId}</Typography>
                  <Typography variant="body2">Vendor ID: {selectedDevice.vendorId}</Typography>
                  <Typography variant="body2">Path: {selectedDevice.path}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Data Transfer */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data Transfer
            </Typography>

            <Box display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                label="Data to Send"
                value={transferData}
                onChange={(e) => setTransferData(e.target.value)}
                disabled={!isConnected}
                placeholder="Enter data to send to USB device..."
              />
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={sendData}
                disabled={!isConnected || loading || !transferData.trim()}
              >
                Send
              </Button>
              <Button
                variant="outlined"
                startIcon={<DataUsage />}
                onClick={readData}
                disabled={!isConnected || loading}
              >
                Read
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Communication Log:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "grey.100", minHeight: 200 }}>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                {receivedData || "No data received yet..."}
              </Typography>
            </Paper>
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

export default USBDeviceScreen;
