import Router from "express";
import {checkValidation, generateUrlValidator} from "../validators/Url.validator.js"
import { generateUrl } from "../controllers/Url.controller.js";

const router = Router();

router.post("/generate-url", generateUrlValidator, checkValidation, generateUrl);

export default router;