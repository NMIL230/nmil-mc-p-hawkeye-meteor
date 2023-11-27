import { Meteor } from 'meteor/meteor';
import startWebSocketClient from "./websocketClient";
import { HawkeyeHistory } from '/imports/api/links';
import { PlayerLogs } from '/imports/api/links';
import {Mongo} from "meteor/mongo";
import './openAi';
import {WebSocketStatus} from '/imports/api/links';
import {HawkeyeStatus} from "../imports/api/links";

Meteor.publish('HawkeyeHistory', function () {
  return HawkeyeHistory.find();
});
Meteor.publish('PlayerLogs', function () {
  return PlayerLogs.find();
});

Meteor.publish('WebsocketStatus', function () {
  return WebSocketStatus.find();
});
Meteor.publish('HawkeyeStatus', function () {
  return HawkeyeStatus.find();
});


Meteor.startup(() => {
  startWebSocketClient();
});
