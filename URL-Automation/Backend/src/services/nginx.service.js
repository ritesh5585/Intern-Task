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

// maps a video dropdown value to its existing template's URL path.
// add a new entry here whenever a new video template is added in Nginx.
const VIDEO_TEMPLATES = {
  wazzuppapdemo: "/soumalya/indoco/wazzuppapdemo",
};

/**
 * The full automation, start to finish. Takes clean, validated input
 * from the controller and returns the generated URL on success —
 * throws a descriptive Error on any failure, which the controller's
 * try/catch turns into a clean error response.
 */
export async function generateNginxUrl({ name, company, video }) {
  const oldPath = VIDEO_TEMPLATES[video];
  if (!oldPath) {
    throw new Error(`Unknown video template: "${video}"`);
  }

  // build the new path from user input — this is where slugify earns its keep
  const newPath = `/${slugify(name)}/${slugify(company)}/${video}`;

  const conn = await connect();

  try {
    // 1. read the full current config
    const configText = await readRemoteFile(conn, CONFIG_PATH);

    // 2. find the existing template block for this video (never modified)
    const templateBlock = extractLocationBlock(configText, oldPath);

    // 3. build a brand-new block from the template, with the new path
    const newBlock = buildNewBlock(templateBlock, oldPath, newPath);

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

    return { url: `https://yourdomain.com${newPath}` };
  } finally {
    conn.end(); // always close the connection, whether we succeeded or threw
  }
}
