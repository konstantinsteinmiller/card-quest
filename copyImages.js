import fs from 'fs'
import path from 'path'

// --- Configuration ---
const SOURCE_DIR = './public/models/' // The path to scan
const DEST_DIR = './output_previews/400x400.webp'  // Where to save the renamed copies
const TARGET_FILE = 'preview_400x400.webp'

// ---------------------

/**
 * Recursively scans folders to find and copy specific preview images.
 */
function processFolders(dir) {
  // Create destination if it doesn't exist
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true })
  }

  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    if (item.isDirectory()) {
      const folderPath = path.join(dir, item.name)
      const folderName = item.name
      const sourceFilePath = path.join(folderPath, TARGET_FILE)

      // Check if the specific jpg exists in this folder
      if (fs.existsSync(sourceFilePath)) {
        const newFileName = `${folderName}_400x400.webp`
        const destFilePath = path.join(DEST_DIR, newFileName)

        try {
          fs.copyFileSync(sourceFilePath, destFilePath)
          console.log(`✓ Copied: ${folderName} -> ${newFileName}`)
        } catch (err) {
          console.error(`✗ Error copying ${folderName}:`, err.message)
        }
      }

      // Continue recursion for nested subfolders
      processFolders(folderPath)
    }
  }
}

// Start the process
console.log(`Starting scan in: ${SOURCE_DIR}...`)
processFolders(SOURCE_DIR)
console.log('Done!')