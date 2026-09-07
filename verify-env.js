// Simple script to verify environment variables are loaded
import "dotenv/config";

console.log('=== Environment Variable Verification ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET (first 10 chars):', process.env.JWT_SECRET?.substring(0, 10) || 'Not loaded');
console.log('NMS_PORTAL_PIN:', process.env.NMS_PORTAL_PIN);
console.log('DATABASE_URL (first 30 chars):', process.env.DATABASE_URL?.substring(0, 30) || 'Not loaded');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

// Check if required variables are present
const requiredVars = ['JWT_SECRET', 'NMS_PORTAL_PIN', 'DATABASE_URL'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  process.exit(1);
} else {
  console.log('✅ All required environment variables are loaded');
}