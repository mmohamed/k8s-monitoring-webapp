import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from './../common/Copyright'
import Loader from './../common/Loader'
import Notification from './../common/Notification'
import AuthService from '../api/AuthService'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  
  const classes = useStyles();

  const [state , setState] = React.useState({
    username: 'medinvention',
    password: 'yesyes',
    rememberme: false,
  });

  const [loading, setLoading] = React.useState(false);

  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);
  
  const upState = (key, value) => {
    setState(prevState => {
      let newState = Object.assign({}, prevState);  
      newState[key] = value;                                     
      return newState;                                
    });
  }

  const handleChange = event => {
    upState(event.target.name, event.target.value);
  }

  const handleSubmit = event => {
    event.preventDefault();
    
    setLoading(true);

    const credentials = {username: state.username, password: state.password};

    AuthService.login(credentials).then(res => {
        if(res.status === 200){
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            props.history.push('/');
        }else {
           setError(res.data.message);
           setLoading(false);
        }
    }).catch(error => {
      setError(error.response.data.message);
      setLoading(false);
    });
  }

  const validateForm = function() {
    return state.username.length > 0 && state.password.length > 0;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Typography variant="h4" style={classes.notification}>{state.message}</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="username"
            autoComplete="email"
            autoFocus
            value={state.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={state.password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember"  color="primary" />}
            label="Remember me"
            name="rememberme" 
            id="rememberme"
            value={state.rememberme}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!validateForm()}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <Loader open={loading} setOpen={setLoading} />
      <Notification message={success} setMessage={setSuccess} type="success" />
      <Notification message={error} setMessage={setError} type="error" />
    </Container>
  )
}