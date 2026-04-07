import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// eslint-disable-next-line no-undef
const PORT = parseInt(process.env.PORT);


// Serve built assets; fall through to SPA shell for non-file routes (no sync fs per request)
app.use(express.static(path.join(__dirname, 'dist'), { index: false }))

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log('\n' + chalk.bgGreen.black.bold(' 🚀 PRODUCTION MODE 🚀 ') + '\n');
  console.log(chalk.white.bold('🚀 System >> ') + chalk.cyan.bold('Starting >> ') + chalk.green.bold('Production Mode'));
  console.log(chalk.white.bold('⚡ System >> ') + chalk.cyan.bold('Running >> ') + chalk.yellow.bold('Port >> ') + chalk.green.bold(PORT));
  console.log(chalk.white.bold('🌐 Network >> ') + chalk.blue.bold('Localhost >> ') + chalk.cyan.bold(`http://localhost:${PORT}`));
  
  // Get network interfaces to show IP addresses
  const networkInterfaces = os.networkInterfaces();
  
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces?.forEach((netInterface) => {
      if (netInterface.family === 'IPv4' && !netInterface.internal) {
        console.log(chalk.white.bold('🌐 Network >> ') + chalk.magenta.bold('IPv4 >> ') + chalk.cyan.bold(`http://${netInterface.address}:${PORT}`));
      }
    });
  });
  
  // Final success message
  console.log('\n' + chalk.white.bold('🎉 System >> ') + chalk.green.bold('Successfully Started >> ') + chalk.cyan.bold('Friendly Insurance & Realty'));
  console.log(chalk.gray('─'.repeat(70)) + '\n');
}); 