import { body, param } from "express-validator";
import validatorMiddleware from "../../middleware/validator.middleware";
import mealSchema from "./meal.schema";

class MealsValidation {
  createOne = [
    body("name")
      .notEmpty()
      .withMessage("name is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("name must be at least 3 characters long"),

    body("price").notEmpty().withMessage("price is required"),

    body("categoryId")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id"))
      .optional(),

    body("isAvailable")
      .isBoolean()
      .withMessage("isAvailable must be a boolean")
      .optional(),

    body("notes").isString().withMessage("notes must be a string").optional(),

    body("ingredients").isArray().withMessage("ingredients must be an array"),

    body("ingredients.*.stockItemId")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    body("ingredients.*.quantityUsed")
      .isNumeric()
      .withMessage("quantityUsed must be a number"),
    body("ingredients.*.unit").isString().withMessage("unit must be a string"),

    body("ingredients.*.stockName")
      .isString()
      .withMessage("stockName must be a string"),

    validatorMiddleware,
  ];

  updateOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    body("name")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage("name must be at least 2 characters long")
      .custom(async (val: string, { req }) => {
        const meal = await mealSchema.findOne({ name: val });
        if (meal && meal._id!.toString() !== req.params?.id.toString())
          throw new Error("Meal already exists");
        return true;
      }),

    body("price").optional(),

    body("categoryId")
      .optional()
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),

    body("isAvailable")
      .optional()
      .isBoolean()
      .withMessage("isAvailable must be a boolean"),

    body("notes").optional().isString().withMessage("notes must be a string"),

    body("ingredients")
      .optional()
      .isArray()
      .withMessage("ingredients must be an array"),

    body("ingredients.*.stockItemId")
      .optional()
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    body("ingredients.*.quantityUsed")
      .optional()
      .isNumeric()
      .withMessage("quantityUsed must be a number"),
    body("ingredients.*.unit")
      .optional()
      .isString()
      .withMessage("unit must be a string"),

    body("ingredients.*.stockName")
      .optional()
      .isString()
      .withMessage("stockName must be a string"),

    validatorMiddleware,
  ];

  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];

  deleteOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];
}

const mealsValidation = new MealsValidation();

export default mealsValidation;
