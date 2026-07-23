const { loginUser } = require("../services/auth.service");

async function login(req, res) {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({
        success: false,
        message: "id and password are required",
      });
    }

    const result = await loginUser(id, password);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid id or password",
      });
    }

    return res.status(200).json({
      success: true,
    //   token: result.token,
      user: result.user, // { id, level, customId, name }
    });
  } catch (err) {
    console.error("Login failed:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}

module.exports = { login };
