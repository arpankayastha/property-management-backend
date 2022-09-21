module.exports = {
    apps: [{
        name: 'app',
        script: './dist/index.js',
        // watch: './dist/*',
        // increment_var : 'PORT',
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_test: {
            "PORT": 8080,
            "NODE_ENV": "testing",
            "BUILD_DIR": "dist"
        },
        env_prod: {
            "PORT": 8080,
            "NODE_ENV": "prod",
            "BUILD_DIR": "dist"
        },
        instances: "max",
        exec_mode: "cluster_mode",
    }],
    "deploy": {
        "test": {
            "user": "ubuntu",
            "host": [""],
            "ref": "origin/test",
            "repo": "",
            "path": "/var/www/html",
            "post-deploy": "npm install; pm2 reload ecosystem.config.js --env test"
        },
        "prod": {
            "user": "ubuntu",
            "host": [""],
            "ref": "origin/master",
            "repo": "",
            "path": "/var/www/html",
            "post-deploy": "npm install; pm2 reload ecosystem.config.js --env prod"
        },
    }
};