const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.googleAccessToken = decoded.googleAccessToken;
    req.googleRefreshToken = decoded.googleRefreshToken;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired' });
  }
};
