import { stringSimilarity } from "string-similarity-js";


export function evaluatePasswordStrength(username , password) {
  let score = 0;
  let feedback = [];

  // Existing length check
  if (password.length >= 12) {
      score += 200;
  } else if (password.length >= 10) {
      score += 100;
  } else {
      score += 50;
  }
  
  // Existing character category check
  let categories = 0;
  if (/[A-Z]/.test(password)) categories++;
  if (/[a-z]/.test(password)) categories++;
  if (/\d/.test(password)) categories++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) categories++;
  
  if (categories === 4) {
      score += 200;
  } else if (categories === 3) {
      score += 150;
  } else if (categories === 2) {
      score += 100;
  } else {
      score += 50;
  }
  
  let additionalScore = 0;

  const commonWords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome'];
  if (!commonWords.some(word => password.toLowerCase().includes(word))) {
      additionalScore += 30;
      feedback.push("Password doesn't contain obvious common words");
  } else {
      feedback.push("Password contains commonly used words");
  }

  if (username && username.length > 0) {
      const similarity = stringSimilarity(password.toLowerCase(), username.toLowerCase());
      if (similarity < 0.5) {
          additionalScore += 25;
          feedback.push("Password is sufficiently different from the username");
      } else {
          feedback.push("Password is too similar to the username");
      }
  }

  const patterns = [
      /\d{3,}/,  // Three or more consecutive digits
      /[a-zA-Z]{3,}/,  // Three or more consecutive letters
      /[@#$%^&*]{3,}/  // Three or more consecutive special characters
  ];
  if (!patterns.some(pattern => pattern.test(password))) {
      additionalScore += 25;
      feedback.push("Password doesn't contain predictable patterns");
  } else {
      feedback.push("Password contains predictable patterns");
  }

  //entropy
  const uniqueChars = new Set(password).size;
  const entropy = Math.log2(Math.pow(uniqueChars, password.length));
  const entropyScore = Math.min(20, Math.floor(entropy / 2));
  additionalScore += entropyScore;
  feedback.push(`Entropy score: ${entropyScore}/20`);

  // Add the additional score (max 100)
  score += Math.min(100, additionalScore);

  return { score, feedback };
}