import getConnection from "../config/db";

const handleCreateUser = (fullName: string, email: string, address: string) => {
    // insert into database

    // return result
    console.log(">>> insert a new user");
};

const getAllUsers = async () => {
    const connection = await getConnection();

    // A simple SELECT query
    try {
        const [results, fields] = await connection.query(
            'SELECT * FROM `users`'
        );
        return results;
    } catch (err) {
        console.log(err);
        return [];
    }

};

export { handleCreateUser, getAllUsers };