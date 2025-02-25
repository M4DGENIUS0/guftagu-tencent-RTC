const TLSSigAPIv2 = require("tls-sig-api-v2");
const dotenv = require("dotenv");

dotenv.config();

const SDKAppID = parseInt(process.env.SDK_APP_ID);
const SECRET_KEY = process.env.SECRET_KEY;

function genUserSig(userID) {
  try {
    let sig = new TLSSigAPIv2(SDKAppID, SECRET_KEY);
    return sig.genSig(userID, 604800); // 7 days validity
  } catch (err) {
    console.error("Error generating userSig:", err);
    return null;
  }
}

module.exports = { genUserSig };
