import { 
  defineMiddlewares
} from "@medusajs/framework/http"
import path from "path"
import fs from "fs"

console.log("[MIDDLEWARES] Loading middlewares.ts file")

const uploadsDir = "/tmp/medusa-uploads"
console.log("[MIDDLEWARES] Uploads directory:", uploadsDir)

export default defineMiddlewares({
  routes: [
    {
      matcher: "/uploads*",
      middlewares: [
        (req, res, next) => {
          const originalUrl = req.originalUrl || req.url
          console.log("[UPLOADS] Request:", req.method, originalUrl)
          
          // Extract filename from URL and remove trailing slash
          let filePath = originalUrl.replace(/^\/uploads\/?/, "")
          if (filePath.endsWith("/")) {
            filePath = filePath.slice(0, -1)
          }
          
          // Decode URL encoding
          filePath = decodeURIComponent(filePath)
          
          console.log("[UPLOADS] Decoded file path:", filePath)
          
          const fullPath = path.join(uploadsDir, filePath)
          
          // Check if file exists
          fs.stat(fullPath, (err, stats) => {
            if (err) {
              console.log("[UPLOADS] File not found:", fullPath)
              res.status(404).send("File not found")
              return
            }
            
            if (!stats.isFile()) {
              console.log("[UPLOADS] Not a file:", fullPath)
              res.status(404).send("Not a file")
              return
            }
            
            console.log("[UPLOADS] Serving file! Size:", stats.size, "bytes")
            
            // Send the file
            res.sendFile(fullPath, (err) => {
              if (err) {
                console.log("[UPLOADS] Error sending file:", err.message)
                if (!res.headersSent) {
                  res.status(500).send("Error serving file")
                }
              }
            })
          })
        },
      ],
    },
  ],
})
