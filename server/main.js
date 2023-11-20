import { Meteor } from 'meteor/meteor';
import startWebSocketClient from "./websocketClient";
import { HawkeyeHistory } from '/imports/api/links';
import { PlayerLogs } from '/imports/api/links';
import {Mongo} from "meteor/mongo";

Meteor.publish('hawkeyeHistory', function () {
  return HawkeyeHistory.find();
});
Meteor.publish('playerLogs', function () {
  return PlayerLogs.find();
});

Meteor.startup(() => {
  startWebSocketClient()

});
