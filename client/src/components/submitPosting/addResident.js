import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Icon } from 'semantic-ui-react'

const AddResident = ({ residents, setResidents }) => {
  const [open, setOpen] = React.useState(false);
  const [userNotFound, setUserNotFound] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUserNotFound(false);
  };

  const handleAddResident = async (email) => {
    try {
      const response = await callApiAddResident(email);
      const parsed = JSON.parse(response.express);
      if (parsed.length > 0) {
        setResidents([...residents, {
          userID: parsed[0].userID,
          email: parsed[0].email,
          firstName: parsed[0].firstName,
          lastName: parsed[0].lastName
        }]);
        handleClose();
      } else {
        setUserNotFound(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  async function callApiAddResident(email) {
    const userToken = sessionStorage.getItem('userToken');
    const url = '/api/addResident';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: JSON.stringify({ email: email }),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  return (
    <Box sx={{ width: '40%', height: '20%', border: '2px solid grey' }}>
      <Icon bordered inverted color='teal' name='users' size='large'/>
      <Button variant="contained" onClick={handleClickOpen}>
        Add Resident
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            handleAddResident(email);
          },
        }}
      >
        <DialogTitle>Add Resident</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the Resident's email so we can authenticate them and check if they are signed up!
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add Resident</Button>
        </DialogActions>
      </Dialog>
      {userNotFound && (
        <Dialog open={userNotFound} onClose={handleClose}>
          <DialogTitle>User Not Found</DialogTitle>
          <DialogContent>
            <DialogContentText>
              The user you are looking for was not found.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>OK</Button>
          </DialogActions>
        </Dialog>
      )}
      <ul>
        {residents.map((resident, index) => (
          <li key={index}>
            <strong>Email:</strong> {resident.email}, <strong>First Name:</strong> {resident.firstName}, <strong>Last Name:</strong> {resident.lastName}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default AddResident;
