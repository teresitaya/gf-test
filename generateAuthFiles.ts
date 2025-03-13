import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const VOTTING_EMAILS = process.env.VOTTING_EMAILS?.split(",") || [];
const authDir = path.join(__dirname, "playwright/.auth");

// Ensure the directory exists
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

// Generate JSON files for each email
VOTTING_EMAILS.forEach((email) => {
  const fileName = email.replace(/[@.]/g, "_") + ".json";
  const filePath = path.join(authDir, fileName);

  const authData = {
    email,
    token: `fake_token_for_${email}`, // Replace this with real authentication data if needed
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(authData, null, 2));
  console.log(`✅ Created ${filePath}`);
});

console.log("All auth files have been generated!");
