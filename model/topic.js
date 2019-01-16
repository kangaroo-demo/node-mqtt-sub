var mysql = require('mysql');
var topics_sql = require('../database/sql/topics');
var db_config = require('../database/config');
var db = require('../database/query');

/**
 * 添加一个主题
 * @param req
 * @param res
 * @param next
 */
function addTopic(req, res, callback) {
    var param = req.body || req.params;

    db.queryArgs(topics_sql.create, [param.name, 1, new Date().getTime()/1000], function (error, result) {
        if (!error) {
            result = {
                code: 200,
                msg: 'success'
            }
        } else {
            result = {
                code: 201,
                msg: 'error:' + error
            }
        }
        callback(result);
    });
}

/**
 * 查询一个主题
 * @param topic_name
 * @param callback
 */
function selectOne(topic_name, callback) {
    var result = {};
    db.queryArgs(topics_sql.one,topic_name,function (error, rows) {
        console.log(topic_name);
        if (!error) {
            result = {
                code: 200,
                msg: 'success',
                data: rows
            }
        } else {
            result = {
                code: 201,
                msg: 'error: ' + error
            }
        }
        callback(result);
    });
}

function updateTopic(req, callback) {
    var result = {};
    db.queryArgs(topics_sql.update, [req.topic_status, req.topic_name], function (error, rows) {
        if (!error) {
            result = {
                code: 200,
                msg: 'success'
            }
        } else {
            result = {
                code: 201,
                msg: 'error: ' + error,
            }
        }
        callback(result)
    })
}
/**
 * 删除一个主题
 * @param req
 * @param res
 * @param next
 */
function deleteTopic(req, callback) {
    var param = req.query;
    db.queryArgs(topics_sql.delete, param.name, function (error, result) {
        if (!error) {
            result = {
                code: 200,
                msg: 'success'
            }
        } else {
            result = {
                code: 201,
                msg: 'error: '+ error
            }
        }
        callback(result)
    })
}

function queryAll(req, res, callback) {
    var result = {};
    db.query(topics_sql.all, function (error, rows) {
        if (!error) {
            result = {
                code: 200,
                msg: 'success',
                data: rows
            }
        } else {
            result = {
                code: 201,
                msg: 'error: ' + error
            }
        }
        callback(result);
    })
}

function count(req, res, callback) {
    var result = 0;
    db.query(topics_sql.count, function (error, rows) {
        if (!error) {
            result = Math.ceil(rows[0].count/req);
        }
        console.log('count' + result)
        callback(result);
    });
}

function limitPages(req, res, callback) {
    var result = {};
    db.queryArgs(topics_sql.limit, [req.m,req.n], function (error, rows) {
        if (!error) {
            result = {
                code: 200,
                msg: 'success',
                data: rows
            }
        } else {
            result = {
                code: 201,
                msg: 'error: ' + error
            }
        }
        callback(result);
    });
}

module.exports = {
    add: addTopic,
    one: selectOne,
    update: updateTopic,
    delete: deleteTopic,
    all: queryAll,
    count: count,
    limit: limitPages
};