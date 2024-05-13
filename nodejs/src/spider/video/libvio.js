// 自动从 地址发布页 获取&跳转url地址
import { Spider } from "../spider.js";
import req from '../../util/req.js';

import { load } from 'cheerio';

import pkg from 'lodash';
const { _ } = pkg;
import * as Ali from '../../util/ali.js';
import * as Quark from '../../util/quark.js';

const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 11; M2007J3SC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045714 Mobile Safari/537.36';

class LibvioSpider extends Spider {

    constructor() {
        super();
        // this.siteUrl = ;
    }

    getName() { return "🤟LIBO影视🤟" }

    getAppName() { return "LIBO影视" }

    getJSName() { return "libvio" }

    async request(reqUrl, agentSp) {
        var res = await req(reqUrl, {
            method: 'get',
            headers: {
                'User-Agent': agentSp || MOBILE_UA,
                'Referer': this.siteUrl
            },
        });
        return res.data;
    }
    
    // cfg = {skey: siteKey, ext: extend}
    async init(inReq, outResp) {
        // siteKey = cfg.skey;
        // siteType = cfg.stype;
        var html = await this.request('https://libvio.app');
        var $ = load(html);
        this.siteUrl = $('div.content-top > ul > li').find('a:first')[0].attribs.href;
        console.debug('libvio跳转地址 =====>' + this.siteUrl); // js_debug.log
    
        await Ali.initAli(inReq.server.db, inReq.server.config.ali);
        await Quark.initQuark(inReq.server.db, inReq.server.config.quark);
        return {};
    }
    
    async home(inReq, _outResp) {
        var html = await this.request(this.siteUrl);
        var $ = load(html);
        var class_parse = $('ul.stui-header__menu > li > a[href*=type]');
        var classes = [];
        classes = _.map(class_parse, (cls) => {
            var typeId = cls.attribs['href'];
            typeId = typeId.substring(typeId.lastIndexOf('/') + 1).replace('.html','');
            return {
                type_id: typeId,
                type_name: cls.children[0].data,
            };
        });
        var filterObj = {
            1:[{key:'area',name:'地区',value:[{n:'全部',v:''},{n:'中国大陆',v:'中国大陆'},{n:'中国香港',v:'中国香港'},{n:'中国台湾',v:'中国台湾'},{n:'美国',v:'美国'},{n:'法国',v:'法国'},{n:'英国',v:'英国'},{n:'日本',v:'日本'},{n:'韩国',v:'韩国'},{n:'德国',v:'德国'},{n:'泰国',v:'泰国'},{n:'印度',v:'印度'},{n:'意大利',v:'意大利'},{n:'西班牙',v:'西班牙'},{n:'加拿大',v:'加拿大'},{n:'其他',v:'其他'}]},{key:'year',name:'年份',value:[{n:'全部',v:''},{"n":"2024","v":"2024"},{n:'2023',v:'2023'},{n:'2022',v:'2022'},{n:'2021',v:'2021'},{n:'2020',v:'2020'},{n:'2019',v:'2019'},{n:'2018',v:'2018'},{n:'2017',v:'2017'},{n:'2016',v:'2016'},{n:'2015',v:'2015'},{n:'2014',v:'2014'},{n:'2013',v:'2013'},{n:'2012',v:'2012'},{n:'2011',v:'2011'},{n:'2010',v:'2010'}]},{key:'lang',name:'语言',value:[{n:'全部',v:''},{n:'国语',v:'国语'},{n:'英语',v:'英语'},{n:'粤语',v:'粤语'},{n:'闽南语',v:'闽南语'},{n:'韩语',v:'韩语'},{n:'日语',v:'日语'},{n:'法语',v:'法语'},{n:'德语',v:'德语'},{n:'其它',v:'其它'}]},{key:'by',name:'排序',value:[{n:'时间',v:'time'},{n:'人气',v:'hits'},{n:'评分',v:'score'}]}],
            2:[{key:'area',name:'地区',value:[{n:'全部',v:''},{n:'中国大陆',v:'中国大陆'},{n:'中国台湾',v:'中国台湾'},{n:'中国香港',v:'中国香港'},{n:'韩国',v:'韩国'},{n:'日本',v:'日本'},{n:'美国',v:'美国'},{n:'泰国',v:'泰国'},{n:'英国',v:'英国'},{n:'新加坡',v:'新加坡'},{n:'其他',v:'其他'}]},{key:'year',name:'年份',value:[{n:'全部',v:''},{"n":"2024","v":"2024"},{n:'2023',v:'2023'},{n:'2022',v:'2022'},{n:'2021',v:'2021'},{n:'2020',v:'2020'},{n:'2019',v:'2019'},{n:'2018',v:'2018'},{n:'2017',v:'2017'},{n:'2016',v:'2016'},{n:'2015',v:'2015'},{n:'2014',v:'2014'},{n:'2013',v:'2013'},{n:'2012',v:'2012'},{n:'2011',v:'2011'},{n:'2010',v:'2010'}]},{key:'lang',name:'语言',value:[{n:'全部',v:''},{n:'国语',v:'国语'},{n:'英语',v:'英语'},{n:'粤语',v:'粤语'},{n:'闽南语',v:'闽南语'},{n:'韩语',v:'韩语'},{n:'日语',v:'日语'},{n:'其它',v:'其它'}]},{key:'by',name:'排序',value:[{n:'时间',v:'time'},{n:'人气',v:'hits'},{n:'评分',v:'score'}]}],
            4:[{key:'area',name:'地区',value:[{n:'全部',v:''},{n:'中国',v:'中国'},{n:'日本',v:'日本'},{n:'欧美',v:'欧美'},{n:'其他',v:'其他'}]},{key:'year',name:'年份',value:[{n:'全部',v:''},{"n":"2024","v":"2024"},{n:'2023',v:'2023'},{n:'2022',v:'2022'},{n:'2021',v:'2021'},{n:'2020',v:'2020'},{n:'2019',v:'2019'},{n:'2018',v:'2018'},{n:'2017',v:'2017'},{n:'2016',v:'2016'},{n:'2015',v:'2015'},{n:'2014',v:'2014'},{n:'2013',v:'2013'},{n:'2012',v:'2012'},{n:'2011',v:'2011'},{n:'2010',v:'2010'},{n:'2009',v:'2009'},{n:'2008',v:'2008'},{n:'2007',v:'2007'},{n:'2006',v:'2006'},{n:'2005',v:'2005'},{n:'2004',v:'2004'}]},{key:'lang',name:'语言',value:[{n:'全部',v:''},{n:'国语',v:'国语'},{n:'英语',v:'英语'},{n:'粤语',v:'粤语'},{n:'闽南语',v:'闽南语'},{n:'韩语',v:'韩语'},{n:'日语',v:'日语'},{n:'其它',v:'其它'}]},{key:'by',name:'排序',value:[{n:'时间',v:'time'},{n:'人气',v:'hits'},{n:'评分',v:'score'}]}],
            27:[{key:'by',name:'排序',value:[{n:'时间',v:'time'},{n:'人气',v:'hits'},{n:'评分',v:'score'}]}],
            15:[{key:'area',name:'地区',value:[{n:'全部',v:''},{n:'日本',v:'日本'},{n:'韩国',v:'韩国'}]},{key:'year',name:'年份',value:[{n:'全部',v:''},{"n":"2024","v":"2024"},{n:'2023',v:'2023'},{n:'2022',v:'2022'},{n:'2021',v:'2021'},{n:'2020',v:'2020'},{n:'2019',v:'2019'},{n:'2018',v:'2018'},{n:'2017',v:'2017'},{n:'2016',v:'2016'},{n:'2015',v:'2015'},{n:'2014',v:'2014'},{n:'2013',v:'2013'},{n:'2012',v:'2012'},{n:'2011',v:'2011'},{n:'2010',v:'2010'}]},{key:'lang',name:'语言',value:[{n:'全部',v:''},{n:'国语',v:'国语'},{n:'英语',v:'英语'},{n:'粤语',v:'粤语'},{n:'闽南语',v:'闽南语'},{n:'韩语',v:'韩语'},{n:'日语',v:'日语'},{n:'其它',v:'其它'}]},{key:'by',name:'排序',value:[{n:'时间',v:'time'},{n:'人气',v:'hits'},{n:'评分',v:'score'}]}],
            16:[{key:'area',name:'地区',value:[{n:'全部',v:''},{n:'美国',v:'美国'},{n:'英国',v:'英国'},{n:'德国',v:'德国'},{n:'加拿大',v:'加拿大'},{n:'其他',v:'其他'}]},{key:'year',name:'年份',value:[{n:'全部',v:''},{"n":"2024","v":"2024"},{n:'2023',v:'2023'},{n:'2022',v:'2022'},{n:'2021',v:'2021'},{n:'2020',v:'2020'},{n:'2019',v:'2019'},{n:'2018',v:'2018'},{n:'2017',v:'2017'},{n:'2016',v:'2016'},{n:'2015',v:'2015'},{n:'2014',v:'2014'},{n:'2013',v:'2013'},{n:'2012',v:'2012'},{n:'2011',v:'2011'},{n:'2010',v:'2010'}]},{key:'lang',name:'语言',value:[{n:'全部',v:''},{n:'国语',v:'国语'},{n:'英语',v:'英语'},{n:'粤语',v:'粤语'},{n:'闽南语',v:'闽南语'},{n:'韩语',v:'韩语'},{n:'日语',v:'日语'},{n:'其它',v:'其它'}]},{key:'by',name:'排序',value:[{n:'时间',v:'time'},{n:'人气',v:'hits'},{n:'评分',v:'score'}]}]
        };
        return JSON.stringify({
            class: classes,
            filters: filterObj,
        });
    }
    
    async category(inReq, _outResp) {
        // tid, pg, filter, extend
        // if (pg <= 0 || typeof(pg) == 'undefined') pg = 1;
        let tid = inReq.body.id;
        let pg = inReq.body.page;
        let extend = inReq.body.filters;
    
        if(pg <= 0) pg = 1;
        var link = this.siteUrl + '/show/' + tid + '-' + (extend.area || '') + '-' + (extend.by || 'time') + '--' + (extend.lang || '') + '----' + pg + '---' + (extend.year || '') + '.html';
        var html = await this.request(link);
        var $ = load(html);
        var items = $('ul.stui-vodlist > li');
        let videos = _.map(items, (item) => {
            var a = $(item).find('a:first')[0];
            var remarks = $($(item).find('span.pic-text')[0]).text().trim();
            return {
                vod_id: a.attribs.href.replace(/.*?\/detail\/(.*).html/g, '$1'),
                vod_name: a.attribs.title,
                vod_pic: a.attribs['data-original'],
                vod_remarks: remarks || '',
            };
        });
        var hasMore = $('ul.stui-page__item > li > a:contains(下一页)').length > 0;
        var pgCount = hasMore ? parseInt(pg) + 1 : parseInt(pg);
        return JSON.stringify({
            page: parseInt(pg),
            pagecount: pgCount,
            limit: 24,
            total: 24 * pgCount,
            list: videos,
        });
    }
    
    async detail(inReq, _outResp) {
        const ids = !Array.isArray(inReq.body.id) ? [inReq.body.id] : inReq.body.id;
        const videos = [];
    
        for (const id of ids) {
            var html = await this.request(this.siteUrl + '/detail/' + id + '.html');
            var $ = load(html);
            var vod = {
                vod_id: id,
                vod_name: $('h1:first').text().trim(),
                vod_type: $('.stui-content__detail p:first a').text(),
                vod_actor: $('.stui-content__detail p:nth-child(3)').text().replace('主演：',''),
                vod_pic: $('.stui-content__thumb img:first').attr('data-original'),
                vod_remarks : $('.stui-content__detail p:nth-child(5)').text() || '',
                vod_content: $('span.detail-content').text().trim(),
            };
    
            // 原方法处理(后续要处理掉)
            var playMap = {};
            var tabs = $('div.stui-pannel__head > h3[class*=iconfont]');
            var playlists = $('ul.stui-content__playlist');

            // 去掉原方法中的 _.each处理.
            for (let i = 0; i < tabs.length; i++) {
                const tab = tabs[i];
                var from = tab.children[0].data;
                var list = playlists[i];
                list = $(list).find('a');
                for (const it of list) {
                    var title = it.children[0].data;
                    var playUrl = it.attribs.href;
        
                    if (title.length == 0) title = it.children[0].data.trim();
                    if (!playMap.hasOwnProperty(from)) {
                        playMap[from] = [];
                    }
        
                    // 夸克
                    if (from.includes('夸克')) {
                        var quark = await this.request(this.siteUrl + playUrl);
                        quark = quark.match(/r player_.*?=(.*?)</)[1];
                        var js = JSON.parse(quark);
                        var shareUrls = js.url;
                        // 请求集数
                        let p = await this.panDetail(shareUrls);
                        playMap[from].push(p.play_url);
                    } else {
                        playMap[from].push(title + '$' + playUrl);
                    }
                }
            }

            vod.vod_play_from = _.keys(playMap).join('$$$');
            var urls = _.values(playMap);
            var vod_play_url = _.map(urls, (urlist) => {
                return urlist.join('#');
            });
            vod.vod_play_url = vod_play_url.join('$$$');
            videos.push(vod);
        }
        return JSON.stringify({
            list: videos,
        });
    }
    
    async play(inReq, _outResp) {
        const tid = inReq.body.id;
        let flag = inReq.body.flag;
        let siteLink = this.siteUrl + tid;
        flag =  flag.trim()
        if (flag.includes('夸克')) {
            inReq.body.id = tid;
            inReq.body.flag = 'Quark-' + tid.split('*')[0];
            return super.play(inReq, _outResp);
        } else {
            var html = await this.request(siteLink);
            html = html.match(/r player_.*?=(.*?)</)[1];
            var js = JSON.parse(html);
            var url = js.url;
            var from = js.from;
            var next = js.link_next;
            var id = js.id;
            var nid = js.nid;

            let playUrl = '';
            let noAdurl = '';
            try {
                var paurl = await this.request(this.siteUrl +'/static/player/' + from + '.js');
                paurl = paurl.match(/ src="(.*?)'/)[1];
                var purl = paurl + url + '&next=' + next + '&id=' + id + '&nid=' + nid;
                if (!purl.startsWith('http')) purl = this.siteUrl + purl;
                playUrl = await this.request(purl);
                playUrl = playUrl.match(/var .* = '(.*?)'/)[1];

                noAdurl = await super.stringify({
                    request: inReq,
                    parse: 0,
                    url: playUrl,
                });
            } catch (error) {
                noAdurl = await super.stringify({
                    request: inReq,
                    parse: 1,
                    url: playUrl,
                });
            }
            
            return JSON.stringify({
                parse: 0,
                url: noAdurl,
                header: {
                    'User-Agent': MOBILE_UA,
                    'Referer': siteLink,
                }
            })
        }
    }
    
    async search(inReq, _outResp) {
        let pg = inReq.body.page;
        const wd = inReq.body.wd;
        let page = pg || 1;
        if (page == 0) page = 1;
    
        var data = (await this.request(this.siteUrl + '/index.php/ajax/suggest?mid=1&wd=' + wd + '&limit=50')).list;
        var videos = [];
        for (const vod of data) {
            videos.push({
                vod_id: vod.id,
                vod_name: vod.name,
                vod_pic: vod.pic,
                vod_remarks: '',
            });
        }
        return JSON.stringify({
            list: videos,
            limit: 50,
        });
    }
}

let spider = new LibvioSpider()

const routeHandlers = ['init', 'home', 'category', 'detail', 'play', 'search', 'test'];

const routes = {
    meta: {
        key: spider.getJSName(), name: spider.getName(), type: spider.getType(),
    }, 
    api: async (fastify) => {
        for (const handler of routeHandlers) {
            fastify.post(`/${handler}`, async (inReq, _outResp) => {
                return await spider[handler](inReq, _outResp);
            });
        }
        fastify.get('/proxy/:site/:what/:flag/:shareId/:fileId/:end', async (inReq, _outResp) => {
            return await spider.panProxy(inReq, _outResp);
        });
        fastify.get('/test', async (inReq, _outResp) => {
            return await spider.test(inReq, _outResp);
        });
    },
};

export default routes;