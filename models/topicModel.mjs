import { sql } from "../dbConnection.mjs";

// 1. View a list of all topics + search and pagination
export const getAllTopicsM = async (search, limit, offset) => {
  if (search) {
    // <-- Search
    const searchString = `%${search}%`;
    console.log(searchString);
    const topicList = await sql`
      SELECT * FROM topics
      WHERE LOWER(title) LIKE LOWER(${searchString})
      OR LOWER(description) LIKE LOWER(${searchString})
    `;

    return { topicList };
  } else {
    // <-- No search
    const [totalVotes] = await sql`
    SELECT SUM(votes.vote_amount) FROM topics
    JOIN options
    On topics.id = options.topic_id
    LEFT JOIN votes
    ON options.id = votes.option_id
    `;

    const topicList = await sql`
    select *
    from topics
     ${
       // <-- Pagination
       limit !== undefined && offset !== undefined
         ? sql`LIMIT ${limit} OFFSET ${offset}`
         : sql``
     }
    `;

    return { totalVotes, topicList };
  }
};

// 2. Retrieve details of a specific topic (vote count from all options of the topic)
export const getTopicByIdM = async (id) => {
  const [topicVotes] = await sql`
  SELECT t.id AS topic_id, t.title,
         COALESCE(SUM(v.vote_amount), 0) AS total_votes
  FROM topics t
  JOIN options o ON o.topic_id = t.id
  LEFT JOIN votes v ON v.option_id = o.id
  WHERE t.id = ${id}
  GROUP BY t.id, t.title;
`;

  return topicVotes;
};

// 3. Add a new topic
export const addTopicM = async (newTopic) => {
  console.log(newTopic);
  const { title, description, options } = newTopic;
  console.log(title);
  console.log(description);
  console.log(options);

  const [topic] = await sql`
  INSERT INTO topics (title, description)
  VALUES (${title}, ${description})
  RETURNING id, title, description
`;

  const topicId = topic.id;
  console.log(topicId);

  const insertedOptions = [];

  for (let i = 0; i < options.length; i++) {
    const label = `Option ${String.fromCharCode(65 + i)}`; // A, B, C...
    const [option] = await sql`
      INSERT INTO options (option_text, topic_id, option_label)
      VALUES (${options[i]}, ${topicId}, ${label})
      RETURNING id, option_text, option_label
    `;
    insertedOptions.push(option);
  }

  // Return the topic and its options
  return {
    topic,
    options: insertedOptions,
  };
};
// 4. Cast a vote
export const addVoteM = async (id, voteToAdd, user) => {
  const { option_label, vote_amount } = voteToAdd;
  const user_id = user.id;
  const topic_id = id;

  const [option] = await sql`
  SELECT options.id FROM topics
  JOIN options ON topics.id = options.topic_id
  LEFT JOIN votes ON options.id = votes.option_id
  WHERE topics.id = ${topic_id} AND options.option_label = ${option_label};
`;

  if (!option) {
  throw new Error(`Option ${option_label} does not exist for topic ${topic_id}`);
}

  const option_id = option.id;

  const [existingVote] = await sql`
  SELECT * FROM votes
  WHERE user_id = ${user_id} AND option_id = ${option_id};
`;

if (existingVote) {
  throw new Error(`User has already voted on ${option_label} for topic ${topic_id}`);
}


  const [vote] = await sql`
  INSERT INTO votes (user_id, option_id, vote_amount)
  VALUES (${user_id}, ${option_id}, ${vote_amount})
  RETURNING user_id, option_id, vote_amount
`;

  return vote;
};

// 5. Delete a topic.
export const deleteTopicM = async (id) => {
  const [topic] = await sql`
delete from topics
where topics.id = ${id}
returning *
`;
  return topic;
};

// 6. Reset topic votes.
export const resetVotesM = async (id) => {
  const [topic] = await sql`
DELETE FROM votes
WHERE option_id IN (
  SELECT id FROM options
  WHERE topic_id = ${id}
)

returning *
`;
  return topic;
};
