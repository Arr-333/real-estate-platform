import fs from "fs";
import path from "path";

/**
 * Handles file upload, update, and delete
 */
export async function saveFile(
  file,
  oldFilePath = "",
  folder = "user",
  deleteOnly = false
) {
  const uploadsDir = path.join(process.cwd(), "public", "pic", folder);

  // create folder if not exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // ✅ DELETE ONLY (for DELETE API)
  if (deleteOnly && oldFilePath) {
    try {
      const fullPath = path.join(process.cwd(), "public", oldFilePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log("Deleted:", fullPath);
      }
    } catch (err) {
      console.warn("Delete error:", err.message);
    }

    return "";
  }

  // ✅ NO NEW FILE → KEEP OLD
  if (!file || file.size === 0) {
    return oldFilePath || "";
  }

  // ✅ DELETE OLD FILE (only when new file comes)
  if (oldFilePath) {
    try {
      const oldPath = path.join(process.cwd(), "public", oldFilePath);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    } catch (err) {
      console.warn("Old delete error:", err.message);
    }
  }

  // ✅ SAVE NEW FILE
  const uniqueName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir, uniqueName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return `/pic/${folder}/${uniqueName}`;
}
