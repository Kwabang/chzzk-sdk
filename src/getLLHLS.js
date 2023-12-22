import request from "./request.js";
import getLiveDetail from "./getLiveDetail.js";
import * as m3u8Parser from "m3u8-parser";

/**
 * @typedef {Object} resultOfHLS
 * @property {string} audio
 * @property {Object.<string,string>} video
 */

/**
 * @param {string} channelID
 * @param {boolean} [verbose=false]
 * @returns {Promise<resultOfHLS>}
 * @throws {Error}
 */
function getLLHLS(channelID, verbose = false) {
  return new Promise(async (resolve, reject) => {
    try {
      const liveDetail = await getLiveDetail(channelID);
      if (liveDetail?.livePlaybackJson?.live?.status === "STARTED") {
        const mediaData = liveDetail.livePlaybackJson.media;
        const isLLHLS = (element) => element.mediaId === "LLHLS";
        const indexOfLLHLS = mediaData.findIndex(isLLHLS);
        if (verbose) {
          resolve(mediaData[indexOfLLHLS]);
        } else {
          const llhlsPath = mediaData[indexOfLLHLS].path;
          const absoluteLLHLSPath = getAbsoluteURLPath(llhlsPath);
          const m3u8Response = await request.get(llhlsPath);
          if (m3u8Response.ok) {
            const parser = new m3u8Parser.Parser();
            parser.push(m3u8Response.body);
            parser.end();
            const parsedManifest = parser.manifest;
            let result = {};
            const audioPlaylists = parsedManifest.mediaGroups.AUDIO;
            const videoPlaylists = parsedManifest.playlists;
            const audio =
              absoluteLLHLSPath +
              "/" +
              audioPlaylists[Object.keys(audioPlaylists)[0]]["audio.stream"]
                .uri;
            result.audio = audio;
            result.video = {};
            for (const key of videoPlaylists) {
              result.video[key.attributes.RESOLUTION.height + "p"] =
                absoluteLLHLSPath + "/" + key.uri;
            }
            resolve(result);
          }
        }
      } else {
        reject("Channel is offline");
      }
    } catch (error) {
      reject(error);
    }
  });
}

function getAbsoluteURLPath(url) {
  url = url.split("/");
  url = url.slice(0, -3);
  url = url.join("/");
  return url;
}

export default getLLHLS;
