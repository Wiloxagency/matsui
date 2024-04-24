import axios from "axios";
import { Router, Request, Response } from "express";

// New Router instance
const router = Router();

// Home routes
router.get("/", (req: Request, res: Response) => {
  // console.log("THIS RUNS");

  axios
    .get("https://jsonplaceholder.typicode.com/posts/1")
    .then((response) => {
      // console.log(response.data);
      res.json(response.data);
    })
    .catch((error) => console.log(error));
});

export default router;
