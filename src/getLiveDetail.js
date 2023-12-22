import request from "./request.js";
import convertType from "./convertType.js";

/**
 * @typedef {Object} liveDetail
 * @property {?number} liveId
 * @property {?string} liveTitle
 * @property {?string} status
 * @property {?string} liveImageUrl
 * @property {?string} defaultThumbnailImageUrl
 * @property {?number} concurrentUserCount
 * @property {?number} accumulateCount
 * @property {?Date} openDate
 * @property {?Date} closeDate
 * @property {?string} chatChannelId
 * @property {?string} categoryType
 * @property {?string} liveCategory
 * @property {?string} liveCategoryValue
 * @property {?boolean} chatActive
 * @property {?string} chatAvailableGroup
 * @property {?boolean} paidPromotion
 * @property {?string} chatAvailableCondition
 * @property {?number} minFollowerMinute
 * @property {?livePlaybackInfo} livePlaybackJson
 * @property {?liveChannelInfo} channel
 * @property {?livePollingStatus} livePollingStatusJson
 */

/**
 * @typedef {Object} livePlaybackInfo
 * @property {?livePlaybackMeta} meta
 * @property {?livePlaybackServiceMeta} serviceMeta
 * @property {?livePlaybackLive} live
 * @property {?Array<livePlaybackApi>} api
 * @property {?Array<livePlaybackMedia>} media
 * @property {?livePlaybackThumbnail} thumbnail
 * @property {?livePlaybackMultiview} multiview
 */

/**
 * @typedef {Object} livePlaybackMeta
 * @property {?string} videoId
 * @property {?number} streamSeq
 * @property {?string} liveId
 * @property {?boolean} paidLive
 * @property {?Object} cdnInfo
 * @property {?boolean} p2p
 */

/**
 * @typedef {Object} livePlaybackCDNInfo
 * @property {?string} cdnType
 * @property {?boolean} zeroRating
 */

/**
 * @typedef {Object} livePlaybackServiceMeta
 * @property {?string} contentType
 */

/**
 * @typedef {Object} livePlaybackLive
 * @property {Date} start
 * @property {Date} open
 * @property {?boolean} timeMachine
 * @property {?string} status
 */

/**
 * @typedef {Object} livePlaybackApi
 * @property {?string} name
 * @property {?string} path
 */

/**
 * @typedef {Object} livePlaybackMedia
 * @property {?string} mediaId
 * @property {?string} protocol
 * @property {?string} path
 * @property {?string} latency
 * @property {?Array<Object>} encodingTrack
 */

/**
 * @typedef {Object} livePlaybackThumbnail
 * @property {?string} snapshotThumbnailTemplate
 * @property {?Array<string>} types
 */

/**
 * @typedef {Array} livePlaybackMultiview
 */

/**
 * @typedef {Object} liveChannelInfo
 * @property {?string} channelId
 * @property {?string} channelName
 * @property {?string} channelImageUrl
 * @property {?boolean} verifiedMark
 */

/**
 * @typedef {Object} livePollingStatus
 * @property {?string} status
 * @property {?boolean} isPublishing
 * @property {?string} playableStatus
 * @property {?number} trafficThrottling
 * @property {?number} callPeriodMilliSecond
 */

/**
 * @param {string} uuid
 * @returns {Promise<liveDetail>}
 * @throws {Error}
 */
function getLiveDetail(uuid) {
  return new Promise(async (resolve, reject) => {
    try {
      let apiResponse = await request.get(
        `https://api.chzzk.naver.com/service/v1/channels/${uuid}/live-detail`
      );
      if (apiResponse.ok) {
        const stringJSON = ["livePlaybackJson", "livePollingStatusJson"];
        const dateJSON = [
          "openDate",
          "closeDate",
          "livePlaybackJson.live.start",
          "livePlaybackJson.live.open",
        ];
        apiResponse = JSON.parse(apiResponse.body).content;
        if (!apiResponse) reject("live does not exist");
        apiResponse = convertType(apiResponse, stringJSON, "JSON");
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

export default getLiveDetail;
