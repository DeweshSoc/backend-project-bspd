import express from "express";
import { contactController } from "../controllers";


const router = express.Router();

router.post("/", contactController);

export const identificationRoute = router;
