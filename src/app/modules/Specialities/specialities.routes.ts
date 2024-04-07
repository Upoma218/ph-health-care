import { UserRole } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { SpecialitiesController } from "./specialities.controller";
import { SpecialitiesValidtaion } from "./specialties.validation";

const router = express.Router();

// Task 1: Retrieve Specialities Data

/**
- Develop an API endpoint to retrieve all specialities data.
- Implement an HTTP GET endpoint returning specialities in JSON format.
- ENDPOINT: /specialities
*/
router.get("/", SpecialitiesController.getAllFromDB);

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialitiesValidtaion.create.parse(JSON.parse(req.body.data));
    return SpecialitiesController.inserIntoDB(req, res, next);
  }
);

// Task 2: Delete Specialities Data by ID

/**
- Develop an API endpoint to delete specialities by ID.
- Implement an HTTP DELETE endpoint accepting the speciality ID.
- Delete the speciality from the database and return a success message.
- ENDPOINT: /specialities/:id
*/

router.delete(
  "/:id",
  auth(UserRole.superAdmin, UserRole.admin),
  SpecialitiesController.deleteFromDB
);

export const SpecialitiesRoutes = router;
