import {
  connect,
  execCommand,
  readRemoteFile,
  writeRemoteFile,
} from "./ssh.service.js";
import { slugify } from "../utils/slugify.util.js";
import {
  extractLocationBlock,
  buildNewBlock,
} from "../utils/configParser.util.js";

const CONFIG_PATH = "/etc/nginx/sites-available/digitalerial";

const VIDEO_TEMPLATES = {
  "doctorday-demo": "/vikram-entero/doctorday-demo",
  rxpl: "/preeti-microlabs/rxpl",
  worldkidneyday: "/heteropharma/debashismajumdar/worldkidneyday",
  EpilepsySafetyTips: "/heteropharma/debashismajumdar/EpilepsySafetyTips",
  ludoRx3: "/supriya/jagsonpal/ludoRx3",
  soccer: "/divesh/lavue/soccer",
  "RxPL-Demo": "/Solitra/Shreyash/RxPL/Demo",
  doctorbirthday: "/akash-virbac/doctorbirthday",
  wazzuppapdemo: "/soumalya/indoco/wazzuppapdemo",
  DocTalkQuiz: "/mamiya-sun/DocTalkQuiz",
  chatbot: "/fdc/ravindra/chatbot",
  icreateimageguide: "/ankit/seagull/pharma/icreateimageguide",
  bhagwati1: "/bhagwati/Alkem_Taxim_Injection_22022024",
  bhagwati2: "/bhagwati/Safety_tips_SunPharma",
  bhagwati3: "/bhagwati/VIDEO",
  bhagwati4: "/bhagwati/Birthday_Video_With_Dr",
  bhagwati5: "/bhagwati/pavan_singham",
  bhagwati6: "/bhagwati/Rise_AV",
  bhagwati7: "/bhagwati/tablet_animation",
};

/**
 * The full automation, start to finish. Takes clean, validated input
 * from the controller and returns the generated URL on success —
 * throws a descriptive Error on any failure, which the controller's
 * try/catch turns into a clean error response.
 *
 * dryRun mode (testing phase): still connects and READS the real
 * config, and still builds the real new block — this is exactly what
 * would be written. It just stops BEFORE the actual write/test/reload,
 * so you can see and verify the output without touching the live
 * server at all. Flip dryRun to false once you're confident the
 * generated block looks right.
 */
export async function generateNginxUrl({
  name,
  company,
  video,
  dryRun = false,
}) {
  const oldPath = VIDEO_TEMPLATES[video];
  if (!oldPath) {
    throw new Error(`Unknown video template: "${video}"`);
  }

  // NEW paths always follow ONE fixed convention, regardless of how
  // inconsistent the legacy paths in the config are. This keeps every
  // future generated URL predictable: /{name}-{company}/{videoKey}
  const newPath = `/${slugify(company)}/${slugify(name)}/${video}`;

  const conn = await connect();

  try {
    // 1. read the full current config
    const configText = await readRemoteFile(conn, CONFIG_PATH);

    // 2. find the existing template block for this video (never modified)
    const templateBlock = extractLocationBlock(configText, oldPath);

    // 3. build a brand-new block from the template, with the new path
    const newBlock = buildNewBlock(templateBlock, oldPath, newPath);

    const generatedUrl = `${process.env.PUBLIC_DOMAIN}${newPath}`;

    // ---- DRY RUN STOPS HERE — nothing below this line runs ----
    if (dryRun) {
      return {
        dryRun: true,
        url: generatedUrl,
        newPath,
        templateUsed: oldPath,
        templateBlock, // the original block we read from the server
        newBlock, // exactly what WOULD be appended, byte for byte
      };
    }

    // 4. append the new block to the END of the file — original stays untouched
    const updatedConfigText = `${configText}\n\n${newBlock}\n`;

    // 5. upload the full updated file back over SFTP
    await writeRemoteFile(conn, CONFIG_PATH, updatedConfigText);

    // 6. test syntax BEFORE reloading — never reload blindly
    const testResult = await execCommand(conn, "sudo nginx -t");
    if (testResult.code !== 0) {
      throw new Error(`nginx -t failed: ${testResult.stderr}`);
    }

    // 7. only reload if the test passed
    const reloadResult = await execCommand(conn, "sudo systemctl reload nginx");
    if (reloadResult.code !== 0) {
      throw new Error(`nginx reload failed: ${reloadResult.stderr}`);
    }

    return { dryRun: false, url: generatedUrl };
  } finally {
    conn.end(); // always close the connection, whether we succeeded or threw
  }
}
