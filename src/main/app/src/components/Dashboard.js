import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Redirect } from 'react-router-dom';
import { mainListItems } from './dashboard/ListItems';
import RessourceTimeline from './dashboard/RessourceTimeline';
import State from './dashboard/State';
import Pods from './dashboard/Pods';
import Copyright from './../common/Copyright'
import AccountMenu from './../common/AccountMenu'
import AuthService from './../api/AuthService'
import StateService from './../api/StateService'
import Notification from './../common/Notification'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 260,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  
  let nodesLimit = {};
  let timelineDataHistory = [];
  let timelineMemoryDataHistory = [];
  let timelineCpuDataHistory = [];

  const [open, setOpen] = React.useState(false);
  
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState(null);
  
  const [k8sState, setK8SState] = React.useState('--');

  const [nodesColor, setNodesColor] = React.useState([]);
  const [timelinePodsData, setTimelinePodsData] = React.useState([]);
  const [timelineCpuData, setTimelineCpuData] = React.useState([]);
  const [timelineMemoryData, setTimelineMemoryData] = React.useState([]);
	
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleLogout = () => {
	  AuthService.logOut();
	  props.history.push('/signin');
  };
	
  const handleError = (message) => {
	setError(message);
  }

  const handleNodeData = (nodes) => {
	let newNodesLimit = [];
	let newNodeColor = [];
	let colors = ["#8884d8", "#82ca9d", "#28a745", "#007bff", "#dc3545", "#ffc107", "#343a40"];
	nodes.map((node, key) => {
		newNodesLimit[node.name] = node.pods;
		newNodeColor.push({name: node.name, color: colors[~~(key % colors.length)]});
		return node;
	});
	nodesLimit = newNodesLimit;
	setNodesColor(newNodeColor);
	/**** Memory and CPU timeline data ****/
	let now = Math.round((new Date()).getTime()/1000);
	let upMemoryData = {timing: now};
	let upCpuData = {timing: now};
	
	nodes.map((node) => {
		upMemoryData[node.name] = Math.round((node.metrics.memory/node.memory)*100);
		upCpuData[node.name] = Math.round((node.metrics.cpu/node.cpu)*100);
		return node;
	});
	
	let newTimelineMemoryData = timelineMemoryDataHistory.slice();
	newTimelineMemoryData.push(upMemoryData);
	
	let newTimelineCpuData = timelineCpuDataHistory.slice();
	newTimelineCpuData.push(upCpuData);
	
	if(newTimelineMemoryData.length > 10){
		newTimelineMemoryData = newTimelineMemoryData.slice(-10);
	}
	
	if(newTimelineCpuData.length > 10){
		newTimelineCpuData = newTimelineCpuData.slice(-10);
	}
	
	newTimelineMemoryData.map((value) => {
		if(value.timing === now){
			value.time = 'Now'
		}else{
			value.time = -(value.timing - now);
		}
		return value;
	});
	newTimelineCpuData.map((value) => {
		if(value.timing === now){
			value.time = 'Now'
		}else{
			value.time = -(value.timing - now);
		}
		return value;
	});
	
	setTimelineMemoryData(newTimelineMemoryData);
	timelineMemoryDataHistory = newTimelineMemoryData.slice();
	
	setTimelineCpuData(newTimelineCpuData);
	timelineCpuDataHistory = newTimelineCpuData.slice();
  }

  const handlePodData = (pods) => {
	let newDatas = {};
	pods.map((pod) => {
		if(!newDatas[pod.node]){
			newDatas[pod.node] = 0;
		}
		newDatas[pod.node]++;
		return pod;
	});
	let now = Math.round((new Date()).getTime()/1000);
	let upData = {timing: now};
	Object.keys(newDatas).map((node) => {
		let count = newDatas[node];
		if(node in nodesLimit){
			upData[node] = Math.round((count/nodesLimit[node])*100);
		}
		return node;
	})
	let newTimelineData = timelineDataHistory.slice();
	newTimelineData.push(upData);
	if(newTimelineData.length > 20){
		newTimelineData = newTimelineData.slice(-20);
	}
	newTimelineData.map((value) => {
		if(value.timing === now){
			value.time = 'Now'
		}else{
			value.time = -(value.timing - now);
		}
		return value;
	});
	setTimelinePodsData(newTimelineData);
	timelineDataHistory = newTimelineData.slice();
  }
 	
  React.useEffect(() => {
    if(!AuthService.getUserInfo()){
      return;
    } 
    StateService.global().then(res => {
      if(res.status === 200){
        setK8SState(res.data.isRunning ? 'OK' : 'KO');
      }else {
        setError(res.data.message);
      }
    }).catch(error => {
      if(!error.response || !error.response.data){
        return setError('Unable to contact server !');
      }
	  if(error.response.status === 401){
		return props.history.push('/signin');
	  }
      setError(error.response.data.message);
    });
  }, [props]);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const userInfo = AuthService.getUserInfo();

  if(!userInfo){
    return <Redirect to='/signin' />
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Monitoring
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={k8sState} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <AccountMenu username={userInfo.username} onLogout={handleLogout} />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        {/*<List>{secondaryListItems}</List>*/}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Timelines */}
            <Grid item xs={6}>
              <Paper className={fixedHeightPaper}>
                <RessourceTimeline data={timelineCpuData} nodes={nodesColor} title={"CPU usages (%)"}/>
              </Paper>
            </Grid>
			<Grid item xs={6}>
              <Paper className={fixedHeightPaper}>
                <RessourceTimeline data={timelineMemoryData} nodes={nodesColor} title={"Memory usages (%)"} />
              </Paper>
            </Grid>
			<Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <RessourceTimeline data={timelinePodsData} nodes={nodesColor} title={"Pods usages (%)"}/>
              </Paper>
            </Grid>
            {/* State */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <State onError={handleError} onData={handleNodeData}/>
              </Paper>
            </Grid>
            {/* Pods */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Pods onError={handleError} onData={handlePodData} />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
          <Notification message={success} setMessage={setSuccess} type="success" />
          <Notification message={error} setMessage={setError} type="error" />
        </Container>
      </main>
    </div>
  );
}
