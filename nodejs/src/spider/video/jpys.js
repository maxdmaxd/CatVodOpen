import {load} from 'cheerio';
import CryptoJS from 'crypto-js';
import axios from "axios";
 

let url = 'https://www.cfkj86.com';

 
   


async function init(inReq, _outResp) {
    return {};
}

async function request(reqUrl,headers) {
        let resp = await axios({url:reqUrl ,
            headers: headers===undefined?{
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            }:headers
        });
        return resp.data;

}

async function home(inReq, _outResp) {
    let classes = [{
        type_id: '1',
        type_name: '电影',
    },{
        type_id: '2',
        type_name: '剧集',
    },{
        type_id: '3',
        type_name: '综艺',
    },{
        type_id: '4',
        type_name: '动漫',
    }];
    return JSON.stringify({
        class: classes,
    });
}


async function category(inReq, _outResp) {
    const tid = inReq.body.id;
    let pg = inReq.body.page;
    if (pg <= 0) pg = 1;
    const html = await request(`${url}/vod/show/id/${tid}/page/${pg}`);
    let videos = [];
    const picArray = html.match(/"vodPic\\":\\"(https?:\/\/[^"]+)"/gs)
    const $ = load(html)
    let i = 0;
    for (const it of $('div.movie-ul .content-card')) {
        const a = $(it).find('a')[0]
        const name = $(a).find('.title')[0]
        const img = picArray[i].replace(/\\/g,'').replace('"vodPic":','').replace(/"/g,'')
        videos.push({
            vod_id: a.attribs.href,
            vod_name: name.children[0].data,
            vod_pic: img,
        })
        i++
    }

    const hasMore = videos.length > 0;
    const pgCount = hasMore ? parseInt(pg) + 1 : parseInt(pg);
    return JSON.stringify({
        page: parseInt(pg),
        pagecount: pgCount,
        limit: 24,
        total: 24 * pgCount,
        list: videos,
    });
}

async function detail(inReq, _outResp) {
    const id = inReq.body.id;
    const html = await request(`${url}${id}`);
    const $ =load(html)
    var vod = {
        vod_id: id,
        vod_name: $('h1').text().trim(),
    };
    let playFroms = [];
    let playUrls = [];
    const temp = [];
    let playlist=$('div.main-list-sections__BodyArea-sc-8bb7334b-2 .listitem')
    for (const it of playlist) {
        const a = $(it).find('a')[0]
        temp.push(a.children[0].data+'$'+a.attribs.href)
    }
    playFroms.push('不知道倾情打造');
    vod.vod_name='不知道带你看美女啦!'
    playUrls.push(temp.join('#'));
    vod.vod_play_from = playFroms.join('$$$');
    vod.vod_play_url = playUrls.join('$$$');
    return JSON.stringify({
        list: [vod],
    });
}


async function play(inReq, _outResp) {
    const id = inReq.body.id;
    const pid = id.split('/')[3]
    const nid = id.split('/')[5]
    const t = new Date().getTime()
    const signkey = 'id='+pid+'&nid='+nid+'&key=cb808529bae6b6be45ecfab29a4889bc&t='+t
    const key = CryptoJS.SHA1(CryptoJS.MD5(signkey).toString()).toString()
    const relurl = url+'/api/mw-movie/anonymous/v1/video/episode/url?id='+pid+'&nid='+nid
    const html = await request(relurl, {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'deviceId': Math.random().toString(36).substr(2, 9),
    'sign': key,
    't': t
    })
    return JSON.stringify({
        url:html.data.playUrl
    })

}


async function search(inReq, _outResp) {
    const wd = inReq.body.wd;
    const pg = inReq.body.page;
    const t = new Date().getTime()
    //keyword=你&pageNum=1&pageSize=12&type=false&key=cb808529bae6b6be45ecfab29a4889bc&t=1722904806016
    const signkey = 'keyword='+wd+'&pageNum='+pg+'&pageSize=12&type=false&key=cb808529bae6b6be45ecfab29a4889bc&t='+t
    const key = CryptoJS.SHA1(CryptoJS.MD5(signkey).toString()).toString()
    let html = await request(`${url}/api/mw-movie/anonymous/video/searchByWordPageable?keyword=${wd}&pageNum=${pg}&pageSize=12&type=false`,{
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'deviceId': Math.random().toString(36).substr(2, 9),
    'sign': key,
    't': t
    });
    const list = html.data.list
    let videos = [];
    list.forEach((it)=>{
        videos.push({
            vod_id: '/detail/'+it.vodId,
            vod_name: it.vodName,
            vod_pic: it.vodPic
        });
    })
    return JSON.stringify({
        list: videos,
    });
}

async function test(inReq, outResp) {
    try {
        const printErr = function (json) {
            if (json.statusCode && json.statusCode === 500) {
                console.error(json);
            }
        };
        const prefix = inReq.server.prefix;
        const dataResult = {};
        let resp = await inReq.server.inject().post(`${prefix}/init`);
        dataResult.init = resp.json();
        printErr(resp.json());
        resp = await inReq.server.inject().post(`${prefix}/home`);
        dataResult.home = resp.json();
        printErr(resp.json());
        if (dataResult.home.class.length > 0) {
            resp = await inReq.server.inject().post(`${prefix}/category`).payload({
                id: dataResult.home.class[0].type_id,
                page: 1,
                filter: true,
                filters: {},
            });
            dataResult.category = resp.json();
            printErr(resp.json());
            if (dataResult.category.list.length > 0) {
                resp = await inReq.server.inject().post(`${prefix}/detail`).payload({
                    id: dataResult.category.list[0].vod_id, // dataResult.category.list.map((v) => v.vod_id),
                });
                dataResult.detail = resp.json();
                printErr(resp.json());
                if (dataResult.detail.list && dataResult.detail.list.length > 0) {
                    dataResult.play = [];
                    for (const vod of dataResult.detail.list) {
                        const flags = vod.vod_play_from.split('$$$');
                        const ids = vod.vod_play_url.split('$$$');
                        for (let j = 0; j < flags.length; j++) {
                            const flag = flags[j];
                            const urls = ids[j].split('#');
                            for (let i = 0; i < urls.length && i < 2; i++) {
                                resp = await inReq.server
                                    .inject()
                                    .post(`${prefix}/play`)
                                    .payload({
                                        flag: flag,
                                        id: urls[i].split('$')[1],
                                    });
                                dataResult.play.push(resp.json());
                            }
                        }
                    }
                }
            }
        }
        resp = await inReq.server.inject().post(`${prefix}/search`).payload({
            wd: '爱',
            page: 1,
        });
        dataResult.search = resp.json();
        printErr(resp.json());
        return dataResult;
    } catch (err) {
        console.error(err);
        outResp.code(500);
        return {err: err.message, tip: 'check debug console output'};
    }
}

export default {
    meta: {
        key: 'jinpai',
        name: '金牌影视',
        type: 3,
    },
    api: async (fastify) => {
        fastify.post('/init', init);
        fastify.post('/home', home);
        fastify.post('/category', category);
        fastify.post('/detail', detail);
        fastify.post('/play', play);
        fastify.post('/search', search);
        fastify.get('/test', test);
    },
};
