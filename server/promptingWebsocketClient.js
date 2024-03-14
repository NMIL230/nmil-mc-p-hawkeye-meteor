import { WebSocket } from 'ws';
import { Meteor } from 'meteor/meteor';
import {AIResponses, PlayerLogs} from '/imports/api/links';
import {HawkeyeHistory, WebSocketStatus, HawkeyeStatus} from "../imports/api/links";
import axios from "axios";

import { generatePromptFromLogs } from "./prompt/generatePromptFromLogs";

import {Task_Rating_Prompt_Instruction} from "./prompt/Headers/Task_Rating_RidePig";


export const PlayerMap = {};

let BUFFER_SIZE = 100;
let ws = null;

function createWebSocketConnection() {
  const ws = new WebSocket('ws://localhost:8887');
  const bound = Meteor.bindEnvironment((callback) => {callback()})

  ws.on('open', function open() {
    console.log('Connected to the Minecraft plugin server');
    bound(function (){
      WebSocketStatus.upsert({ _id: 'status' }, { $set: { status: 'open' } });
    })
  });

  ws.on('message', function incoming(data) {
    bound(function (){
          //console.log('Received:', data);reconnectWebSocket
          handleData(data);
        }
    )
  });

  ws.on('close', function close() {
    console.log('Disconnected from the Minecraft plugin server');
    bound(function () {
      WebSocketStatus.upsert({ _id: 'status' }, { $set: { status: 'close'} });
    });
  });

  ws.on('error', function error(error) {
    console.error('WebSocket error:', error);
    bound(function () {
      WebSocketStatus.upsert({ _id: 'status' }, { $set: { status: 'error', message: error.toString() } });
    });
  });
}
function startPromptingWebSocketClient() {
  createWebSocketConnection();
}

Meteor.methods({
  'reconnectWebSocket': function () {
    console.log("Reconnecting WebSocket...");
    if (ws) {
      ws.close();
    }
    createWebSocketConnection();
  }
});

let started = false;

let monitorLogLow = null;
let monitorLogHigh = null;
let monitorLogEvent = null;

const logBuffer = {};
let promptLogBuffer = [];




Meteor.methods({
  'getMonitorLog': function() {
    return {monitorLogLow, monitorLogHigh, monitorLogEvent};
  }
});

let monitorT_R_RIDEPIG = null;

Meteor.methods({
  'getT_R_RIDEPIG': function() {
    return monitorT_R_RIDEPIG;
  }
});


function handleData(data) {
  try {
    const jsonData = JSON.parse(data);
    // console.log(jsonData)
    // console.log(jsonData)

    switch (jsonData.title) {
      case 'PLAYER_LOG_LOW_FREQUENCY':
        monitorLogLow = jsonData.data;
        handlePlayerLog(jsonData,'PLAYER_LOG_LOW_FREQUENCY');
        break;
      case 'PLAYER_LOG_HIGH_FREQUENCY':
        monitorLogHigh = jsonData.data;
        handlePlayerLog(jsonData, 'PLAYER_LOG_HIGH_FREQUENCY');
        break;
      case 'PLAYER_LOG_EVENT':
        monitorLogEvent = jsonData.data;
        handlePlayerLog(jsonData, 'PLAYER_LOG_EVENT');
        break;
      case 'SERVER_STATUS':
        handleServerStatus(jsonData);
        break;
      case 'SERVER_PLAYER_LOGOUT':
        handlePlayerLogout(jsonData);
        console.log("Player "+ jsonData.data + " logged out, online players: ");
        console.log(PlayerMap)
        break;
      case 'SERVER_PLAYER_LOGIN':
        handlePlayerLogin(jsonData);
        console.log("Player "+ jsonData.data + " logged in, online players: ");
        console.log(PlayerMap);
        break;
      default:
        console.log('Unknown data type:', jsonData.title);
    }
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }
}

function handlePlayerLog(jsonData, type) {
  try {
    const playerName = jsonData.data.player;
    const logContent = jsonData.data.log;
    const logItemName = PlayerMap[playerName];

    if (!logBuffer[logItemName]) {
      logBuffer[logItemName] = [[]];
    }
    let currentBuffer = logBuffer[logItemName];
    let currentLogArray = currentBuffer[currentBuffer.length - 1];

    if (currentLogArray.length >= BUFFER_SIZE) {
      currentBuffer.push([]);
      currentLogArray = currentBuffer[currentBuffer.length - 1];
    }
    promptLogBuffer.push({ type: type, info: logContent });
    currentLogArray.push({ type: type, info: logContent });
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }

}
Meteor.setInterval(() => {
  for (const logItemName in logBuffer) {
    let currentBuffer = logBuffer[logItemName];

    while (currentBuffer.length > 0 && currentBuffer[0].length >= BUFFER_SIZE) {
      console.log("Meteor.setInterval pushed: " + currentBuffer[0].length);
      PlayerLogs.update({ name: logItemName }, { $push: { logs: { $each: currentBuffer.shift() } } });
    }

    if (currentBuffer.length === 0) {
      logBuffer[logItemName] = [[]];
    }
  }
}, 10000); // 10秒

Meteor.setInterval(() => {
  if(started){

    console.log("************************PROMPTING****************************")
    console.log("************************PROMPTING****************************")
    console.log("************************PROMPTING****************************")
    console.log("************************PROMPTING****************************")
    console.log("************************PROMPTING****************************")


    const input = generatePromptFromLogs(promptLogBuffer)
    promptLogBuffer=[]

    console.log("[PROMPT]:\n" + input)
    console.log("************************RESPONSE****************************")
    console.log("************************RESPONSE****************************")
    console.log("************************RESPONSE****************************")
    console.log("************************RESPONSE****************************")
    console.log("************************RESPONSE****************************")

    processLogWithAI(input).then(result => {
      console.log("\n\n[RESPONSE]\n\n" + result)
      monitorT_R_RIDEPIG = result
    });

  }
}, 10000); // 10秒


async function processLogWithAI(input) {

  const instruction = Task_Rating_Prompt_Instruction;

  try {
    const response = await getChatGPTResponse(instruction, input);

    // AIResponses.upsert({ _id: 'response' }, {$set: {
    //   response,
    //   createdAt: new Date()
    // }});
    return response;
  } catch (error) {
    console.error('Error processing log with AI:', error);
  }
}

async function getChatGPTResponse(instruction, content) {

  try {
    const response = await axios.post("https://openai-biomedical-prod.openai.azure.com/openai/deployments/gpt4/chat/completions?api-version=2024-02-15-preview", {
      messages: [
          { role: 'system', content: instruction },
        { role: 'user', content: content }
      ],
      model: 'gpt-4',
      // max_tokens: 1,x
      // temperature: 1,
    }, {
      headers: {
        'api-key': `e409ce30e8914a478912497601f58624`,
        'Content-Type': 'application/json',
      }
    });
    //console.log(input)
    console.log(response.data)
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Meteor.Error('api-error', 'OpenAI API error');
  }
}
function handlePlayerLogin(jsonData) {
  started = true;
  promptLogBuffer=[]


  const playerName = jsonData.data;
  const timestamp = dateFormatter(new Date());
  const logItemName = playerName + '_' + timestamp;

  PlayerMap[playerName] = logItemName;
  PlayerLogs.insert({ name: logItemName, player: playerName, logs: [] });
  HawkeyeHistory.insert({
    title: "[ " +  playerName + " ] " + " Joined, Collecting Log...",
    time: timestamp,
    document: logItemName,
    type: 0});
  Meteor.publish('playerLogs', function () {
    return PlayerLogs.find({ name: playerName });
  });

  AIResponses.upsert({ _id: 'response' }, {$set: {
      logItemName,
      response: "",
      createdAt: new Date()
    }});

}

function handlePlayerLogout(jsonData) {
  started = false;

  console.log("logout")

  const playerName = jsonData.data;
  const count = jsonData.total_log;
  const timestamp = dateFormatter(new Date());
  const logItemName = PlayerMap[playerName];

  if (logBuffer[logItemName]) {
    logBuffer[logItemName].forEach(logArray => {
      if (logArray.length > 0) {
        console.log("handlePlayerLogout pushed: " + logArray.length);
        PlayerLogs.update({ name: logItemName }, { $push: { logs: { $each: logArray } } });
      }
    });
    delete logBuffer[logItemName];
  }

  HawkeyeHistory.insert({
    title: "[ " +  playerName + " ] " + " Left, " + count + " logs received"  ,
    time: timestamp,
    document: logItemName ,
    serverCount: count,
    type: 1});
  HawkeyeHistory.update(
      { $and: [
          { title: "[ " +  playerName + " ] " + " Joined, Collecting Log..." },
          { type: 0 }
        ]},
      { $set: { type: 3, title: "[ " +  playerName + " ] " + " Joined" }}
  );

  if (PlayerMap[playerName]) {
    delete PlayerMap[playerName];
  }

}

function handleServerStatus(jsonData) {
  const serverStatus = jsonData.data;

  const statusRecord = {
    timestamp: dateFormatter(new Date()),
    usedMemory: serverStatus.usedMemory,
    onlinePlayers: serverStatus.onlinePlayers,
    serverTick: serverStatus.serverTick,
    averagePing: serverStatus.averagePing
  };
  HawkeyeStatus.upsert({ _id: 'status' }, { $set: {  timestamp: dateFormatter(new Date()),
      usedMemory: serverStatus.usedMemory,
      onlinePlayers: serverStatus.onlinePlayers,
      serverTick: serverStatus.serverTick,
      averagePing: serverStatus.averagePing } });

}
function dateFormatter(date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return formatter.format(date);
}
export default startPromptingWebSocketClient;
