import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import Grid from '@mui/material/Unstable_Grid2';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
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
import { FormControl } from '@mui/base/FormControl';
import { Delete } from '@mui/icons-material';
import { useUserAuth } from '../../contexts/AuthContext';
import EditIcon from '@mui/icons-material/Edit';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function EditListingPopUp({ listing }) {

    const userID = sessionStorage.getItem('userID');
     


    const [open, setOpen] = React.useState(false);
    const [postImage, setPostImage] = React.useState([]);
    const [submitResult, setSubmitResult] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);
    const [files, setFiles] = React.useState([]);
    const [formData, setFormData] = React.useState({
        title: listing.title,
        description: listing.description,
        address: listing.address,
        termLength: listing.length,
        price: listing.Price
    });
    const [formErrors, setFormErrors] = React.useState({
        title: false,
        description: false,
        address: false,
        termLength: false,
        price: false
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    const handleDateChange = (name, date) => {
        setFormData({
            ...formData,
            [name]: date,
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
                if (listing.landlordID == userID) {
                    console.log('ran')
                    callEditListing()
                        .then(res => {
                            var parsed = JSON.parse(res.express);
                            if (parsed == 'success') {
                                setSubmitResult('Success');          
                            } else {
                                setSubmitResult('Fail');
                            }
                        })
                        .then(setSubmitted(true));
                }
            } catch (err) {
                setSubmitResult('Fail');
            }
        } else {
            // Some fields are missing
            setFormErrors(errors);
            setSubmitted(false);
        }
    };

    const callEditListing = async () => {
        const url = '/api/editListing';
        const userToken = sessionStorage.getItem('userToken');

        let dataObj = {
            "postingID": listing.postingID,
            "title": formData.title,
            "description": formData.description,
            "address": formData.address,
            "termLength": formData.termLength,
            "price": formData.price
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: userToken
            },
            body: JSON.stringify({ data: dataObj })
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
        <React.Fragment>
            <Button
                variant="outlined"
                sx={{backgroundColor: 'black', color: 'white'}}
                startIcon={<EditIcon />}
                onClick={handleClickOpen}
            >
                Edit
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Listing
                        </Typography>

                    </Toolbar>
                </AppBar>

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
                        <MenuItem value={"1 Term"}>1 Term</MenuItem>
                        <MenuItem value={"2 Terms"}>2 Terms</MenuItem>
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

            </Dialog>
        </React.Fragment>
    );
}
