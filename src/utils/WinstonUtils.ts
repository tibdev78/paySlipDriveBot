import { createLogger, format, transports, Logger  } from "winston";
import dayjs from 'dayjs';
import LogParams from "../models/Winston";


const log = (options: LogParams): Logger => {
    const { combine, timestamp, label, prettyPrint } = format;
    const logger = createLogger({
        format: combine(
            label({ label: 'payslip process' }),
            timestamp({ format: dayjs().format("YYYY-MM-DD HH:mm:ss")}),
            prettyPrint()
        ),
        transports: [new transports.Console()]
    });
    return logger.log({...options})
}

export default log;


