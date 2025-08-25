import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Box, Tabs, Tab,
  Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel,
  Chip, OutlinedInput, RadioGroup, Radio, FormLabel, Avatar
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { Add, Edit, Delete, People, Science, Usb } from '@mui/icons-material';
import LuminometerScreen from './LuminometerScreen';
import USBDeviceScreen from './USBDeviceScreen';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', email: '', age: '', active: true, category: '', 
    skills: [], avatar: '', gender: '', birthdate: '' 
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userData = await window.electronAPI.getUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const userData = {
        ...formData,
        skills: formData.skills.join(','),
        birthdate: formData.birthdate || null
      };
      
      if (editUser) {
        await window.electronAPI.updateUser({ ...userData, id: editUser.id });
      } else {
        await window.electronAPI.createUser(userData);
      }
      loadUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await window.electronAPI.deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({ 
      name: user.name, email: user.email, age: user.age,
      active: user.active, category: user.category || '',
      skills: user.skills ? user.skills.split(',') : [],
      avatar: user.avatar || '', gender: user.gender || '',
      birthdate: user.birthdate ? user.birthdate.split('T')[0] : ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
    setFormData({ 
      name: '', email: '', age: '', active: true, category: '', 
      skills: [], avatar: '', gender: '', birthdate: '' 
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Luminometer AQ
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab icon={<People />} label="User Management" />
          <Tab icon={<Science />} label="Luminometer" />
          <Tab icon={<Usb />} label="USB Devices" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h2">
              User Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
            >
              Add User
            </Button>
          </Box>

          <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Birthdate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {user.avatar && <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />}
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.category}</TableCell>
                <TableCell>
                  {user.skills && user.skills.split(',').map(skill => 
                    <Chip key={skill} label={skill} size="small" sx={{ mr: 0.5 }} />
                  )}
                </TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.birthdate || ''}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
          </TableContainer>

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Age"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
              }
              label="Active"
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Guest">Guest</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Skills</InputLabel>
              <Select
                multiple
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                input={<OutlinedInput label="Skills" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="JavaScript">JavaScript</MenuItem>
                <MenuItem value="Python">Python</MenuItem>
                <MenuItem value="React">React</MenuItem>
                <MenuItem value="Node.js">Node.js</MenuItem>
                <MenuItem value="SQL">SQL</MenuItem>
                <MenuItem value="AWS">AWS</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mb: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ mb: 1 }}
              >
                Upload Avatar
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({ ...formData, avatar: event.target.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>
              {formData.avatar && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={formData.avatar} sx={{ width: 56, height: 56 }} />
                  <Button 
                    size="small" 
                    onClick={() => setFormData({ ...formData, avatar: '' })}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
            
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
            
            <TextField
              margin="dense"
              label="Birth Date"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.birthdate}
              onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editUser ? 'Update' : 'Create'}
          </Button>
          </DialogActions>
          </Dialog>
        </Box>
      )}

      {activeTab === 1 && <LuminometerScreen />}
      
      {activeTab === 2 && <USBDeviceScreen />}
    </Container>
  );
}

export default App;