import express from "express";
import {
  getAllTopics,
  getTopicById,
  deleteTopic,
  addTopic,
  resetVotes,
  addVote
} from "../controllers/topicController.mjs";
import validate from "../validators/validate.mjs";
import validateNewTopic from "../validators/newTopic.mjs";
import { protect, allowAcessTo } from "../controllers/authController.mjs";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllTopics)
  .post(protect, allowAcessTo("admin"), validateNewTopic, validate, addTopic);
router
  .route("/:id")
  .get(protect, getTopicById)
  .delete(protect, allowAcessTo("admin"), deleteTopic)
  .post(protect, addVote);
router.route("/:id/reset").delete(protect, allowAcessTo("admin"), resetVotes);
export default router;

/*
user login
{
  "email": "testuser1@test.lt",
  "password": "pass1"
}

admin login
{
  "email": "testadmin1@test.lt",
  "password": "admin1"
}
*/
