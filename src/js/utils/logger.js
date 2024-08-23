// utils/logger.js

class Logger {
  static levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  };

  static level = Logger.levels.INFO;

  static log(level, message, ...args) {
    if (level <= Logger.level) {
     
      const levelName = Object.keys(Logger.levels).find(
        (key) => Logger.levels[key] === level
      );
      console.log(`[${levelName}] ${message}`, ...args);
    }
  }

  static error(message, ...args) {
    this.log(Logger.levels.ERROR, message, ...args);
  }

  static warn(message, ...args) {
    this.log(Logger.levels.WARN, message, ...args);
  }

  static info(message, ...args) {
    this.log(Logger.levels.INFO, message, ...args);
  }

  static debug(message, ...args) {
    this.log(Logger.levels.DEBUG, message, ...args);
  }
}

export const logger = Logger;
