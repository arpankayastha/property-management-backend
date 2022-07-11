import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/typeorm";
import {config, rootDir} from "./config";


@Configuration({
    ...config,
    acceptMimes: ["application/json"],
    httpPort: process.env.PORT || 8083,
    httpsPort: false, // CHANGE
    mount: {
        "/rest": [
            `${rootDir}/controllers/**/*.ts`
        ]
    },
    componentsScan: [
        "${rootDir}/middlewares/**/*.ts"
    ],
    views: {
        root: `${rootDir}/views`,
        extensions: {
            ejs: "ejs"
        }
    },
    exclude: [
        "**/*.spec.ts"
    ],
    logger: {
        disableRoutesSummary: true, // remove table with routes summary
        logRequest: false,
    },
    /*multer: {
        dest: `${rootDir}/../uploads`,
    },*/
    statics: {
        "/uploads": [
            {
                root: `${rootDir}/../uploads`,
                // Optional
                hook: "$beforeRoutesInit" // Load statics on the expected hook. Default: $afterRoutesInit
                // ... statics options
            }
        ]
    }
})
export class Server {
    @Inject()
    app: PlatformApplication;

    @Configuration()
    settings: Configuration;

    $beforeRoutesInit(): void {
        this.app
            .use(cors())
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));
    }
}
