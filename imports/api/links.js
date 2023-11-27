import { Mongo } from 'meteor/mongo';

export const PlayerLogs = new Mongo.Collection('PlayerLogs');
export const HawkeyeHistory = new Mongo.Collection('HawkeyeHistory');
export const WebSocketStatus = new Mongo.Collection('WebsocketStatus');
export const HawkeyeStatus = new Mongo.Collection('HawkeyeStatus');
