import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import { LineChart , Line, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import Title from './Title';

Nodes.propTypes = {
  data: PropTypes.array,
  nodes: PropTypes.array
};

Nodes.defaultProps = {
  nodes: [{name: 'master', 'color': 'black'}],
  data: [{time: '00.01', 'master' : 1}]
};

export default function Nodes(props) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Nodes pods usages (%)</Title>
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
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary} />
		  <Legend />
		  <Tooltip />
		  {props.nodes.map(node => {
		  	return (<Line type="monotone" key={node.name} dataKey={node.name} stroke={node.color} dot={false} />)
		  })}
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}