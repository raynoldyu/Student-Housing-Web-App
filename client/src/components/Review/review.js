import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from '@mui/material/Rating';
import AddCommentIcon from '@mui/icons-material/AddComment';
import {Box, Typography, IconButton} from '@mui/material';
import TextField from '@mui/material/TextField';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';

const StyledDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialog-paper': {
    padding: theme.spacing(2),
    position: 'relative',
    overflowY: 'visible',
  },
}));

const StyledRating = styled(Rating)({
  display: 'flex',
  justifyContent: 'center',
  margin: '20px 0',
});

const Input = styled('input')({
  display: 'none',
});

const ReviewForm = ({postingID}) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [media, setMedia] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFeedback('');
    setRating(0);
    setMedia(null);
  };

  const handleSave = () => {
    callApiPostReview();
    setOpen(false);
  };

  const handleMediaChange = event => {
    setMedia(event.target.files[0]);
  };

  const callApiPostReview = async () => {
    const url = '/api/postReview';
    const userToken = sessionStorage.getItem('userToken')

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: JSON.stringify({ userToken: userToken, postingID: postingID, rating: rating, description: feedback }),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  return (
    <Box textAlign="center">
      <Button
        variant="outlined"
        sx={{backgroundColor: 'black', color: 'white'}}
        startIcon={<AddCommentIcon />}
        onClick={handleClickOpen}
      >
        Add Review
      </Button>
      <StyledDialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h6" component="p" gutterBottom>
            Rate this Listing
          </Typography>
        </DialogTitle>
        <DialogContent>
          <StyledRating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
          />
          <TextField
            autoFocus
            margin="dense"
            id="feedback"
            label="Your Feedback"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            value={feedback}
            onChange={event => setFeedback(event.target.value)}
          />
          <label htmlFor="icon-button-file">
            <Input
              accept="image/*,video/*"
              id="icon-button-file"
              type="file"
              onChange={handleMediaChange}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="upload video"
              component="span"
            >
              <VideoCameraFrontIcon />
            </IconButton>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Submit
          </Button>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default ReviewForm;