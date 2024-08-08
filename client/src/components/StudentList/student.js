import * as React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CategoryItem from '../CategoryItem/CategoryItem';
import { useTheme } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Stack } from '@mui/material';
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import { Icon } from 'semantic-ui-react'
import Chip from '@mui/material/Chip';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const Student = ({ student }) => {

    const theme = useTheme();
    console.log(student)

    return (
        <Card sx={{ width: '500px', height: '550px', backgroundColor: '#E9E9E9' }}>
            <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Grid container spacing={2}>
                    <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon size='big' name='student' />
                    </Grid>
                    <Grid item xs={11}>
                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            <Typography style={{ fontSize: '30px', marginRight: '5px', fontWeight: 'bold' }}>{student?.firstName} {student.lastName} ({student.age})</Typography>
                            <Typography style={{ fontSize: '24px', marginRight: '5px', fontWeight: 'bold' }}>- {student.gender}</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="h5" > {student.year}</Typography>
                            <Divider orientation="vertical" variant="middle" flexItem sx={{ bgcolor: '#000000', marginX: '8px' }} />
                            <Typography variant="h5" >{student.program}</Typography>
                            <Divider orientation="vertical" variant="middle" flexItem sx={{ bgcolor: '#000000', marginX: '8px' }} />
                            <Typography variant="h5" >Fall 2024</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h5" > {student.email}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <Stack sx={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ margin: '6px', fontWeight: 'bold', fontSize: '25px' }} >Matching Criteria:</Typography>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                                    {student.matchingLookingFor?.map((criteria, index) => (
                                        <CategoryItem key={index} item={criteria} category={'Criteria'} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                                <Typography sx={{ margin: '6px', fontWeight: 'bold', fontSize: '25px' }} >Matching Interests:</Typography>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                                    {student.matchingInterests?.map((interest, index) => (
                                        <CategoryItem key={index} item={interest} category={'Interests'} />
                                    ))}
                                </div>
                            </div>
                        </Stack>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                        {student.personalityMatch ? (
                            <>
                                <CircularProgressbar styles={buildStyles({ textColor: 'black', pathColor: '#E95C64' })} value={student.personalityMatch} text={`${student.personalityMatch}%`} />
                                <Typography variant="h7" sx={{ color: 'black' }}>Personality Match</Typography>
                            </>
                        ) : (
                            <Typography variant="h7" sx={{ color: 'black' }}>Please create a listing to view personality match</Typography>
                        )}

                    </Grid>


                    {student.reviews && student.reviews.map((review, index) => (
                        <Typography key={index}>
                            {review}
                        </Typography>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
}


export default Student;

