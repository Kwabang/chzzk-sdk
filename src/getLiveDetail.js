import request from "./request.js";

function getLiveDetail(uuid) {
  return new Promise(async (resolve, reject) => {
    try {
      let apiResponse = await request.get(
        `https://api.chzzk.naver.com/service/v1/channels/${uuid}/live-detail`
      );
      if (apiResponse.ok) {
        const stringJSON = ["livePlaybackJson", "livePollingStatusJson"];
        apiResponse = JSON.parse(apiResponse.body).content;
        for (const key of stringJSON) {
          const keyExists = apiResponse.hasOwnProperty(key);
          if (keyExists) apiResponse[key] = JSON.parse(apiResponse[key]);
        }
      }
      resolve(apiResponse);
    } catch (error) {
      reject(error);
    }
  });
}

export default getLiveDetail;
