import { generate } from "voucher-code-generator";

function generateReferralCode(amount: number = 1): string[] {
  try {
    const codes = generate({
      count: amount,
      pattern: "####-####",
      charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    });
    return codes;
  } catch (err) {
    console.error(
      "[generateReferralCode.service@generateReferralCode]:",
      (err as Error).message
    );
    throw err;
  }
}

export { generateReferralCode };
