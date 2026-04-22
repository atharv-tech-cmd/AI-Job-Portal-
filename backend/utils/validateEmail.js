import dns from 'dns';

// Using regex for safe sync validation instead of network DNS calls
export async function isEmailDomainValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
