// 处理库存的解析器文件
import stocks from '../db/stocks'

const stockResolvers = {
    Query: {
        stocks: () => {
            // console.log("运行", stocks)
            return stocks
        },
        stock1: (_, {id}) => {
            console.log("获取的id是: ", id)
            return stocks.find(stock => stock.id === id)
        }, 
        stock2: (_, args) => {
            console.log("获取的id是: ", args.id)
            return stocks.find(stock => stock.id === args.id)
        }, 
    },
    Mutation: {
        updateStock: (_, {stockId}) => {
            console.log(stockId)
            const stock = stocks.find(stock => stock.id === stockId)
            console.log("查找 stock")
            if(!stock){
                throw new Error('没有找到这个库存的id')
            }
            stock.qty -= 10
            return stock
        }
    }
}
export default stockResolvers