import WebSocket from "ws";
import * as events from "events";
import getChatSessionServerList from "./getChatSessionServerList.js";
import getChatToken from "./getChatToken.js";
import convertType from "./convertType.js";
import { typeCmdID } from "./types.js";

/**
 * @typedef {events.EventEmitter} chatEvent
 */

/**
 * @param {Array<string} channelIDList
 * @returns {Promise<chatEvent}
 * @throws {Error}
 */
function connectChat(channelIDList) {
  return new Promise(async (resolve, reject) => {
    try {
      const eventEmitter = new events.EventEmitter();
      const chatSessionServer = getRandomItem(await getChatSessionServerList());
      resolve(eventEmitter);
      for (const channelID of channelIDList) {
        let connectionInfo = { channelID };
        try {
          const chatToken = await getChatToken(channelID);
          const connectMsg = createConnectMsg(
            chatToken.chatChannelId,
            chatToken.accessToken
          );
          connectionInfo["chatChannelId"] = chatToken.chatChannelId;
          const ws = new WebSocket(`wss://${chatSessionServer}/chat`);
          ws.on("open", () => {
            ws.send(JSON.stringify(connectMsg));
          });
          ws.on("close", () => {
            eventEmitter.emit("socket", {
              type: "socketConnection",
              connected: false,
              connectionInfo,
            });
          });
          ws.on("error", (error) =>
            eventEmitter.emit("system", {
              type: "error",
              error: error,
              connectionInfo,
            })
          );
          ws.on("message", (data) => {
            data = JSON.parse(data);
            switch (data.cmd) {
              case typeCmdID.CONNECTED:
                eventEmitter.emit("system", {
                  type: "socketConnection",
                  connected: true,
                  connectionInfo,
                });
                setInterval(sendPing, 20 * 1000, ws);
                break;
              case typeCmdID.PONG:
                break;
              case typeCmdID.RECEIVEDCHAT:
                for (let msg of data.bdy) {
                  const stringJSON = ["profile", "extras"];
                  const stringDate = ["ctime", "utime", "msgTime"];
                  msg = convertType(msg, stringJSON, "JSON");
                  msg = convertType(msg, stringDate, "Date");
                  msg["connectionInfo"] = connectionInfo;
                  eventEmitter.emit("chat", msg);
                }
                break;
            }
          });
        } catch (error) {
          eventEmitter.emit("system", {
            type: "error",
            error: error,
            connectionInfo,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function createConnectMsg(chatChannelId, accessToken) {
  return {
    ver: "2",
    cmd: typeCmdID.CONNECT,
    svcid: "game",
    cid: chatChannelId,
    bdy: {
      uid: null,
      devType: 2001,
      accTkn: accessToken,
      auth: "READ",
    },
    tid: 1,
  };
}

function sendPing(ws) {
  ws.send(JSON.stringify({ ver: "2", cmd: typeCmdID.PING }));
}

export default connectChat;
