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
  Typography
} from '@mui/material';
import {useTracker, withTracker} from 'meteor/react-meteor-data';
import { HawkeyeHistory } from '/imports/api/links';
import { PlayerLogs } from '/imports/api/links';

import { useNavigate } from 'react-router-dom';

function ServerPage() {
  const { historyData, isLoading } = useTracker(() => {
    const subscription = Meteor.subscribe('hawkeyeHistory');
    return {
      historyData: HawkeyeHistory.find({}, { sort: { time: -1 } }).fetch(),
      isLoading: !subscription.ready(),
    };
  });
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
    navigate(`/monitor/${documentId}`);
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


  return (
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
  );
}

export default withTracker(() => {
  const handle = Meteor.subscribe('hawkeyeHistory');
  return {
    historyData: HawkeyeHistory.find().fetch(),
    loading: !handle.ready(),
  };
})(ServerPage);
