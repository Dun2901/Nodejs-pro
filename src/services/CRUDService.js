const connection = require("../config/database");

const getAllUsers = async () => {
  const [results, fields] = await connection.query("SELECT * FROM Users");
  return results;
};

const getUserById = async (id) => {
  let [results, fields] = await connection.query(` select * from Users where id = ?`, [id]);
  const user = results && results.length > 0 ? results[0] : {};

  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
};
