const bars = [
    { id: 1 }
]
const foos = [
    {id: 'aaaa'}
]

const extendTypesResolvers = {
    Query: {
        bars(parent, args, context, info) {
            console.log(context)
            return bars
        },
        foos(parent, args, context, info){
            console.log(parent)
            return foos
        }
    }
}

export default extendTypesResolvers