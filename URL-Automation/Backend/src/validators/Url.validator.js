import { body, validationResult } from "express-validator";

export function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0].msg,
    });
  }
  next();
}

export const generateUrlValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is Required")
    .isLength({ min: 2 })
    .withMessage("Name must be atleast 3 character"),

  body("company").trim().notEmpty().withMessage("Company name is Required"),

  body("video")
    .notEmpty()
    .withMessage("Please select a video category")
    .isIn([
      "wazzuppapdemo",
      "rxpl",
      "ludoRx3",
      "soccer",
      "RxPL-Demo",
      "DocTalkQuiz",
    ])
    .withMessage("Invalid video selection"),
];
