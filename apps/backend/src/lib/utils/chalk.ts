import chalk from 'chalk';

const { underline } = chalk;
const server = chalk.bgGreen.black;
const serverWarn = chalk.bgRed;
const db = chalk.bgMagenta;

const cliTheme = {
  server,
  serverWarn,
  db,
  underline,
};

export default cliTheme;
