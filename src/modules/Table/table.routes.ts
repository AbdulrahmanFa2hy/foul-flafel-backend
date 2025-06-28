import { Router } from "express";
import { UserRoles } from "../User/users.interface";
import { tableCtrl } from "./table.controller";
import asyncHandler from "express-async-handler";
import { isAuthenticated } from "../../middleware/auth.middleware";

const router = Router();

router
  .route("/")
  .post(isAuthenticated([UserRoles.MANAGER]), asyncHandler(tableCtrl.addTable))
  .get(
    isAuthenticated([UserRoles.MANAGER, UserRoles.CASHIER]),
    asyncHandler(tableCtrl.getAllTables)
  );

router
  .route("/:tableNumber")
  .patch(
    isAuthenticated([UserRoles.MANAGER]),
    asyncHandler(tableCtrl.updateTable)
  )
  .delete(
    isAuthenticated([UserRoles.MANAGER]),
    asyncHandler(tableCtrl.deleteTable)
  );

export const tableRoutes = router;
