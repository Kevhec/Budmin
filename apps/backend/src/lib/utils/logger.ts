import pino from 'pino';
import pinoPretty from 'pino-pretty';

const levels = {
  sequelize: 25,
  server: 15,
};

const prettyStream = pinoPretty({
  colorize: true,
  customColors: 'sequelize:cyanBright,server:greenBright',
  useOnlyCustomProps: false,
});

const logger = pino({
  level: 'trace',
  useOnlyCustomLevels: false,
  customLevels: levels,
}, prettyStream);

export default logger;
