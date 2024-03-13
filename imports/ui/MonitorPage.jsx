import React, { useState, useEffect } from 'react';
import {useTracker, withTracker} from 'meteor/react-meteor-data';

import {List, ListItem, Paper, Container, Grid, Typography, Button} from '@mui/material';
import { JSONTree } from 'react-json-tree';
import {AIResponses} from "../api/links";
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
const MonitorPage = ({ aiResponses }) => {
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
    }, 1000); // 每 0.1 秒调用一次

    return () => {
      clearInterval(intervalId); // 组件卸载时清除定时器
    };
  }, []);

  useEffect(() => {
    // 只有当aiResponses变化时才触发
    if (aiResponses.length > 0) {
      const latestResponse = aiResponses[aiResponses.length - 1].response;
      speakText(latestResponse);
    }
  }, [aiResponses]);
  const speakText = (text) => {
    window.speechSynthesis.cancel()
    console.log('Trying to speak:', text); // 添加日志来确认函数被调用
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US'; // 设置语言
    // speech.lang = 'zh-CN'; // 设置语言

    speech.volume = 1; // 设置音量
    speech.rate = 1.3; // 设置语速
    speech.pitch = 1; // 设置音调
    speech.onerror = (event) => {
      console.error('Speech synthesis error:', event.error); // 监听错误
    };
    window.speechSynthesis.speak(speech);
  };
  return (
      <Container>
        <Paper style={{maxHeight: 500, overflow: 'auto', marginTop: '20px'}}>
          <Typography variant="h6" style={{fontWeight: 'bold', textAlign: 'center'}}>
            Player Pose Logs
          </Typography>
          <JSONTree data={highFrequencyLogs || {}} theme={theme} invertTheme={false}/>
        </Paper>
        {/*<Paper style={{ maxHeight: 300, overflow: 'auto', marginTop: '10px' }}>*/}
        {/*  <Typography variant="h6" style={{ fontWeight: 'bold', textAlign: 'center' }}>*/}
        {/*    Low Frequency Logs*/}
        {/*  </Typography>*/}
        {/*  <JSONTree data={lowFrequencyLogs || {}}theme={theme} invertTheme={false} />*/}
        {/*</Paper>*/}


        <Paper style={{maxHeight: 500, overflow: 'auto', marginTop: '20px'}}>
          <Typography variant="h6" style={{fontWeight: 'bold', textAlign: 'center'}}>
            Player Event Logs
          </Typography>
          <JSONTree data={eventLogs || {}} theme={theme} invertTheme={false}/>
        </Paper>
        <Paper style={{ maxHeight: 1000, overflow: 'auto', marginTop: '20px' }}>
          {aiResponses.map((response, index) => {

            //speakText(response.response);
            return (
                <div key={index}>
                  <Typography variant="h6" style={{fontWeight: 'bold'}}>AI Response:</Typography>
                  <p>{response.response}</p> {/* 假设每个响应在集合中以text字段存储 */}
                </div>
            );
              }
          )}
        </Paper>
      </Container>

  );
};

export default withTracker(() => {
  Meteor.subscribe('aiResponses');
  return {
    aiResponses: AIResponses.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
})(MonitorPage);
