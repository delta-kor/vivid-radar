
# vivid-radar
**Vivid Radar** is a powerful tool written in TypeScript, designed to fetch and parse feed & media from various platforms in real-time, compatible with ```vivid``` system.

## Supported platforms
This project is designed to retrieve short-term data, with the maximum number of items varying across different platforms.
| Platform | Max Items |
|--|--|
| Twitter(X) | 50 |
| TikTok | - |
| Daum Cafe | 20 |
| Bstage | Infinity |

## Usage

### Twitter(X)

**Config**
| key | description |
|--|--|
| ```userId``` | Target user id |
| ```userName``` | Target user name |
| ```authToken``` | Twitter auth token (cookie) |
| ```userAgent``` | User agent (optional) |
| ```bearerToken``` | Request bearer token (optional) |
| ```queryId``` | Graphql Query Id (optional) |

**Example**
```javascript
import { TwitterClient } from 'vivid-radar';
const twitter = new TwitterClient({  
  userId: '1534717807518429186',  
  userName: 'CSR_offcl',  
  authToken: process.env.TWITTER_AUTH_TOKEN as string, // hex (length=40)
});
const feeds = await twitter.scrap();
```

---

### Daum Cafe

**Config**
| key | description |
|--|--|
| ```cafeId``` | Daum Cafe url id |
| ```boardId``` | Daum Cafe target board id |
| ```grpId``` | Daum Cafe group id |

**Example**
```javascript
import { DaumClient } from 'vivid-radar';
const daum = new DaumClient({
  cafeId: 'csr.official',
  boardId: 'ZDmo',
  grpId: '1ZKSg' // Can retrive from board iframe url
});
const feeds = await daum.scrap();
```

---

### Bstage

**Config**
| key | description |
|--|--|
| ```id``` | Bstage profile id |
| ```host``` | Bstage host |
| ```page``` | Feed page (Default: 1) |
| ```pageSize``` | Feed page size (Default: 20) |

**Example**
```javascript
import { BstageClient } from 'vivid-radar';
const bstage = new BstageClient({
  id: 'csr',
  host: 'csr.bstage.in',
});
const feeds = await bstage.scrap();
```

---

**Response**
```javascript
[
  {
	type: 'twitter',
    id: '1814944229346484598',
    account: 'CSR_offcl',
    title: '너 좀 나 닮았다?\n\n#첫사랑 #CSR #금희 #GEUMHEE',
    members: [],
    date: Date('2024-07-21T08:43:18.000Z'),
    media: [
      {
        type: 'image',
        url: 'https://pbs.twimg.com/media/GS_6JwAbQAAQBOG.jpg',
      },
      {
        type: 'image',
        url: 'https://pbs.twimg.com/media/GS_6Jv8bIAEWoAv.jpg',
      },
    ],
  },
  {
	type: 'bstage',
    id: '880074',
    account: 'csr.bstage.in',
    title: 'ねこしひょん😽',
    members: [],
    date: Date('2024-07-04T05:10:42.183Z'),
    media: [
      {
        type: 'video',
        thumbnail: 'https://image.static.bstage.in/cdn-cgi/image...',
        url: "https://media.static.bstage.in/csr/media/66862ea..."
      },
    ],
  },
  ...
]
```