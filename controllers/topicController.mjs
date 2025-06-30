import {
  getAllTopicsM,
  getTopicByIdM,
  addTopicM,
  addVoteM,
  deleteTopicM,
  resetVotesM

} from "../models/topicModel.mjs";

// 1. View a list of all topics, implement term search in title and description
export const getAllTopics = async (req, res) => {
  try {
    let {search, page, limit } = req.query;
    
    //Pagination validation
    if (page && limit) {
      if (page < 1 || limit < 1 || !Number(page) || !Number(limit)) {
        res.status(400).json({
          status: "error",
          message: "Ivalid page or limit value",
        });
      }
    }

    //calculate offset
    let offset = (page - 1) * limit;

    if (isNaN(offset)) {
      offset = undefined;
    }

    const result = await getAllTopicsM(search, limit, offset);
    res.status(200).json({
      status: "success",
      totalVotes: result.totalVotes?.sum,
      data: result.topicList
    });
  } catch (error) {
    res.status(500).json({
      status: error,
      message: error.message,
    });
  }
};


// 2. Retrieve details of a specific topic (votes of all options of the topic)
export const getTopicById = async (req, res) => {
  try {
    const retrievedTopic = await getTopicByIdM(req.params.id);

    if (!retrievedTopic) {
      return res.status(404).json({ status: "404 error", message: "Topic not found" });
    }

    res.status(200).json({
      status: "success",
      data: retrievedTopic,
    });
  } catch (err) {
    res.status(500).json({ status: "500 error", message: err.message });
  }
};


// 3. Add a new topic
export const addTopic = async (req, res) => {
  try {
    const topicfromReq = req.body;
    const newTopic = await addTopicM(topicfromReq);
    res.status(201).json({
      status: "success",
      data: newTopic,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// 4. Cast a vote
export const addVote = async (req, res) => {
  try {

    const id = req.params.id;
    const voteToAdd = req.body;
    const userId = req.user;

    const vote = await addVoteM(id, voteToAdd, userId);

    if (!vote) {
      res.status(404).json({
        status: "404 error",
        message: `Error?`,
      });
      return;
    }


    res.status(200).json({
      status: "success",
      message: "Vote was cast",
    });
  } catch (error) {
    res.status(500).json({
      status: "500 error",
      message: error.message,
    });
  }
  
}


// 5. Delete a topic.
export const deleteTopic = async (req, res) => {
  try {
    const id = req.params.id;
    const topic = await deleteTopicM(id);

    if (!topic) {
      res.status(404).json({
        status: "404 error",
        message: `No such topic found to delete`,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Topic deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: "500 error",
      message: error.message,
    });
  }
};

// 6. Delete a topic.
export const resetVotes = async (req, res) => {
  try {
    const id = req.params.id;
    const topic = await resetVotesM(id);

    if (!topic) {
      res.status(404).json({
        status: "404 error",
        message: `Cannot reset. Votes count is equal to 0`,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Topic votes reset",
    });
  } catch (error) {
    res.status(500).json({
      status: "500 error",
      message: error.message,
    });
  }
};

