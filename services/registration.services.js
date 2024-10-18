const db = require("../db");

const generateAlphanumericId = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports.newUsercreation = async (userInformation) => {
  const {
    UserEmail,
    UserPassword,
    UserFirstName,
    UserLastName,
    UserPhone,
    UserState,
    UserCity,
    UserAddress,
  } = userInformation;

  const UserID = generateAlphanumericId(12);

  try {
    // Check if user exists by email or phone
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE UserEmail = ? OR UserPhone = ?",
      [UserEmail, UserPhone]
    );

    // If user exists, return an appropriate message
    if (existingUser.length > 0) {
      return {
        message: "Email or phone number already exists",
        success: false,
      };
    }

    // If user does not exist, create the new user
    const insertResult = await db.query(
      "INSERT INTO users(UserID, UserEmail, UserPassword, UserFirstName, UserLastName, UserPhone, UserState, UserCity, UserAddress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        UserID,
        UserEmail,
        UserPassword,
        UserFirstName,
        UserLastName,
        UserPhone,
        UserState,
        UserCity,
        UserAddress,
      ]
    );

    // If the insert was successful, return a success message
    if (insertResult[0].affectedRows > 0) {
      return {
        message: "New user created successfully",
        success: true,
      };
    } else {
      return {
        message: "Failed to create user",
        success: false,
      };
    }
  } catch (error) {
    // Log the error and return a response
    console.log("error", error);
    return {
      message: "An error occurred during user creation",
      success: false,
      error: error.message, // Include error message for better debugging
    };
  }
};

module.exports.userLogin = async (userInformation) => {
  const { UserEmail, UserPassword } = userInformation;

  try {
    const [user] = await db.query(
      "SELECT * FROM users WHERE UserEmail = ? AND UserPassword = ?",
      [UserEmail, UserPassword]
    );
    if (user.length > 0) {
      return user[0];
    } else {
      return { error: "Invalid email or password" };
    }
  } catch (error) {
    throw error;
  }
};

module.exports.forgotPassword = async (userInformation) => {
  const { UserEmail, UserPassword } = userInformation;

  try {
    const [result] = await db.query(
      "UPDATE users SET UserPassword = ? WHERE UserEmail = ?",
      [UserPassword, UserEmail]
    );

    if (result.affectedRows > 0) {
      return { success: true, message: "Password updated successfully" };
    } else {
      return { success: false, message: "Invalid email address" };
    }
  } catch (error) {
    console.log("Error updating password:", error);
    throw error; // Propagate the error for the caller to handle
  }
};

module.exports.getTotalUserCount = async () => {
  try {
    const [allUsersCount] = await db.query(
      `SELECT COUNT(*) AS TotalUsers FROM users`
    );
    return allUsersCount[0].TotalUsers;
  } catch (error) {
    throw error;
  }
};
