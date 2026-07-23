const TLM = require("../models/tlm");
const SLM = require("../models/slm");
const FLM = require("../models/flm");
const MR = require("../models/mr");
const generateToken = require("../utils/auth.tokens");

/**
 * Tries to find a matching user across all 4 levels in parallel,
 * using the level-specific id field + Password.
 * Whichever collection returns a match tells us the "level".
 */
async function loginUser(id, password) {
  const [tlm, slm, flm, mr] = await Promise.all([
    TLM.findOne({ TlmId: id, Password: password }),
    SLM.findOne({ SlmId: id, Password: password }),
    FLM.findOne({ FlmId: id, Password: password }),
    MR.findOne({ MrId: id, Password: password }),
  ]);

  const match = tlm || slm || flm || mr;
  if (!match) {
    return null; // wrong id or wrong password — controller sends 401
  }

  const level = tlm ? "TLM" : slm ? "SLM" : flm ? "FLM" : "MR";
  const name = match.TlmName || match.SlmName || match.FlmName || match.MrName;
  const customId = match.TlmId || match.SlmId || match.FlmId || match.MrId;

  const token = generateToken({
    userId: match._id,
    level,
    customId,
  });

  return {
    token,
    user: {
      id: match._id,
      level,
      customId,
      name,
    },
  };
}

module.exports = { loginUser };
