import "dotenv/config";
import { connectMongo } from "../server/db/connection";
import { Appointment, Doctor, Patient, User } from "../server/models";
import bcrypt from "bcryptjs";

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");
  await connectMongo(uri);

  await Promise.all([
    Appointment.deleteMany({}),
    Doctor.deleteMany({}),
    Patient.deleteMany({}),
    User.deleteMany({}),
  ]);

  const doctors = [
    { name: "Dr. Asha Verma", specialization: "Cardiology", clinic: "CityCare Hospital", location: "Delhi" },
    { name: "Dr. Rohit Sharma", specialization: "Pediatrics", clinic: "Arogya Multispeciality", location: "Mumbai" },
    { name: "Dr. Meera Iyer", specialization: "Orthopedics", clinic: "Satya Health Clinic", location: "Bengaluru" },
    { name: "Dr. Vikram Singh", specialization: "General Medicine", clinic: "Seva Medical Center", location: "Pune" },
    { name: "Dr. Karan Patel", specialization: "Dermatology", clinic: "CityCare Hospital", location: "Ahmedabad" },
    { name: "Dr. Sangeeta Rao", specialization: "Cardiology", clinic: "Arogya Multispeciality", location: "Hyderabad" },
    { name: "Dr. Nisha Gupta", specialization: "Pediatrics", clinic: "Satya Health Clinic", location: "Jaipur" },
    { name: "Dr. Arjun Nair", specialization: "Orthopedics", clinic: "Seva Medical Center", location: "Kochi" },
    { name: "Dr. Pooja Deshmukh", specialization: "General Medicine", clinic: "CityCare Hospital", location: "Nagpur" },
    { name: "Dr. Anil Kapoor", specialization: "Dermatology", clinic: "Arogya Multispeciality", location: "Chandigarh" },
  ];

  const patients = [
    "Aarav Kumar","Priya Sharma","Rohit Mehta","Kavya Joshi","Ananya Reddy","Mohit Jain","Sunita Desai",
    "Ishaan Patel","Neha Verma","Sachin Rao","Aditi Nair","Vikas Singh","Pooja Gupta","Rahul Khanna",
    "Simran Kaur","Manish Agarwal","Ritu Malhotra","Nikhil Joshi","Ananya Mukherjee","Karan Kapoor",
    "Sneha Iyer","Aakash Gupta","Swati Sharma","Harsh Vardhan","Sanya Arora","Amit Jain","Krishna Rao",
    "Divya Menon","Prateek Saxena","Rhea Desai"
  ];

  const passwordHash = await bcrypt.hash("password123", 10);

  const doctorUsers = await Promise.all(
    doctors.map((d) => User.create({ name: d.name, email: d.name.replace(/\s+/g, ".").toLowerCase()+"@example.com", role: "doctor", passwordHash }))
  );
  const doctorModels = await Promise.all(
    doctorUsers.map((u, i) =>
      Doctor.create({ userId: u._id, specialization: doctors[i].specialization, clinic: doctors[i].clinic, location: doctors[i].location, availability: [
        { dayOfWeek: 1, start: "09:00", end: "13:00" },
        { dayOfWeek: 3, start: "09:00", end: "13:00" },
        { dayOfWeek: 5, start: "09:00", end: "13:00" },
        { dayOfWeek: 2, start: "15:00", end: "18:00" },
        { dayOfWeek: 4, start: "15:00", end: "18:00" },
      ] })
    )
  );

  const patientUsers = await Promise.all(
    patients.map((p, i) => User.create({ name: p, email: `user${i+1}@example.com`, role: "patient", passwordHash }))
  );
  const patientModels = await Promise.all(
    patientUsers.map((u, i) => Patient.create({ userId: u._id, location: ["Delhi","Mumbai","Bengaluru","Pune"][i%4], urgencyLevel: (i%5)+1 }))
  );

  console.log(`Seeded ${doctorModels.length} doctors and ${patientModels.length} patients`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
