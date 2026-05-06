import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied" })
  }
  const token = authHeader.split(" ")[1]
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified // { id, role }
    next()
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" })
  }
}

const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ message: "Forbidden: insufficient permissions" })
  }
  next()
}

export { verifyToken, requireRole }