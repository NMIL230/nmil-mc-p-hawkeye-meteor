import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function PromptPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleGet = async () => {
    Meteor.call('getChatGPTCheck',  (error, result) => {
      if (error) {
        console.error('Error from OpenAI:', error);
        setResponse('Error from OpenAI:'+ error);
      } else {
        setResponse(result);
      }
    });
  };

  const handleSubmit = async () => {
    Meteor.call('getChatGPTResponse', input, (error, result) => {
      if (error) {
        console.error('Error from OpenAI:', error);
        setResponse('Error from OpenAI:'+ error);
      } else {
        setResponse(result);
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        ChatGPT
      </Typography>

      <TextField
        label="Message ChatGPT..."
        multiline
        rows={4}
        fullWidth
        value={input}
        onChange={handleInputChange}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleGet}>
        Check
      </Button>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Send
      </Button>
      <br/>
      <Typography variant="body1" gutterBottom>
        {response}
      </Typography>
    </Container>
  );
}

export default PromptPage;
