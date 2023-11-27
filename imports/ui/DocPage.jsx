import * as React from 'react';
import { useState, useEffect } from 'react';
import { List, ListItem, Typography, Box, Divider } from '@mui/material';
import { marked } from 'marked';

function DocumentationPage() {
  const [selectedPage, setSelectedPage] = useState('README');
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch(`/docs/${selectedPage}.md`)
      .then((response) => response.text())
      .then((text) => {
        setMarkdown(marked(text));
      })
      .catch((error) => console.error('Fetching Markdown failed', error));
  }, [selectedPage]);

  const handleListItemClick = (page) => {
    setSelectedPage(page);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: '20%', bgcolor: 'background.paper' }}>
        <List component="nav" aria-label="main mailbox folders">
          <ListItem
            button
            selected={selectedPage === 'README'}
            onClick={() => handleListItemClick('README')}
          >
            <Typography>Getting Started</Typography>
          </ListItem>
          <ListItem
            button
            selected={selectedPage === 'api'}
            onClick={() => handleListItemClick('api')}
          >
            <Typography>API</Typography>
          </ListItem>
          <ListItem
            button
            selected={selectedPage === 'contribution'}
            onClick={() => handleListItemClick('contribution')}
          >
            <Typography>Contribution</Typography>
          </ListItem>
          <ListItem
            button
            selected={selectedPage === 'history'}
            onClick={() => handleListItemClick('history')}
          >
            <Typography>History</Typography>
          </ListItem>
        </List>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ width: '80%', overflow: 'auto', p: 3 }}>
        <div
          dangerouslySetInnerHTML={{ __html: markdown }}
          style={{ lineHeight: '1.8' }} // 设置行间距为1.6
        />
      </Box>
    </Box>
  );
}

export default DocumentationPage;
