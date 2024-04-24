import axios from "axios";
import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {

  axios
    .get("https://jsonplaceholder.typicode.com/posts/1")
    .then((response) => {
      // console.log(response.data);
      res.json(response.data);
    })
    .catch((error) => console.log(error));
});

export default router;
