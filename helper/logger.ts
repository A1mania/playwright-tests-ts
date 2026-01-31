import log4js from "log4js";

const dateFormat = '%d{[dd/MM/yyyy] [hh:mm:ss]} [%p] - %m'

log4js.configure({
    appenders: {
        fullLog: {
            type: 'file',
            filename: './logs/fullLog.log',
            layout: {
                type: 'pattern',
                pattern: dateFormat
            }
        },
        errorLog: {
            type: 'file',
            filename: './logs/errorLog.log',
            layout: {
                type: 'pattern',
                pattern: dateFormat
            }
        },
        onlyError: {
            type: 'logLevelFilter',
            appender: 'errorLog',
            level: 'error'
        },
        console: {
            type: 'console',
            layout: { type: 'basic' }
        },
        onlyErrorConsole: {
            type: 'logLevelFilter',
            appender: 'console',
            level: 'error'
        },
    },
    categories: {
        default: {
            appenders: ['fullLog', 'onlyError', 'onlyErrorConsole'],
            level: 'debug'
        }
    }
})

export const logger = log4js.getLogger()