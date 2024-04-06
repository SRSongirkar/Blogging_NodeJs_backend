const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const userData = req.body; //input

    const user = await authService.registerUser(userData); //processing

    //Registration is successful
    res.status(201).json({
      message: "User registered successfully",
      userId: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const userData = req.body;

    const { token, userId } = await authService.loginUser(userData);

    res.status(200).json({
      message: "User logged in successfully",
      token,
      userId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const someData = async (req, res) => {
  res.send("Hurray, You just accessed a private endpoint");
};

module.exports = { register, login, someData };
