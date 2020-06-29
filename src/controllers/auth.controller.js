const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');

const register = catchAsync(async (req, res) => {
  const { user, uniqueCode } = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).json({ user, tokens, uniqueCode });
});

const registerOrganization = catchAsync(async (req, res) => {
  const { user, uniqueCode } = await userService.createOrganization(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).json({ user, tokens, uniqueCode });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.json({ user, tokens });
});

const loginOrg = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginOrganizationWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.json({ user, tokens });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  register,
  registerOrganization,
  login,
  loginOrg,
  refreshTokens,
};
