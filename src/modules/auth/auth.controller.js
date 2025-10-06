const asyncHandler = require("../../middlewares/asyncHandler");
const { registerUser, loginUser, getProfile } = require("./auth.service");

const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    message: "User created",
    user: { id: user.id, email: user.email },
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json(result);
});

const me = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user.id);
  res.json(profile);
});

module.exports = { register, login, me };
