import "reflect-metadata";
import { AppDataSource } from "./database";
import app from "./app";

async function main(){

  await AppDataSource.initialize();

  console.log('Database was connected :crystal_ball:');

  app.listen(app.get('PORT'));

  console.log(`server is run on ${app.get('PORT')} :rocket:`);

} 

main();