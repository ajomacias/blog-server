import { DataSource } from 'typeorm';
import { Comentary, Post, Profile, User } from './feature';
import { DB } from './config'

const AppDataSource = new DataSource({
    username : DB.USER,
    password : DB.PASSWORD,
    host : DB.HOST,
    type : 'postgres',
    entities : [ User,Profile,Post,Comentary ],
    database : DB.DATABASE,
    logging : false,
    synchronize : true,
    
})


export { AppDataSource };