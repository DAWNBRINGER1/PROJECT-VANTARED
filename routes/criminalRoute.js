import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCriminalRecordController,
  criminalCategoryController,
  criminalCountController,
  criminalFiltersController,
  criminalListController,
  criminalPhotoController,
  deletecriminalController,
  getCriminalRecordController,
  getSingleRecordController,
  realtedcriminalController,
  searchcriminalController,
  updatecriminalController,
} from "../controllers/criminalController.js";

 
const router = express.Router();

//routes
router.post(
  "/create-criminal-record",
  requireSignIn,
  isAdmin,
  createCriminalRecordController
);

//routes
router.put(
  "/update-criminal/:pid",
  requireSignIn,
  isAdmin,
  updatecriminalController
);

//get criminals
router.get("/get-criminal", getCriminalRecordController);

//single criminal
router.get("/get-criminal/:slug", getSingleRecordController);

//get photo
router.get("/criminal-photo/:pid", criminalPhotoController);

//delete rcriminal
router.delete("/delete-criminal/:pid", deletecriminalController);

//filter criminal
router.post("/criminal-filters", criminalFiltersController);

//criminal count
router.get("/criminal-count", criminalCountController);

//criminal per page
router.get("/criminal-list/:page", criminalListController);

//search criminal
router.get("/search/:keyword", searchcriminalController);

//similar criminal
router.get("/related-criminal/:pid/:cid", realtedcriminalController);

//category wise criminal
router.get("/criminal-category/:slug", criminalCategoryController);

export default router;
