var mysql = require('mysql');
var topics_log_sql = require('../database/sql/topics_log');
var db_config = require('../database/config');
var db = require('../database/query');

/**
 * 添加一个主题
 * @param req
 * @param res
 * @param next
 */
function addTopicLog(req, callback) {
    var param = req;
    db.queryArgs(topics_log_sql.create, [param.topic_id, param.message, new Date().getTime()/1000], function (error, result) {
        console.log(error);
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

function allByName(req, callback){
    var result = {};
    db.queryArgs(topics_log_sql.selectAll,req.query.name, function (error, rows) {
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

module.exports = {
    add: addTopicLog,
    all: allByName
};