import React from 'react';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import AuthService from './../../api/AuthService'
import StateService from './../../api/StateService'

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

Pods.propTypes = {
  onError: PropTypes.func
};

export default function Pods(props) {
	
  const classes = useStyles();
  
  const [podsState, setPodsState] = React.useState([]);

  const get = function(onError){
	StateService.pods().then(res => {
      if(res.status === 200){
        setPodsState(res.data);
      }else {
        props.onError(res.data.message);
      }
	  setTimeout(get, 5000);
    }).catch(error => {
      if(!error.response || !error.response.data){
	    setTimeout(get, 10000);
        return props.onError('Unable to contact server, auto-retry after 10s !');
      }
      props.onError(error.response.data.message);
	  setTimeout(get, 5000);
    });	
  }
	
  const onRefresh = (event) => {
  	event.preventDefault();
    get();
  }
	
  React.useEffect(() => {
    if(!AuthService.getUserInfo()){
      return;
    } 
	get();
  }, []);

  return (
    <React.Fragment>
      <Title>Pods</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Namespace</TableCell>
            <TableCell>Name</TableCell>
			<TableCell>Ready</TableCell>
			<TableCell>Restarts</TableCell>
            <TableCell>IP</TableCell>
            <TableCell>Node</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {podsState.map(row => (
            <TableRow key={row.name}>
              <TableCell>{row.namespace}</TableCell>
			  <TableCell>{row.name}</TableCell>
              <TableCell>{row.readyContainers}/{row.allContainers}</TableCell>
              <TableCell>{row.restartCount}</TableCell>
              <TableCell>{row.address}</TableCell>
			  <TableCell>{row.node}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={onRefresh}>
          Refresh now
        </Link>
      </div>
    </React.Fragment>
  );
}