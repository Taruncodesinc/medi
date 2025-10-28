import "dotenv/config";
import { connectMongo } from "../server/db/connection";
import { User, Doctor, Patient } from "../server/models";

async function run(){
  const uri = process.env.MONGODB_URI;
  if(!uri){
    console.error('MONGODB_URI not set in env');
    process.exit(1);
  }
  await connectMongo(uri);

  const docUser = await User.findOne({ role: 'doctor' }).lean();
  const patUser = await User.findOne({ role: 'patient' }).lean();

  console.log('--- Seeded accounts ---');
  if(docUser){
    console.log(`Doctor email: ${docUser.email}`);
    console.log(`Doctor id: ${docUser._id}`);
    console.log(`Password: password123`);
  } else {
    console.log('No doctor user found');
  }

  if(patUser){
    console.log(`Patient email: ${patUser.email}`);
    console.log(`Patient id: ${patUser._id}`);
    console.log(`Password: password123`);
  } else {
    console.log('No patient user found');
  }

  process.exit(0);
}

run().catch(e=>{console.error(e); process.exit(1);});
