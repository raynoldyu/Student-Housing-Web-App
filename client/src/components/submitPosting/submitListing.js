import * as React from 'react';
import AddResident from './addResident';

import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import ListingView from '../listing/listingView';
import ResponsiveAppBar from '../Navigation/appBar';
import { useRadioGroup } from '@mui/material';
import { FormControl } from '@mui/base/FormControl';
import { Input } from '@mui/base/Input';
import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

import { auth } from '../Firebase/config';
import { useUserAuth } from '../../contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const SubmitPostings = () => {
  const {userData, user} = useUserAuth();

  const [submitResult, setSubmitResult] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    address: '',
    termLength: '',
    price: '',
    semester: ''
  });
  const [formErrors, setFormErrors] = React.useState({
    title: false,
    description: false,
    address: false,
    termLength: false,
    price: false,
    semester: false
  });
  const [files, setFiles] = React.useState([]);

  const [residents, setResidents] = React.useState([{userID: userData[0].userID, email: user.email, firstName: userData[0].firstName, lastName: userData[0].lastName}]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: false,
    });
  };


  const handleFileUpload = async e => {
    setFiles([...files, ...e.target.files]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  }

  const handleSubmit = () => {
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        errors[key] = true;
      }
    });
    if (Object.keys(errors).length === 0) {
      // All fields are filled
      // Proceed with form submission
      console.log('Form submitted:', formData);
      try {
        callUploadPostingData()
          .then(res => {
            var parsed = JSON.parse(res.express);
            if (parsed == 'success') {
              setSubmitResult('Success');
              setFormData({
                title: '',
                description: '',
                address: '',
                termLength: '',
                price: '',
                semester: ''
              })
              setFiles([])
            } else {
              setSubmitResult('Fail');
            }
          })
          .then(setSubmitted(true));
      } catch (err) {
        setSubmitResult('Fail');
      }
    } else {
      // Some fields are missing
      setFormErrors(errors);
      setSubmitted(false);
    }
  };

  const callUploadPostingData = async () => {
    const url = '/api/uploadPostingData';
    const userToken = sessionStorage.getItem('userToken');
    
    
    const formDataObj = new FormData()

    //parse through files and add them
    for (let i = 0; i < files.length; i++) {
      formDataObj.append('pictures', files[i]);
    }

    //parse through residents and add them
    let residentUserIDList = residents.map(resident => resident.userID)
 
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("address", formData.address);
    formDataObj.append("termLength", formData.termLength);
    formDataObj.append("price", formData.price);
    formDataObj.append("semester", formData.semester);
    formDataObj.append("residents", residentUserIDList);
    formDataObj.append("placesMap", "https://storage.googleapis.com/maps-solutions-ozforp1ejg/neighborhood-discovery/vxhu/neighborhood-discovery.html")
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: userToken
      },
      body: formDataObj
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  

  

  let submitMessage;
  if (submitted && submitResult == 'Success') {
    submitMessage = (
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Your Submission was a success!
      </Alert>
    );
  } else if (submitted && submitResult == 'Fail') {
    submitMessage = (
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
        Submit Failed.
      </Alert>
    );
  }

  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <ResponsiveAppBar />

      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        error={formErrors.title}
        helperText={formErrors.title ? 'Title is required' : ''}
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        multiline
        rows={4}
        value={formData.description}
        onChange={handleInputChange}
        error={formErrors.description}
        helperText={formErrors.description ? 'Description is required' : ''}
      />
      <TextField
        fullWidth
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        error={formErrors.address}
        helperText={formErrors.address ? 'Address is required' : ''}
      />
      <FormControl fullWidth error={formErrors.termLength}>
        <InputLabel>Term Length</InputLabel>
        <Select
          name="termLength"
          value={formData.termLength}
          onChange={handleInputChange}
          fullWidth
        >
          <MenuItem value="1 Term">1 Term</MenuItem>
          <MenuItem value="2 Terms">2 Terms</MenuItem>
        </Select>
        {formErrors.termLength && <div>Term Length is required</div>}
      </FormControl>
      <FormControl fullWidth error={formErrors.semester}>
        <InputLabel>Semester</InputLabel>
        <Select
          name="semester"
          value={formData.semester}
          onChange={handleInputChange}
          fullWidth
        >
          <MenuItem value="Spring 2024">Spring 2024</MenuItem>
          <MenuItem value="Fall 2024">Fall 2024</MenuItem>
          <MenuItem value="Winter 2025">Winter 2025</MenuItem>
          <MenuItem value="Spring 2025">Spring 2025</MenuItem>
          <MenuItem value="Fall 2025">Fall 2025</MenuItem>
          <MenuItem value="Winter 2026">Winter 2026</MenuItem>
          <MenuItem value="Spring 2026">Spring 2026</MenuItem>
          <MenuItem value="Fall 2026">Fall 2026</MenuItem>
        </Select>
        {formErrors.termLength && <div>Term Length is required</div>}
      </FormControl>
      <TextField
        fullWidth
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleInputChange}
        error={formErrors.price}
        helperText={formErrors.price ? 'Price is required' : ''}
      />
      

      <AddResident residents={residents} setResidents={setResidents}/>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>

      <input
        type="file"
        label="Image"
        name="myFile"
        accept=".jpeg, .png, .jpg"
        onChange={e => handleFileUpload(e)}
      />
      <Grid container spacing={2}>
      {files?.map((file, index) => (
        <Grid item xs={12} key={index}>
          <Typography variant="body1">{file.name}</Typography>
          <IconButton onClick={() => handleRemoveFile(index)}>
            <Delete />
          </IconButton>
        </Grid>
      ))}
      </Grid>

      

      {submitMessage}
    </div>
  );
};

export default SubmitPostings;
