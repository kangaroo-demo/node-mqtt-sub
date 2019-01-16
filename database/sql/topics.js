//topics SQL语句
module.exports= {
    create: 'insert into topics (name, status, created_at) values (?,?,?)',
    delete: 'delete from topics where name = ?',
    update: 'update topics set status = ? where name = ?',
    one: "select * from topics where name = ? ",
    all: 'select * from topics',
    count: 'select count(1) count from topics',
    limit: 'select * from topics limit ?,?'
};