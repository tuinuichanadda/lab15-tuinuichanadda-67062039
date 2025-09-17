import express from "express";
import morgan from 'morgan';
import studentRoutesV2 from "./routes/studentRoutesV2";

const app = express();
//Middleware
app.use(express.json());//ถ้าไม่ใส่ middleware นี้ req.body จะ ไม่ถูก parse
app.use(morgan('dev'));// ใช้ morgan ในโหมด "dev" (แสดง log แบบสั้นและมีสี)

app.use("/api/v2/students", studentRoutesV2);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
