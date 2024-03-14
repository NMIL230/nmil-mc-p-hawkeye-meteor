import React, { useState, useEffect } from 'react';
import {useTracker, withTracker} from 'meteor/react-meteor-data';
import { Bar } from 'react-chartjs-2';

import {List, ListItem, Paper, Container, Grid, Typography, Button} from '@mui/material';
import { JSONTree } from 'react-json-tree';
import {AIResponses} from "../api/links";


import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const theme = {
  scheme: 'hopscotch',
  author: 'jan t. sott',
  base00: '#ffffff',
  base01: '#433b42',
  base02: '#5c545b',
  base03: '#797379',
  base04: '#989498',
  base05: '#b9b5b8',
  base06: '#d5d3d5',
  base07: '#ffffff',
  base08: '#dd464c',
  base09: '#3862f9',
  base0A: '#fdcc59',
  base0B: '#0f0d0b',
  base0C: '#149b93',
  base0D: '#f0354b',
  base0E: '#c85e7c',
  base0F: '#b33508'
};
const RatingsChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      label: 'Task Ratings',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(54, 162, 235, 0.7)',
      hoverBorderColor: 'rgba(54, 162, 235, 1)',
      data: Object.values(data).map(task => task.Rating)
    }]
  };

  const options = {
    indexAxis: 'y', // 确保这个属性被设置来指定水平条形图
    elements: {
      bar: {
        borderWidth: 2,
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Sub-task Ratings for Riding a Pig in Minecraft'
      }
    }
  };

  // 使用Bar组件
  return <Bar data={chartData} options={options} />;
};

const MonitorPage = ({ aiResponses }) => {
  // const [messages, setMessages] = useState([]);

  const [highFrequencyLogs, setHighFrequencyLogs] = useState();
  const [lowFrequencyLogs, setLowFrequencyLogs] = useState();
  const [eventLogs, setEventLogs] = useState();

  const [T_R_RidePig, setT_R_RidePig] = useState();


  useEffect(() => {
    const intervalId = setInterval(() => {
      Meteor.call('getMonitorLog', (error, result) => {
        if (error) {
          console.error('Error calling sendPlayerLog:', error);
        } else {
          setLowFrequencyLogs(result.monitorLogLow);
          setHighFrequencyLogs(result.monitorLogHigh);
          setEventLogs(result.monitorLogEvent);
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId); // 组件卸载时清除定时器
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      Meteor.call('getT_R_RIDEPIG', (error, result) => {
        if (error) {
          console.error('Error calling sendPlayerLog:', error);
        } else {
          if (!!result) {
            console.log(result)
            const data = JSON.parse(result);
            setT_R_RidePig(data);
          } else {
            console.log("undefined RIDE PIG result")

          }

        }
      });
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // useEffect(() => {
  //   console.log(T_R_RidePig);
  // }, [T_R_RidePig]);

  return (
      <Container>
        <Paper style={{maxHeight: 500, overflow: 'auto', marginTop: '20px'}}>
          <Typography variant="h6" style={{fontWeight: 'bold', textAlign: 'center'}}>
            Player Pose Logs
          </Typography>
          <JSONTree data={highFrequencyLogs || {}} theme={theme} invertTheme={false}/>
        </Paper>



        <Paper style={{maxHeight: 500, overflow: 'auto', marginTop: '20px'}}>
          <Typography variant="h6" style={{fontWeight: 'bold', textAlign: 'center'}}>
            Player Event Logs
          </Typography>
          <JSONTree data={eventLogs || {}} theme={theme} invertTheme={false}/>
        </Paper>

        {T_R_RidePig && <Paper style={{ margin: '20px 0', padding: '20px' }}>
          <Typography variant="h6" style={{fontWeight: 'bold', textAlign: 'center'}}>
            Task Recognition: Riding a Pig
          </Typography>
          <RatingsChart data={T_R_RidePig} />
        </Paper>}

        <Paper style={{maxHeight: 1000, overflow: 'auto', marginTop: '20px'}}>



          {/*  {aiResponses.map((response, index) => {*/}

          {/*    //speakText(response.response);*/}
          {/*    return (*/}
          {/*        <div key={index}>*/}
          {/*          <Typography variant="h6" style={{fontWeight: 'bold'}}>AI Response:</Typography>*/}
          {/*          <p>{response.response}</p> /!* 假设每个响应在集合中以text字段存储 *!/*/}
          {/*        </div>*/}
          {/*    );*/}
          {/*      }*/}
          {/*  )}*/}
        </Paper>
      </Container>

  );
  };
  export default MonitorPage

