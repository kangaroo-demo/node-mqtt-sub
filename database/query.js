//数据库操作封装
var mysql = require('mysql');

var db_config = require('./config');

const pool = mysql.createPool(db_config.mysql);

function responseDoReturn(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: 1,
            msg: '操作失败'
        })
    } else {
        res.json(ret);
    }
}

/**
 * 不带占位符的SQL执行封装
 * @param sql [in] 要执行的SQL语句
 * @param callback [in] 回调函数
 */
function query(sql, callback) {
    pool.getConnection(function (error, connection) {
        if (error) {
            callback(error, null, null);
        } else {
            connection.query(sql, function (error, rows) {
                connection.release();
                callback(error, rows);
            })
        }
    })
}

/**
 * 带占位符的SQL执行封装
 * @param sql [in] 要执行的SQL语句
 * @param args [in] 占位符
 * @param callback [in] 回调函数
 */
function queryArgs(sql, args, callback) {
    pool.getConnection(function (error, connection) {
        if (error) {
            callback(error, null, null);
        } else {
            connection.query(sql, args, function (error, rows) {
                connection.release();
                callback(error, rows);
            })
        }
    })
}

module.exports = {
    query: query,
    queryArgs: queryArgs,
    doReturn: responseDoReturn
};