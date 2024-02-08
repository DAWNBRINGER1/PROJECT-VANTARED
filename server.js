import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import criminalRoutes from './routes/criminalRoute.js'
import categoryRoutes from "./routes/categoryRoute.js";


// database
import connectDB from "./config/db.js";


//configure env
dotenv.config();




//databse config
connectDB();




//rest object
const app = express();



//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));




// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/criminal", criminalRoutes);


  //PORT
  const PORT = process.env.PORT || 8080;

  //run listen
  app.listen(8080, () => {
    console.log(
      `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
        .white
    );
  });