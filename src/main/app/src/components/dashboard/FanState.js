import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import AuthService from './../../api/AuthService'
import FanService from './../../api/FanService'

FanState.propTypes = {
  onError: PropTypes.func,
  onData: PropTypes.func
};

const useStyles = makeStyles({
  root: {
	right: 50,
	display: 'inline',
	position: 'absolute'
  }, smalllabel: {
	color: '#6c757d',
	fontSize: '0.7rem'
  }
});

export default function FanState(props) {
  
  const classes = useStyles();

  const [fanState, setFanState] = React.useState({
	isRunning: false,
	isEnabled: false,
	isAutoMode: false,
	minTemperature: '--',
	maxTemperature: '--',
	message: null
  });

  const status = function(){
	FanService.status().then(res => {
      if(res.status === 200){
		let response = JSON.parse(JSON.stringify(res.data));
		setFanState(response);
		if(props.onData){
			props.onData(res.data);	
		}
      }else {
        props.onError(res.data.message);
      }
	  setTimeout(status, 5000);
    }).catch(error => {
      if(!error.response || !error.response.data){
	    setTimeout(status, 10000);
        return props.onError('[FanStatus] Unable to contact server, auto-retry after 10s !');
      }
      props.onError(error.response.data.message);
	  setTimeout(status, 5000);
    });	
  }
	
  const onChange = (event) => {
	FanService.change(!fanState.isRunning).then(res => {
      if(res.status === 200){
		let response = JSON.parse(JSON.stringify(res.data));
		setFanState(response);
		if(props.onData){
			props.onData(res.data);	
		}
      }else {
        props.onError(res.data.message);
      }
    }).catch(error => {
      if(!error.response || !error.response.data){
	    return props.onError('[FanStatusChange] Unable to contact server !');
      }
      props.onError(error.response.data.message);
    });	
  }
	
  React.useEffect(() => {
    if(!AuthService.getUserInfo()){
      return;
    } 
	status();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
	  <div className={classes.root}>
		  <label>Cluster Fan</label>
	      <Switch
			  id="fanSwitch"
			  onChange={onChange}
			  checked={fanState.isRunning}
			  disabled={!fanState.isEnabled}
			/>
			<label className={classes.smalllabel}>Start/Stop Temp C° : {fanState.minTemperature} / {fanState.maxTemperature}</label>
		</div>
    </React.Fragment>
  );
}