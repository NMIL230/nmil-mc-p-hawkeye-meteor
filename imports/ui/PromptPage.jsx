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
        const speakText = (text) => {
            window.speechSynthesis.cancel()
            console.log('Trying to speak:', text); // 添加日志来确认函数被调用
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = 'en-US'; // 设置语言
            speech.volume = 1; // 设置音量
            speech.rate = 1; // 设置语速
            speech.pitch = 1; // 设置音调
            speech.onerror = (event) => {
                console.error('Speech synthesis error:', event.error); // 监听错误
            };
            window.speechSynthesis.speak(speech);
        };

        Meteor.call('getChatGPTResponse', input, (error, result) => {
            if (error) {
                console.error('Error from OpenAI:', error);
                setResponse('Error from OpenAI: ' + error);
            } else {
                console.log('Result from OpenAI:', result); // 确认返回结果
                speakText(result);
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
