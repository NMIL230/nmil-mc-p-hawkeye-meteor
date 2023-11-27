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
function handleData(data) {


  try {
    const jsonData = JSON.parse(data);
    switch (jsonData.title) {
      case 'PLAYER_LOG_LOW_FREQUENCY':
        handlePlayerLog(jsonData,'PLAYER_LOG_LOW_FREQUENCY');
        break;
      case 'PLAYER_LOG_HIGH_FREQUENCY':
        handlePlayerLog(jsonData, 'PLAYER_LOG_HIGH_FREQUENCY');
        break;
      case 'PLAYER_LOG_EVENT':
        handlePlayerLog(jsonData, 'PLAYER_LOG_EVENT');
        break;
      case 'SERVER_STATUS':
        handleServerStatus(jsonData);
        break;
      case 'SERVER_PLAYER_LOGOUT':
        handlePlayerLogout(jsonData);
        console.log(PlayerMap)
        break;
      case 'SERVER_PLAYER_LOGIN':
        handlePlayerLogin(jsonData);
        console.log(PlayerMap)
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
    timestamp: dateFormatter(new Date()), // 记录当前时间戳
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
  const playerName = jsonData.data.player;
  const logContent = jsonData.data.log;
  const logItemName = PlayerMap[playerName];

  PlayerLogs.update({ name: logItemName }, { $push: { logs: {type: type, info: logContent} } });

}
function handlePlayerLogin(jsonData) {

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


}

function handlePlayerLogout(jsonData) {
  const playerName = jsonData.data;
  const count = jsonData.total_log;
  const timestamp = dateFormatter(new Date());
  const logItemName = PlayerMap[playerName];
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


function dateFormatter(date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true // 使用12小时制，对于24小时制，设置为false
  });

// 使用formatter来获取格式化的字符串
  return formatter.format(date);
}
export default startWebSocketClient;
