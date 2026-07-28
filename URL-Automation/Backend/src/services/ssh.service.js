import { Client } from "ssh2";
import fs from "fs";

/**
 * Opens a single SSH connection using credentials from environment
 * variables (never hardcoded). Returns a connected Client instance
 * that the caller is responsible for closing (conn.end()).
 */
export function connect() {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn
      .on("ready", () => resolve(conn))
      .on("error", (err) => reject(err))
      .connect({
        host: process.env.SSH_HOST,
        username: process.env.SSH_USER,
        privateKey: fs.readFileSync(process.env.SSH_PRIVATE_KEY_PATH),
      });
  });
}

/**
 * Runs a single shell command over an already-open connection and
 * resolves with { stdout, stderr, code }. Rejects only on a genuine
 * connection/stream error — a non-zero exit code is NOT rejected here,
 * the caller decides what a failing exit code means for their case
 * (e.g. `nginx -t` failing is expected and handled, not a crash).
 */
export function execCommand(conn, command) {
  return new Promise((resolve, reject) => {
    conn.exec(command, (err, stream) => {
      if (err) return reject(err);

      let stdout = "";
      let stderr = "";

      stream
        .on("close", (code) => resolve({ stdout, stderr, code }))
        .on("data", (data) => (stdout += data.toString()))
        .stderr.on("data", (data) => (stderr += data.toString()));
    });
  });
}

/**
 * Reads a remote file's full contents as a UTF-8 string, using SFTP
 * (a sub-protocol of SSH built for file transfer — more reliable for
 * file contents than parsing `cat` output through exec).
 */
export function readRemoteFile(conn, remotePath) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);

      const chunks = [];
      const stream = sftp.createReadStream(remotePath);

      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      stream.on("error", reject);
    });
  });
}

/**
 * Writes a full string as the new contents of a remote file over SFTP.
 * This OVERWRITES the file — the caller must pass the complete final
 * text (original content + new block), not just the new block.
 */
export function writeRemoteFile(conn, remotePath, content) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);

      const stream = sftp.createWriteStream(remotePath);
      stream.on("close", resolve);
      stream.on("error", reject);
      stream.end(content, "utf-8");
    });
  });
}
