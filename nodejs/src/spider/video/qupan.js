import req from '../../util/req.js';
import {load}from 'cheerio';
import {ua, init, detail0, proxy, play, test, isEmpty}from '../../util/pan.js';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';

let url = 'https://pan.funletu.com';

async function request(reqUrl, data) {
    let res = await req(reqUrl, {
        method: 'post',
        headers: {
            'User-Agent': ua,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
    });
    return res.data;
}

async function detail(inReq, _outResp) {
    const ids = !Array.isArray(inReq.body.id) ? [inReq.body.id] : inReq.body.id;
    const shareUrls = ids;
    const videos = [];
    for (const id of ids) {
        let vod = ({
            vod_id: id,
        });
        videos.push(await detail0(shareUrls, vod));
    }
    return {
        list: videos,
    };
}

async function parseHtmlList(pg, wd) {
    const params = {
        "style": "get",
        "datasrc": "search",
        "query": {
            "id": "",
            "datetime": "",
            "commonid": 1,
            "parmid": "",
            "fileid": "",
            "reportid": "",
            "validid": "",
            "searchtext": wd
        },
        "page": {
            "pageSize": 10,
            "pageIndex": pg
        },
        "order": {
            "prop": "id",
            "order": "desc"
        },
        "message": "请求资源列表数据"
    }
    const resp = await request(url + '/search', params);
    const items = resp.data;
    const videos = [];
    for (const item of items) {
        videos.push({
            vod_id: item.url.replace('?entry=funletu',''),
            vod_name: item.title,
            vod_pic: 'https://vip.helloimg.com/i/2024/05/08/663b0e4fae272.jpeg',
            vod_remarks: item.updatetime,
        });
    }
    const hasMore = !isEmpty(items);
    const pgCount = hasMore ? parseInt(pg) + 1 : parseInt(pg);
    return {
        page: parseInt(pg),
        pagecount: pgCount,
        list: videos,
    };
}

async function search(inReq, _outResp) {
    let pg = inReq.body.page;
    const wd = inReq.body.wd;
    if (pg <= 0) pg = 1;
    return parseHtmlList(pg, wd);
}

export default {
    meta: {
        key: 'qupan',
        name: '🎻趣盘搜🎻',
        type: 3,
    },
    api: async(fastify) => {
        fastify.post('/init', init);
        fastify.post('/detail', detail);
        fastify.post('/play', play);
        fastify.post('/search', search);
        fastify.get('/proxy/:site/:what/:flag/:shareId/:fileId/:end', proxy);
        fastify.get('/test', test);
    },
};
