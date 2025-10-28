import "dotenv/config";
import { connectMongo } from "../server/db/connection";
import { User } from "../server/models";

async function run(){
  const uri = process.env.MONGODB_URI;
  if(!uri){ console.error('MONGODB_URI not set'); process.exit(1); }
  await connectMongo(uri);
  // Fix doctor email double dot
  const doc = await User.findOne({ name: /Dr. Asha Verma/i });
  if(doc){
    console.log('Before:', doc.email);
    doc.email = 'dr.asha.verma@example.com';
    doc.isVerified = true;
    await doc.save();
    console.log('Updated doctor email to', doc.email);
  }
  // Mark all seeded users verified for convenience
  await User.updateMany({ email: /@example.com$/ }, { $set: { isVerified: true } });
  console.log('Marked example.com users verified');
  process.exit(0);
}
run().catch(e=>{console.error(e); process.exit(1)});
