import { Router } from "express";
import {
  retrieveBalance,
  retrieveBoxesByUsernameAndBoxType,
} from "../services/user-services";

const userRouter = Router();

userRouter.get("/balance", async (req, res) => {
  try {
    await retrieveBalance();
  } catch (error) {
    console.error("Error while retrieving balance: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get("/boxes", async (req, res) => {
  try {
    const query = req.query;

    const username = query.username;
    const boxType = query.boxType;

    if (typeof username !== "string" || typeof boxType !== "string") {
      return res.status(400).json({
        error: "Query parameters 'username' and 'boxType' must be strings",
      });
    }

    const boxes = await retrieveBoxesByUsernameAndBoxType(username, boxType);

    return res.status(200).json({ boxes });
  } catch (error) {
    console.error("Error while retrieving boxes: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;
