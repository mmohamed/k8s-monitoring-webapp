import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
	},
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  list: {
	marginTop: theme.spacing(6),
	marginLeft: theme.spacing(-6)
  },
}));

export default function AccountMenu(props) {

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
	setAnchorEl(null);
	props.onLogout();
  };

  return (
	  <React.Fragment>
		<IconButton className={classes.root} color="inherit" aria-controls="account-menu" aria-haspopup="true" onClick={handleClick}>
			<Avatar className={classes.orange} alt={props.username} src="/broken-image.jpg" >{props.username.substr(0, 1).toUpperCase()}</Avatar> 
		</IconButton>
		<Menu
			id="account-menu"
            className={classes.list}
			anchorEl={anchorEl}
			keepMounted
			open={Boolean(anchorEl)}
			onClose={handleClose}
		>
			<MenuItem onClick={handleClose}>My account</MenuItem>
			<MenuItem onClick={handleLogout}>Logout</MenuItem>
		</Menu>
	  </React.Fragment>
  );
}

AccountMenu.defaultProps = {
  username: 'nobody',
};