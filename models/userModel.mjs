import { sql } from "../dbConnection.mjs";

export const getUserByEmail = async (email) => {
  const [existingUser] = await sql`
      SELECT * FROM users 
      WHERE email = ${email}
      `;
  return existingUser;
};

export const createUser = async (newUser) => {

  if(!newUser.role){
  newUser.role = "user"; // default user role value
  }

  const [user] = await sql`
    INSERT INTO users ${sql(newUser, "user_name", "email", "password", "role")}
    returning *
  `;

  return user;
};


export const getUserById = async (id) => {
  const [existingUser] = await sql`
  SELECT * FROM users 
  WHERE id = ${id}
  `;
return existingUser;
}

