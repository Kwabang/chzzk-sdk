import request from "./request.js";
import getLiveDetail from "./getLiveDetail.js";
import convertType from "./convertType.js";

/**
 * @typedef {Object} chatToken
 * @property {?string} accessToken
 * @property {?chatTokenTemporaryRestrict} temporaryRestrict
 * @property {?string} extraToken
 * @property {?string} chatChannelId
 */

/**
 * @typedef {Object} chatTokenTemporaryRestrict
 * @property {?boolean} temporaryRestrict
 * @property {?number} times
 * @property {?number} duration
 * @property {?Date} createdTime
 */
/**
 * @param {string} channelID
 * @returns {Promise<chatToken>}
 * @throws {Error}
 */
function getChatToken(channelID) {
  return new Promise(async (resolve, reject) => {
    try {
      const liveDetail = await getLiveDetail(channelID);
      let apiResponse = await request.get(
        `https://comm-api.game.naver.com/nng_main/v1/chats/access-token?channelId=${liveDetail.chatChannelId}&chatType=STREAMING`
      );
      if (apiResponse.ok) {
        const dateJSON = ["temporaryRestrict.createdTime"];
        apiResponse = JSON.parse(apiResponse.body).content;
        apiResponse = convertType(apiResponse, dateJSON, "Date");
        apiResponse.chatChannelId = liveDetail.chatChannelId;
        resolve(apiResponse);
      } else {
        reject("Fail to fetch Naver API");
      }
    } catch (error) {
      reject(error);
    }
  });
}

export default getChatToken;
