import * as React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '13px'}} />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} style={{ color: 'white', marginTop: '4px'}}>
          Hawkeye
        </Typography>
        <Tabs value={false} aria-label="nav tabs">
          <Tab label="Dashboard" to="/hawkeye" component={NavLink} style={{ color: 'white',  marginTop: '4px' }}/>
          <Tab label="OpenAI" to="/hawkeye/openai" component={NavLink} style={{ color: 'white',  marginTop: '4px' }}/>
          <Tab label="Doc" to="/hawkeye/documentation" component={NavLink} style={{ color: 'white',  marginTop: '4px' }}/>
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
