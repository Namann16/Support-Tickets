import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let screens = {};

const loadScreens = async () => {
  const filePath = path.join(__dirname, '../register.json');
  const data = await readFile(filePath, 'utf-8');
  screens = JSON.parse(data);
};

// Use an IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    await loadScreens();
  } catch (err) {
    console.error('Failed to load screens:', err);
  }
})();

export const getScreensForTenant = (req, res) => {
  const customerId = req.user?.customerId;

  if (!customerId) {
    return res.status(401).json({ message: 'Unauthorized: No customerId in token' });
  }

  const tenantScreens = screens[customerId] || [];
  res.json(tenantScreens);
};
