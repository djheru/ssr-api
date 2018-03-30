/* eslint-disable no-console */
import chalk from 'chalk';
import ip from 'ip';
import debug from 'debug';

const divider = chalk.gray('\n-----------------------------------');

const logger = {
  error(err) {
    console.error(chalk.red(err));
  },
  appStarted(port, host) {
    const log = this.log();
    log(`Server started ! ${chalk.green('✓')}`);
    log(`Environment: ${process.env.NODE_ENV || 'unknown'}`);

    const localhostUri = `http://${host}:${port}`;
    const lanUri = `http://${ip.address()}:${port}`;

    let message = `${chalk.bold('Access URLs:')}${divider}`;
    message += `\nLocalhost: ${chalk.magenta(localhostUri)}`;
    message += `\n      Lan: ${chalk.magenta(lanUri)}${divider}`;
    message += `\n${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}\n`;
    log(message);
  },

  log(logNamespace = 'app:logger') {
    const log = debug(logNamespace);
    log.log = console.log.bind(console);
    return log;
  },

  border(width) {
    console.info('*'.repeat(width));
  }
};

export default logger;
