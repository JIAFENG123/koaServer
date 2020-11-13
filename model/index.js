const { Customer } = require('./customer')
// const { sequelize } = require('../db/initdb')
const { sequelize } = require('../db/initdb');
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.log('Unable to connect to the database', err)
    })

    ; (async () => {

        await sequelize.sync();
        // 这里是代码
        // const bob = await Customer.create({
        //     id: 1,
        //     name: 'bob',
        //     sex: 1,
        //     address: 'henan'
        // })
        // console.log(bob)
        // await bob.save()
        console.log('数据库初始化完成!');
        console.log(" ......................阿弥陀佛......................\n" +
            "                       _oo0oo_                      \n" +
            "                      o8888888o                     \n" +
            "                      88\" . \"88                     \n" +
            "                      (| -_- |)                     \n" +
            "                      0\\  =  /0                     \n" +
            "                   ___/‘---’\\___                   \n" +
            "                  .' \\|       |/ '.                 \n" +
            "                 / \\\\|||  :  |||// \\                \n" +
            "                / _||||| -卍-|||||_ \\               \n" +
            "               |   | \\\\\\  -  /// |   |              \n" +
            "               | \\_|  ''\\---/''  |_/ |              \n" +
            "               \\  .-\\__  '-'  ___/-. /              \n" +
            "             ___'. .'  /--.--\\  '. .'___            \n" +
            "         .\"\" ‘<  ‘.___\\_<|>_/___.’>’ \"\".          \n" +
            "       | | :  ‘- \\‘.;‘\\ _ /’;.’/ - ’ : | |        \n" +
            "         \\  \\ ‘_.   \\_ __\\ /__ _/   .-’ /  /        \n" +
            "    =====‘-.____‘.___ \\_____/___.-’___.-’=====     \n" +
            "                       ‘=---=’                      \n" +
            "                                                    \n" +
            "....................佛祖保佑 ,永无BUG...................");

    })();

module.exports = {
    Customer
}