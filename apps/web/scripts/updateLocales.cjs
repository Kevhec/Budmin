const fs = require("fs");
const path = require("path");
const readline = require("readline");

const LOCALES_PATH = path.resolve(__dirname, "../public/locales"); // Absolute path

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Prompts the user with a question and returns the response as a Promise.
 * @param {string} query - The question to ask the user.
 * @returns {Promise<string>}
 */
const askQuestion = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer.trim());
    });
  });
};

/**
 * Recursively sets a value in a nested object using a dot-separated key.
 * @param {Object} obj - The object to modify.
 * @param {string} keyPath - The dot-separated key (e.g., "category.newCategory").
 * @param {string} value - The value to set.
 */
const setNestedValue = (obj, keyPath, value) => {
  const keys = keyPath.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
      current[keys[i]] = {}; // Ensure intermediate objects exist
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value; // Set final value
};

/**
 * Handles the process of adding a new translation key recursively until the user exits.
 */
const updateLocales = async () => {
  console.log("🌍 Locale Updater Script 🌍\n");

  while (true) {
    // Ask for the new key (supports nesting, e.g., "category.newCategory")
    const newKey = await askQuestion("Enter the new key (use dot notation for nesting, or type 'exit' to quit): ");

    if (newKey.toLowerCase() === "exit") {
      console.log("\n👋 Exiting locale updater. Goodbye!");
      rl.close();
      return;
    }

    // Get all language directories
    const languages = fs
      .readdirSync(LOCALES_PATH)
      .filter((file) => fs.statSync(path.join(LOCALES_PATH, file)).isDirectory());

    for (const lang of languages) {
      const filePath = path.join(LOCALES_PATH, lang, "translation.json");

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Skipping ${lang}, no translation.json found.`);
        continue;
      }

      // Ask for value for this specific language
      const value = await askQuestion(`Enter value for "${newKey}" in [${lang}]: `);

      const rawData = fs.readFileSync(filePath, "utf8");
      const json = JSON.parse(rawData);

      // Check if the nested key already exists
      const keys = newKey.split(".");
      let current = json;
      let exists = true;
      for (let i = 0; i < keys.length; i++) {
        if (!current[keys[i]]) {
          exists = false;
          break;
        }
        current = current[keys[i]];
      }

      if (exists) {
        console.log(`⚠️ Key "${newKey}" already exists in ${lang}/translation.json. Skipping...`);
        continue;
      }

      // Set nested key value
      setNestedValue(json, newKey, value);

      // Write back to file
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf8");
      console.log(`✅ Updated ${lang}/translation.json`);
    }

    // Ask the user if they want to continue or exit
    const shouldContinue = await askQuestion("\n➕ Do you want to add another key? (yes/no): ");
    if (shouldContinue.toLowerCase() !== "yes") {
      console.log("\n👋 Exiting locale updater. Goodbye!");
      rl.close();
      return;
    }
  }
};

// Start the script
updateLocales();
