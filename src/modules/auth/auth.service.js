const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");

async function findRoleByName(name) {
  return prisma.role.findUnique({ where: { name } });
}

async function registerUser({ name, email, password, role }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("EMAIL_TAKEN");

  const roleRow = await findRoleByName(role);
  if (!roleRow) throw new Error("ROLE_NOT_FOUND");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, roleId: roleRow.id },
  });
  return user;
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role.name },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },
  };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });
  if (!user) throw new Error("NOT_FOUND");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    createdAt: user.createdAt,
  };
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
