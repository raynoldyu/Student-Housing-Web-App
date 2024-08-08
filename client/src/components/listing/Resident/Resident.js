import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import Avatar from 'react-avatar';
import { Stack } from '@mui/material';

export default function Resident({ residentData }) {
    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {residentData?.map((resident) => {
                const userName = `${resident.firstName} ${resident.lastName}`;
                return (
                    <React.Fragment key={resident.userID}>
                        <ListItem alignItems="flex-start" sx={{marginLeft: '50px'}}>
                            <ListItemAvatar>
                                <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])} round={true} size="40" name={userName} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography variant='h6' style={{fontWeight: 'bold'}}>{userName}</Typography>}
                                secondary={
                                    <Typography variant='h6'>
                                        Program: {resident.program} | Age: {resident.age} | Gender: {resident.gender}
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                )
            }
            )
            }
        </List>
    );
}