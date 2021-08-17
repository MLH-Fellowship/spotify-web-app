import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: '3%',
    paddingRight: '3%',
    backgroundColor: '#191414',
    fontWeight: 'bold',
    color: '#B3B8BD',
    fontFamily: 'Helvetica',
  },
  list: {
    justifyContent: 'start',
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    flex: 5,
  },
  album: {
    flex: 3,
  },
  dateAdded: {
    flex: 3,
  },
  duration: {
    flex: 1,
  },
  number: {
    flex: 0.3,
    marginLeft: '1rem',
  },
  primary: {
    color: '#FFFFFF',
  },
  secondary: {
    color: '#B3B8BD',
  }
}));

export default function CheckboxListSecondary(props) {
  const classes = useStyles();

  const getDate = (date) => {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let newMonth = '';

    switch (month) {
        case 1:
            newMonth = 'Jan';
            break;
        case 2:
            newMonth = 'Feb';
            break;
        case 3:
            newMonth = 'Mar';
            break;
        case 4:
            newMonth = 'Apr';
            break;
        case 5:
            newMonth = 'May';
            break;
        case 6:
            newMonth = 'Jun';
            break;
        case 7:
            newMonth = 'Jul';
            break;
        case 8:
            newMonth = 'Aug';
            break;
        case 9:
            newMonth = 'Sep';
            break;
        case 10:
            newMonth = 'Oct';
            break;
        case 11:
            newMonth = 'Nov';
            break;
        case 12:
            newMonth = 'Dec';
            break;
        default:
            break;
    }

    return `${newMonth} ${day}, ${year}`;
  }

  const getDuration = (milliseconds) => {
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  return (
    <List dense className={classes.root}>
        <ListItem>
            <ListItemText className={classes.number} primary='#' />
            <ListItemText className={classes.title} primary='TITLE'/>
            <ListItemAvatar>
            </ListItemAvatar>
            <ListItemText className={classes.album} primary='ALBUM' />
            <ListItemText className={classes.dateAdded} primary='DATE ADDED' />
            <ListItemText className={classes.duration} primary='DURATION' />
        </ListItem>
        <Divider component="li" />
      {props.songs.map((song, value) => {
          const date_added = getDate(song.added_at);
          const duration = getDuration(song.track.duration_ms);
        return (
          <ListItem key={value} button href={song.track.external_urls.spotify} target="_blank">
            <ListItemText className={classes.number} primary={value + 1}  />
            <ListItemAvatar>
              <Avatar
                variant="square"
                alt={`Avatar n°${value + 1}`}
                src={song.track.album.images[song.track.album.images.length - 1].url}
              />
            </ListItemAvatar>
            <ListItemText className={classes.title} primary={
                <React.Fragment>
                    <Typography
                            component="span"
                            variant="body2"
                            className={classes.primary}
                        >
                        {song.track.name}
                    </Typography>
                </React.Fragment>
            } secondary={
                    <React.Fragment>
                        {song.track.artists.map((artist, artistIndex) => {
                            return (
                                <React.Fragment key={artistIndex}>
                                    <Typography
                                            component="span"
                                            variant="body2"
                                            // color="textSecondary"
                                            className={classes.secondary}
                                        >
                                        {artist.name}
                                        {artistIndex < song.track.artists.length - 1 ? ', ' : ''}
                                    </Typography>
                                </React.Fragment>
                            );
                        })
                        }
                    </React.Fragment>
                } />
            <ListItemText className={classes.album} primary={song.track.album.name} />
            <ListItemText className={classes.dateAdded} primary={date_added} />
            <ListItemText className={classes.duration} primary={duration} />
          </ListItem>
        );
      })}
    </List>
  );
}