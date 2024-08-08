 
 

import alist from './spider/pan/alist.js';
import _13bqg from './spider/book/13bqg.js';

import copymanga from './spider/book/copymanga.js';
import laobaigs from './spider/book/laobaigs.js';
import bengou from './spider/book/bengou.js';
import baozimh from './spider/book/baozimh.js';
import bookan from './spider/book/bookan.js';

import push from './spider/video/push.js';
import douban from './spider/video/douban.js';
import live from './spider/video/liveb.js';
import bili from './spider/video/bili.js';
import pansearch from './spider/video/pansearch.js';
import upyun from './spider/video/upyun.js';
import wogg from './spider/video/wogg.js';
import qupan from './spider/video/qupan.js';
import yingso from './spider/video/yingso.js';
import libvio from './spider/video/libvio.js';

import lyapp from './spider/video/lyapp.js';
 
 
 
 
import qkpanso from './spider/video/qkpanso.js';
 
 
const spiders = [douban,live,bili,wogg,qupan,libvio,lyapp,push,copymanga,laobaigs,bengou,baozimh,bookan];
const spiderPrefix = '/spider';

/**
 * A function to initialize the router.
 *
 * @param {Object} fastify - The Fastify instance
 * @return {Promise<void>} - A Promise that resolves when the router is initialized
 */
export default async function router(fastify) {
    // register all spider router
    spiders.forEach((spider) => {
        const path = spiderPrefix + '/' + spider.meta.key + '/' + spider.meta.type;
        fastify.register(spider.api, { prefix: path });
        console.log('Register spider: ' + path);
    });
    /**
     * @api {get} /check 检查
     */
    fastify.register(
        /**
         *
         * @param {import('fastify').FastifyInstance} fastify
         */
        async (fastify) => {
            fastify.get(
                '/check',
                /**
                 * check api alive or not
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    reply.send({ run: !fastify.stop });
                }
            );
            fastify.get(
                '/config',
                /**
                 * get catopen format config
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    const config = {
                        video: {
                            sites: [],
                        },
                        read: {
                            sites: [],
                        },
                        comic: {
                            sites: [],
                        },
                        music: {
                            sites: [],
                        },
                        pan: {
                            sites: [],
                        },
                        color: fastify.config.color || [],
                    };
                    spiders.forEach((spider) => {
                        let meta = Object.assign({}, spider.meta);
                        meta.api = spiderPrefix + '/' + meta.key + '/' + meta.type;
                        meta.key = 'nodejs_' + meta.key;
                        const stype = spider.meta.type;
                        if (stype < 10) {
                            config.video.sites.push(meta);
                        } else if (stype >= 10 && stype < 20) {
                            config.read.sites.push(meta);
                        } else if (stype >= 20 && stype < 30) {
                            config.comic.sites.push(meta);
                        } else if (stype >= 30 && stype < 40) {
                            config.music.sites.push(meta);
                        } else if (stype >= 40 && stype < 50) {
                            config.pan.sites.push(meta);
                        }
                    });
                    reply.send(config);
                }
            );
        }
    );
}
