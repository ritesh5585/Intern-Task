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

const CONFIG_PATH = "/etc/nginx/sites-available/digilateral";

const VIDEO_TEMPLATES = {
  rxpl: "/preeti-microlabs/rxpl",
  ludoRx3: "/supriya/jagsonpal/ludoRx3",
  soccer: "/divesh/lavue/soccer",
  "RxPL-Demo": "/Solitra/Shreyash/RxPL/Demo",
  wazzuppapdemo: "/soumalya/indoco/wazzuppapdemo",
  DocTalkQuiz: "/mamiya-sun/DocTalkQuiz",
};

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

  // NEW paths always follow ONE fixed convention
  const newPath = `/${slugify(company)}/${slugify(name)}/${video}`;

  const conn = await connect();

  try {
    const configText = await readRemoteFile(conn, CONFIG_PATH);

    const templateBlock = extractLocationBlock(configText, oldPath);

    const newBlock = buildNewBlock(templateBlock, oldPath, newPath);

    const generatedUrl = `${process.env.PUBLIC_DOMAIN}${newPath}`;

    // ---- DRY RUN STOPS HERE — nothing below this line runs ----
    if (dryRun) {
      return {
        dryRun: true,
        url: generatedUrl,
        newPath,
        templateUsed: oldPath,
        templateBlock,
        newBlock,
      };
    }

    const updatedConfigText = `${configText}\n\n${newBlock}\n`;

    await writeRemoteFile(conn, CONFIG_PATH, updatedConfigText);

    const testResult = await execCommand(conn, "sudo nginx -t");
    if (testResult.code !== 0) {
      throw new Error(`nginx -t failed: ${testResult.stderr}`);
    }

    const reloadResult = await execCommand(conn, "sudo systemctl reload nginx");
    if (reloadResult.code !== 0) {
      throw new Error(`nginx reload failed: ${reloadResult.stderr}`);
    }

    return { dryRun: false, url: generatedUrl };
  } finally {
    conn.end();
  }
}
