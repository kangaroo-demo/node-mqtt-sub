//topics_log SQL语句
module.exports= {
    create: 'insert into topics_log (topic_name, message, created_at) values (?,?,?)',
    selectAll: 'select * from topics_log  where topic_name = ? order by created_at desc'
};