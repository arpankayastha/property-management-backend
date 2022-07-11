module.exports = {
    name: "default",
    type: 'mysql',
    replication: {
        master: {
            host: process.env.ORM_HOST,
            port: process.env.ORM_PORT,
            username: process.env.ORM_USERNAME,
            password: process.env.ORM_PASSWORD,
            database: process.env.ORM_DATABASE
        },
        slaves: [{
            host: process.env.ORM_SLAVE_HOST,
            port: process.env.ORM_SLAVE_PORT,
            username: process.env.ORM_SLAVE_USERNAME,
            password: process.env.ORM_SLAVE_PASSWORD,
            database: process.env.ORM_SLAVE_DATABASE
        }]
    },
    /*cache: {
        type: "redis",
        options: {
            host: "localhost",
            port: 6379
        }
    },*/
    charset: "utf8mb4_unicode_ci",
    synchronize: true,
    migrationsRun: false,
    connectTimeout: 100000,
    logging: [],
    //logging: ["query", "error"],
    entities: [
        process.env.BUILD_DIR + "/entities/**/*{.ts,.js}"
    ],
    migrations: [
        process.env.BUILD_DIR + "/migration/**/*{.ts,.js}"
    ],
    subscribers: [
        process.env.BUILD_DIR + "/subscriber/**/*{.ts,.js}"
    ],
    cli: {
        entitiesDir: process.env.BUILD_DIR + "/entities",
        migrationsDir: process.env.BUILD_DIR + "/migration",
        subscribersDir: process.env.BUILD_DIR + "/subscriber"
    },
    pool: {
        max: 50
    }
};
