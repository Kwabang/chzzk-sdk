import request from "./request.js";

/**
 * @typedef {?Array<string>} chatSessionServerList
 */

/**
 * @returns {Promise<chatSessionServerList>}
 * @throws {Error}
 */
function getChatSessionServerList() {
  return new Promise(async (resolve, reject) => {
    try {
      let apiResponse = await request.get(
        `https://api.mobilecore.naver.com/routing/getRouting?serviceId=game`
      );
      if (apiResponse.ok) {
        apiResponse = JSON.parse(apiResponse.body);
        resolve(apiResponse.result.sessionServerList);
      } else {
        reject("Fail to fetch Naver API");
      }
    } catch (error) {
      reject(error);
    }
  });
}

export default getChatSessionServerList;
