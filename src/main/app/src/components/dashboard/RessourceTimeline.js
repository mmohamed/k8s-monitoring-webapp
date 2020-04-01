import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { LineChart , Line, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Title from './Title';

RessourceTimeline.propTypes = {
  data: PropTypes.array,
  nodes: PropTypes.array,
  title: PropTypes.string
};

RessourceTimeline.defaultProps = {
  nodes: [],
  data: [],
  title: ''
};


export default function RessourceTimeline(props) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <ResponsiveContainer>
        <LineChart
          data={props.data}
          margin={{
            top: 5,
            right: 16,
            bottom: 5,
            left: 16,
          }}
        >
		  <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis orientation={'right'} domain={[0, 'auto']} stroke={theme.palette.text.secondary} />
		  <Legend />
		  <Tooltip isAnimationActive={false} labelFormatter={function(label) {return null }} />
		  {props.nodes.map(node => {
		  	return (<Line type="monotone" key={node.name} dataKey={node.name} stroke={node.color} dot={false} />)
		  })}
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}