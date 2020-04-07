import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import AuthService from './../../api/AuthService'
import StateService from './../../api/StateService'

const useStyles = makeStyles({
  stateContext: {
    flex: 1,
	fontSize: 10
  },
});

State.propTypes = {
  onError: PropTypes.func,
  onData: PropTypes.func
};

export default function State(props) {
  const classes = useStyles();

  const [nodesState, setNodesState] = React.useState([]);

  const get = function(){
	StateService.nodes().then(res => {
      if(res.status === 200){
        setNodesState(res.data);
		props.onData(res.data);
      }else {
        props.onError(res.data.message);
      }
	  setTimeout(get, 5000);
    }).catch(error => {
      if(!error.response || !error.response.data){
	    setTimeout(get, 10000);
        return props.onError('[State] Unable to contact server, auto-retry after 10s !');
      }
      props.onError(error.response.data.message);
	  setTimeout(get, 5000);
    });	
  }

  React.useEffect(() => {
    if(!AuthService.getUserInfo()){
      return;
    } 
	get();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <Title>Nodes</Title>
	  {nodesState.map(node => (
	  <span key={node.name}>	
	      <Typography>
	        [{node.status}] {node.name}{node.isMaster ? '*' : ''}
	      </Typography>
	      <Typography color="textSecondary" className={classes.stateContext}>
	        CPU:{node.cpu}, MEM:{Math.round(node.memory/(1024*1024))}Mi, Pods:{node.pods}, IP:{node.addresse}
	      </Typography>
	  </span>
	  ))}
    </React.Fragment>
  );
}