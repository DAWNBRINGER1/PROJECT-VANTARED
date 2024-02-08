import criminalModel from "../models/criminalsModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs/promises";
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config();

export const createCriminalRecordController = async (req, res) => {
  try {

    const { criminal, description, category } = req.body;
       console.log(req.body)
    if (!criminal || !description || !category) {
      return res.status(500).send({ error: "criminal, description, and category are Required" });
    }

    // if (photo && photo.size > 1000000) {
    //   return res.status(500).send({ error: "photo is Required and should be less than 1mb" });
    // }

    // if (photo && photo.filename) {
    //   const uploadDirectory = "uploads";
    //   const imagePath = `${uploadDirectory}/${photo.filename}`;
    
      const criminalRecord = new criminalModel({
        ...req.body,
        slug: slugify(criminal),
        // photoPath: imagePath,
      });
    
      // if (photo) {
      //   await fs.writeFile(imagePath, photo.buffer);
      // }
    
      await criminalRecord.save();
    
      res.status(201).send({
        success: true,
        message: "Criminal record Created Successfully",
        criminalRecord,
      });
    } 
  
    catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in creating Criminal record",
    });
  }
};


//
//get all Record
export const getCriminalRecordController = async (req, res) => {
  try {
    const criminal = await criminalModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: criminal.length,
      message: "ALl criminal records were successfully",
      criminal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting criminal",
      error: error.message,
    });
  }
};

export const getSingleRecordController = async (req, res) => {
  try {
    const criminal = await criminalModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single criminal Fetched",
      data: { criminal },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single criminal Record",
      error: error.message,
    });
  }
};

// get photo
export const criminalPhotoController = async (req, res) => {
  try {
    const criminal = await criminalModel
      .findById(req.params.pid)
      .select("photo");
    if (criminal.photo.data) {
      res.set("Content-type", criminal.photo.contentType);
      return res.status(200).send(criminal.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deletecriminalController = async (req, res) => {
  try {
    await criminalModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "criminal Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting criminal",
      error,
    });
  }
};

//upate criminala
export const updatecriminalController = async (req, res) => {
  try {
    console.log(req.fields);
    const { criminal, description, category } = req.body;
    console.log(req.body);
    const { photo } = req.files || {};

    //alidation
    switch (true) {
      case !criminal:
        return res.status(500).send({ error: "criminal is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });

      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const criminals = await criminalModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.body, slug: slugify(criminal) },
      { new: true }
    );
    if (photo) {
      criminals.photo.data = fs.readFileSync(photo.path);
      criminals.photo.contentType = photo.type;
    }
    await criminals.save();
    res.status(201).send({
      success: true,
      message: "criminal Updated Successfully",
      criminals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Upadte criminal",
    });
  }
};

// filters
export const criminalFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const criminals = await criminalModel.find(args);
    res.status(200).send({
      success: true,
      criminals,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering criminals",
      error,
    });
  }
};

// criminal count
export const criminalCountController = async (req, res) => {
  try {
    const total = await criminalModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in criminal count",
      error,
      success: false,
    });
  }
};

// criminal list base on page
export const criminalListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const criminals = await criminalModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      criminals,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search criminal
export const searchcriminalController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await criminalModel
      .find({
        $or: [
          { criminal: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search criminal API",
      error,
    });
  }
};

// similar criminals
export const realtedcriminalController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const criminals = await criminalModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      criminals,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related criminal",
      error,
    });
  }
};

// get prdocyst by catgory
export const criminalCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const criminals = await criminalModel
      .find({ category })
      .populate("category");
    res.status(200).send({
      success: true,
      category,
      criminals,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting criminals",
    });
  }
};
