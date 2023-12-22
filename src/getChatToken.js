import request from "./request.js";
import getLiveDetail from "./getLiveDetail.js";
import convertType from "./convertType.js";

/**
 * @typedef {Object} chatToken
 * @property {?string} accessToken
 * @property {?chatTokenTemporaryRestrict} temporaryRestrict
 * @property {?string} extraToken
 */

/**
 * @typedef {Object} chatTokenTemporaryRestrict
 * @property {?boolean} temporaryRestrict
 * @property {?number} times
 * @property {?number} duration
 * @property {?Date} createdTime
 */
/**
 * @param {string} uuid
 * @returns {Promise<chatToken>}
 * @throws {Error}
 */
function getChatToken(uuid) {
  return new Promise(async (resolve, reject) => {
    try {
      const liveDetail = await getLiveDetail(uuid);
      let apiResponse = await request.get(
        `https://comm-api.game.naver.com/nng_main/v1/chats/access-token?channelId=${liveDetail.chatChannelId}&chatType=STREAMING`
      );
      if (apiResponse.ok) {
        const dateJSON = ["temporaryRestrict.createdTime"];
        apiResponse = JSON.parse(apiResponse.body).content;
        apiResponse = convertType(apiResponse, dateJSON, "Date");
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
