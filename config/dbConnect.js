const { default: mongoose } = require("mongoose")

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/digitic')
        console.log('Database connected successfully')
    }
    catch (err) {
        console.log(err)
        throw new Error(err);
    }
}