import React, { useState, useEffect } from 'react';

import {List, ListItem, Paper, Container, Grid, Typography, Button} from '@mui/material';
import { JSONTree } from 'react-json-tree';
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
const MonitorPage = () => {
  // const [messages, setMessages] = useState([]);

  const [highFrequencyLogs, setHighFrequencyLogs] = useState();
  const [lowFrequencyLogs, setLowFrequencyLogs] = useState();
  const [eventLogs, setEventLogs] = useState();

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
    }, 1000); // 每 0.5 秒调用一次

    return () => {
      clearInterval(intervalId); // 组件卸载时清除定时器
    };
  }, []);


  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Paper style={{ maxHeight: 500, overflow: 'auto' , marginTop: '20px'}}>
            <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'center' }}>
              High Frequency Logs
            </Typography>
            <JSONTree data={highFrequencyLogs || {}}theme={theme} invertTheme={false} />
          </Paper>
          <Paper style={{ maxHeight: 300, overflow: 'auto', marginTop: '10px' }}>
            <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'center' }}>
              Low Frequency Logs
            </Typography>
            <JSONTree data={lowFrequencyLogs || {}}theme={theme} invertTheme={false} />
          </Paper>
         
        </Grid>
        <Grid  item xs={5}>
          <Paper style={{ maxHeight: 500, overflow: 'auto' , marginTop: '20px'}}>
            <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'center' }}>
              Event Logs
            </Typography>
            <JSONTree data={eventLogs || {}} theme={theme} invertTheme={false} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MonitorPage;
