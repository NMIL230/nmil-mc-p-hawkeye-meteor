import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography, Grid
} from '@mui/material';
import {useTracker, withTracker} from 'meteor/react-meteor-data';
import { PlayerLogs } from '/imports/api/links';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import {HawkeyeHistory, WebSocketStatus, HawkeyeStatus} from "../api/links";

function ServerPage({ historyData, loading, isError, hawkeyeStatus }) {
  const navigate = useNavigate();

  const handleDownload = async (documentId) => {
    const data = await PlayerLogs.findOne({ name: documentId });
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${documentId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMonitor = (documentId) => {
    navigate(`/hawkeye/monitor/${documentId}`);
  };

  const renderActionButton = (type, documentId) => {
    return type === 0 ? (
      <Button variant="contained" sx={{ width: 120 }} onClick={() => handleMonitor(documentId)}>Monitor</Button>
    ) : (
      type === 1 ? (
        <Button variant="contained" sx={{ width: 120 }} color="success" onClick={() => handleDownload(documentId)}>Download</Button>
      ) : (
        <Button disabled={true} variant="contained" sx={{ width: 120 }}>Monitor</Button>
      )
    );
  };
  const handleReconnect = () => {
    Meteor.call('reconnectWebSocket', (error, result) => {
      if (error) {
        console.error('Error reconnecting WebSocket:', error);
      } else {
        console.log('WebSocket reconnection initiated.');
      }
    });
  };

  return (
    <div>
      {isError ? (
        <Grid container direction="column" alignItems="center" justify="center">
          <Typography variant="h7" style={{ fontWeight: 'bold' }}  sx={{ marginY: '20px', color: 'red' }}>
            Not Connected to Hawkeye
          </Typography>
          <Button variant="contained" sx={{ width: 120, marginBottom: '20px' }} color="success" onClick={handleReconnect}>
            Retry
          </Button>
        </Grid>
      ) : (
        <Grid container direction="column" alignItems="center" justify="center">
          <Paper sx={{ padding: '20px', marginY: '20px' ,minWidth: 750}}>
            <Typography variant="h7" style={{ fontWeight: 'bold' }}  sx={{ marginY: '20px', color: 'green' }}>
              Connected to Hawkeye
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography>Memory Usage:<br /> {hawkeyeStatus?.usedMemory} MB</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Online Players:<br /> {hawkeyeStatus?.onlinePlayers}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Server TPS:<br /> {hawkeyeStatus?.serverTick.toFixed(4)}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>Average Ping:<br /> {hawkeyeStatus?.onlinePlayers === 0 ? "N/A" : (hawkeyeStatus?.averagePing + " ms")}</Typography>
              </Grid>
            </Grid>
          </Paper>

        </Grid>

      )}
      {
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h7" style={{ fontWeight: 'bold' }}>
                    Time
                  </Typography>
                </TableCell>
                <TableCell >
                  <Typography variant="h7" style={{ fontWeight: 'bold'}}>
                    Hawkeye History
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h7" style={{ fontWeight: 'bold'}}>
                    Action
                  </Typography>

                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyData.map((row) => (
                <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.time}
                  </TableCell>
                  <TableCell >{row.title}</TableCell>
                  <TableCell >{renderActionButton(row.type, row.document)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      }
    </div>
  );
}

export default withTracker(() => {
  const handleHistory = Meteor.subscribe('HawkeyeHistory');
  const handleWebSocketStatus = Meteor.subscribe('WebsocketStatus');
  const handleHawkeyeStatus = Meteor.subscribe('HawkeyeStatus');

  const websocketStatus = WebSocketStatus.findOne();
  const hawkeyeStatus= HawkeyeStatus.findOne();
  const isError = websocketStatus && (websocketStatus.status === 'error' || websocketStatus.status === 'close');

  return {
    historyData: HawkeyeHistory.find({}, { sort: { time: -1 } }).fetch(),
    loading: !handleHistory.ready(),
    isError: isError,
    hawkeyeStatus,
  };
})(ServerPage);
