import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'sabji_jwt_secret_2026';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function getUserFromRequest(request) {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return null;
  return verifyToken(header.split(' ')[1]);
}
