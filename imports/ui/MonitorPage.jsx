import React, { useState, useEffect } from 'react';

import {List, ListItem, Paper, Container, Grid, Typography} from '@mui/material';
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
  const [messages, setMessages] = useState([]);

  const [eventLogs, setEventLogs] = useState();
  const [highFrequencyLogs, setHighFrequencyLogs] = useState();
  const [lowFrequencyLogs, setLowFrequencyLogs] = useState();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8887');
    ws.onopen = function open() {
      console.log('Monitor Page: Connected to the Minecraft plugin server');
    };

    ws.onmessage = function incoming(event) {
        handleData(event.data);
    };

    ws.onclose = function close() {
      console.log('Monitor Page: Disconnected from the Minecraft plugin server');
    };

    ws.onerror = function error(error) {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);


  function handleData(data) {
    setMessages(prevMessages => [data, ...prevMessages]);

    try {
      const jsonData = JSON.parse(data);
      switch (jsonData.title) {
        case 'PLAYER_LOG_LOW_FREQUENCY':
          setLowFrequencyLogs(jsonData);
          break;
        case 'PLAYER_LOG_HIGH_FREQUENCY':
          setHighFrequencyLogs(jsonData);
          break;
        case 'PLAYER_LOG_EVENT':
          setEventLogs(jsonData);
          break;
        default:
      }
    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' , marginTop: '10px'}}>
            <List >
              {messages.map((log, index) => (
                <ListItem key={index}>
                  {JSON.stringify(log)}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={6}>

          <Paper style={{ maxHeight: 500, overflow: 'auto' , marginTop: '10px'}}>
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
          <Paper style={{ maxHeight: 500, overflow: 'auto' , marginTop: '10px'}}>
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
