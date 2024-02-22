import { WebSocket } from 'ws';
import { Meteor } from 'meteor/meteor';
import { PlayerLogs } from '/imports/api/links';
import {HawkeyeHistory, WebSocketStatus, HawkeyeStatus} from "../imports/api/links";
export const PlayerMap = {};

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
      //console.log('Received:', data);
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
function startWebSocketClient() {
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

let monitorLogLow = null;
let monitorLogHigh = null;
let monitorLogEvent = null;
const logBuffer = {};

Meteor.methods({
  'getMonitorLog': function() {
    return {monitorLogLow, monitorLogHigh, monitorLogEvent};
  }
});
Meteor.setInterval(() => {
  for (const logItemName in logBuffer) {
    let currentBuffer = logBuffer[logItemName];

    while (currentBuffer.length > 0 && currentBuffer[0].length >= 200) {
      console.log("Meteor.setInterval pushed: " + currentBuffer[0].length);
      PlayerLogs.update({ name: logItemName }, { $push: { logs: { $each: currentBuffer.shift() } } });
    }
    if (currentBuffer.length === 0) {
      logBuffer[logItemName] = [[]];
    }
  }
}, 10000); // 10s

function handleData(data) {
  try {
    const jsonData = JSON.parse(data);
    //console.log(jsonData)
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
      case 'BUILD_MASTER_END':
        handlePlayerLogout(jsonData);
        console.log("Player "+ jsonData.data + " build master end,  online players: ");
        console.log(PlayerMap)
        break;
      case 'BUILD_MASTER_START':
        handlePlayerLogin(jsonData);
        console.log("Player "+ jsonData.data + " build master start, the online players: ");
        console.log(PlayerMap);
        break;
      case 'BUILD_MASTER_MSG':
        monitorLogEvent = jsonData.data;
        handlePlayerLog(jsonData, 'BUILD_MASTER_MSG');
        break;
      default:
        console.log('Unknown data type:', jsonData.title);
    }
  } catch (error) {
    console.error('Error parsing JSON data:', error);
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
  HawkeyeStatus.upsert({ _id: 'status' }, { $set: {  timestamp: dateFormatter(new Date()), // 记录当前时间戳
      usedMemory: serverStatus.usedMemory,
      onlinePlayers: serverStatus.onlinePlayers,
      serverTick: serverStatus.serverTick,
      averagePing: serverStatus.averagePing } });

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

    if (currentLogArray.length >= 200) {
      currentBuffer.push([]);
      currentLogArray = currentBuffer[currentBuffer.length - 1];
    }

    currentLogArray.push({ type: type, info: logContent });
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }

}
function handlePlayerLogin(jsonData) {

  const playerName = jsonData.data;
  const timestamp = dateFormatter(new Date());
  const logItemName = playerName + '_' + timestamp;

  PlayerMap[playerName] = logItemName;
  PlayerLogs.insert({ name: logItemName, player: playerName, logs: [] });
  HawkeyeHistory.insert({
    title: "[ " +  playerName + " ] " + " Joined Build Master, Collecting Log...",
    time: timestamp,
    document: logItemName,
    type: 0});
  Meteor.publish('playerLogs', function () {
    return PlayerLogs.find({ name: playerName });
  });

}

function handlePlayerLogout(jsonData) {
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
    title: "[ " +  playerName + " ] " + " Left Build Master, " + count + " logs received"  ,
    time: timestamp,
    document: logItemName ,
    serverCount: count,
    type: 1});
  HawkeyeHistory.update(
    { $and: [
        { title: "[ " +  playerName + " ] " + " Joined Build Master, Collecting Log..." },
        { type: 0 }
      ]},
    { $set: { type: 3, title: "[ " +  playerName + " ] " + " Joined Build Master" }}
  );

  if (PlayerMap[playerName]) {
      delete PlayerMap[playerName];
    }

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
export default startWebSocketClient;
