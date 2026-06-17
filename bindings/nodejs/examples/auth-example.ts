import type { DeviceId } from '../src/types';

// Example token validator
// Replace this with your actual authentication logic
export async function validateToken(
  token: string
): Promise<{ valid: boolean; deviceId?: DeviceId; scopes?: string[] }> {
  // For demo purposes, accept any non-empty token
  if (token && token.length > 0) {
    return {
      valid: true,
      deviceId: `device-${token.substring(0, 8)}`,
      scopes: ['*'] // Allow all collections
    };
  }

  return { valid: false };
}

// Example: JWT validation (uncomment and install jsonwebtoken)
/*
import jwt from 'jsonwebtoken';

export async function validateToken(
  token: string
): Promise<{ valid: boolean; deviceId?: DeviceId; scopes?: string[] }> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return {
      valid: true,
      deviceId: decoded.deviceId,
      scopes: decoded.scopes || ['*']
    };
  } catch (err) {
    return { valid: false };
  }
}
*/
