import dns from 'dns';

export async function isEmailDomainValid(email) {
  try {
    const domain = email.split('@')[1];
    return new Promise((resolve) => {
      dns.resolveMx(domain, (err, records) => {
        if (err || !records || records.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (err) {
    return false;
  }
}
