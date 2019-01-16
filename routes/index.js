var express = require('express');
var mqtt = require('mqtt');

var mqtt_config = require('../mqtt/mqtt_config');
var topic_model = require('../model/topic');
var topic_log_model = require('../model/topics_log');

var router = express.Router();
const client = mqtt.connect(mqtt_config.url, mqtt_config.options);

/**
 * 监听主题操作
 */
client.on('message', function (topic, message) {
    var data = {
        topic_id: topic,
        message: message.toString(),
    };
    // 添加一条记录
    topic_log_model.add(data, function (result) {
        if (result.code === 200) {
        }
    })
});

/**
 * 首页
 */
router.get('/', function(req, res, next) {
    var p = req.query.p ? Number(req.query.p) : 1;
    var limit = req.query.limit ? Number(req.query.limit) : 10;
    var data = {
        currentPage: p,
        totalPages: 0
    };
    // 获取总页数
    topic_model.count(limit, res, function (result) {
        data.totalPages = result

        var page_info = {
            m: (p-1) * limit,
            n: limit
        };
        // 查询当前页数据
        topic_model.limit(page_info, res, function (result) {
            if (result.code === 200) {
                res.render('index', {currentPage: data.currentPage,totalPages: data.totalPages, topics: result.data});
            }
        });
    });
});

/**
 * 添加一个订阅
 */
router.post('/addTopic', function (req, res) {

    var topic_name = req.body.name;
    var res = res;
    client.subscribe(topic_name,function (error) {
        if (!error) {
            topic_model.one(topic_name, function (result) {
                if (result.code === 200 && result.data.length > 0) {
                    let data = {
                        topic_status: 1,
                        topic_name: topic_name
                    };
                    topic_model.update(data, function (result) {
                        if (result.code === 200){
                            res.redirect('/');
                        }
                    })
                } else {
                    topic_model.add(req, res, function (result) {
                        if (result.code === 200) {
                            res.redirect('/');
                        }
                    })
                }
            });
        }
    });

});

/**
 * 取消订阅
 */
router.get('/unTopic', function (req, res) {
    var topic_name = req.query.name;
    var res = res;
    client.unsubscribe(topic_name,function (error) {
        if (!error) {
            let data = {
                topic_status: 0,
                topic_name: topic_name
            };
            topic_model.update(data, function (result) {
                if (result.code === 200) {
                }
            });
            res.redirect('/');
        }
    });

});

/**
 * 删除主题
 */
router.get('/delete', function (req, res) {
    topic_model.delete(req, function (result) {
        if(result.code === 200) {
            res.redirect('/');
        }
    })
});

/**
 * 查看主题日志
 */
router.get('/log',function (req, res) {
    topic_log_model.all(req, function (result) {
        res.render('log_lists', { topic_name: req.query.name, topics_log: result.data});
    })
});

/**
 * 搜索主题
 */
router.get('/s',function (req, res, next) {
   topic_model.one(req.query.name,function (result) {
       if (result.code === 200) {
           console.log(JSON.parse(JSON.stringify(result.data)));
           res.render('search',{topics: JSON.parse(JSON.stringify(result.data))});
       } else {
           res.redirect('/');
       }
   })
});

/**
 * 格式化json数据
 */
router.get('/f', function (req, res, next) {
    res.render('format',{msg:req.query.msg});
});

module.exports = router;
