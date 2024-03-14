import { Meteor } from 'meteor/meteor';
// import startBuildMasterWebSocketClient from "./buildmasterWebsocketClient";
import startPromptingWebSocketClient from "./promptingWebsocketClient";

import { HawkeyeHistory } from '/imports/api/links';
import { PlayerLogs } from '/imports/api/links';
import {Mongo} from "meteor/mongo";

import './utils/openAi';
import {WebSocketStatus} from '/imports/api/links';
import {HawkeyeStatus} from "../imports/api/links";
import { AIResponses } from '/imports/api/links';

Meteor.publish('HawkeyeHistory', function () {
  return HawkeyeHistory.find();
});
Meteor.publish('PlayerLnogs', function () {
  return PlayerLogs.find();
});

Meteor.publish('WebsocketStatus', function () {
  return WebSocketStatus.find();
});
Meteor.publish('HawkeyeStatus', function () {
  return HawkeyeStatus.find();
});

Meteor.publish('aiResponses', function publishAIResponses() {
  return AIResponses.find();
});

Meteor.startup(() => {
  startPromptingWebSocketClient();
  // startBuildMasterWebSocketClient
});
