'use server';

/**
 * @fileOverview Server Action for secure administration authentication.
 * Verification happens on the server to prevent password leaking to the client bundle.
 */

export async function authenticateAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Use environment variables for production security.
  // Fallback to constants only for initial local development.
  const targetEmail = process.env.ADMIN_EMAIL || 'admin@devogie.com';
  const targetPassword = process.env.ADMIN_PASSWORD || 'admin_secure_2025';

  if (email === targetEmail && password === targetPassword) {
    return { success: true };
  }

  return { success: false, message: 'Invalid credentials' };
}
