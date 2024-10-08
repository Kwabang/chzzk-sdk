import request from "./request.js";
import getLiveDetail from "./getLiveDetail.js";
import * as m3u8Parser from "m3u8-parser";

/**
 * @typedef {Object} resultOfHLS
 * @property {Object.<string,string>} video
 */

/**
 * @param {string} channelID
 * @param {boolean} [verbose=false]
 * @returns {Promise<resultOfHLS>}
 * @throws {Error}
 */
function getHLS(channelID, verbose = false) {
  return new Promise(async (resolve, reject) => {
    try {
      const liveDetail = await getLiveDetail(channelID);
      if (liveDetail?.livePlaybackJson?.live?.status === "STARTED") {
        const mediaData = liveDetail.livePlaybackJson.media;
        const isHLS = (element) => element.mediaId === "HLS";
        const indexOfHLS = mediaData.findIndex(isHLS);
        if (verbose) {
          resolve(mediaData[indexOfHLS]);
        } else {
          const hlsPath = mediaData[indexOfHLS].path;
          const absoluteHLSPath = getAbsoluteURLPath(hlsPath);
          const m3u8Response = await request.get(hlsPath);
          if (m3u8Response.ok) {
            const parser = new m3u8Parser.Parser();
            parser.push(m3u8Response.body);
            parser.end();
            const parsedManifest = parser.manifest;
            let result = {};
            const videoPlaylists = parsedManifest.playlists;
            result.video = {};
            for (const key of videoPlaylists) {
              result.video[key.attributes.RESOLUTION.height + "p"] =
                absoluteHLSPath + "/" + key.uri;
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

export default getHLS;
