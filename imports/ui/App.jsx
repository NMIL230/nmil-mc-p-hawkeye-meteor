import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ServerPage from './ServerPage';
import DocPage from './DocPage';
import { Box } from '@mui/material';
import MonitorPage from './MonitorPage';
import PromptPage from "./PromptPage";

export const App = () => {
  return (
    <Router>
      <Box sx={{width: '100%'}}>
        <NavbarWithLocation/>
        <Routes>
          <Route path="/" element={<ServerPage/>}/>
          <Route path="/*" element={<ServerPage/>}/>
          <Route path="/hawkeye" element={<ServerPage/>}/>

          <Route path="/hawkeye/documentation" element={<DocPage/>}/>
          <Route path="/hawkeye/openai" element={<PromptPage/>}/>
          <Route path="/hawkeye/monitor/:documentId" element={<MonitorPage />} />

        </Routes>
      </Box>
    </Router>
  );
};

// This component is needed to use the `useLocation` hook outside of `Routes`.
function NavbarWithLocation() {
  const location = useLocation();
  const currentTab = location.pathname === '/documentation' ? 1 : 0;

  return <Navbar value={currentTab}/>;
}
