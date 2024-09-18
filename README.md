# Chzzk SDK <img src="https://img.shields.io/static/v1?label=code&message=Node.js&color=green" alt="">

## Install

```sh
npm install chzzk-sdk
```

## Features

### HLS & LLHLS

```javascript
import { getHLS, getLLHLS } from "chzzk-sdk";

const channelID = '9381e7d6816e6d915a44a13c0195b202'
const HLS = await getHLS(channelID)
const LLHLS = await getLLHLS(channelID)
```

| Arguments    | Type     | Description        |
| :----------- | :------- | :----------------- |
| `Channel ID` | `string` | Chzzk Channel ID |

#### Output

```javascript
{
  video: {
    '1080p': 'https://livecloud.pstatic.net/.....m3u8',
    '720p': 'https://livecloud.pstatic.net/.....m3u8',
    '480p': 'https://livecloud.pstatic.net/.....m3u8',
    '360p': 'https://livecloud.pstatic.net/.....m3u8',
    '144p': 'https://livecloud.pstatic.net/.....m3u8'
  }
}
```

### Live Detail

```javascript
import { getLiveDetail } from "chzzk-sdk";

const channelID = '9381e7d6816e6d915a44a13c0195b202'
const liveDetail = await getLiveDetail(channelID)
```

| Arguments    | Type     | Description        |
| :----------- | :------- | :----------------- |
| `Channel ID` | `string` | Chzzk Channel ID |
