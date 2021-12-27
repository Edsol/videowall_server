module.exports = {
    apps: [{
        name: "videowallServer",
        script: "bin/www",
        "watch": true,
        "ignore_watch": ["node_modules"],
        "log_date_format": "YYYY-MM-DD HH:mm Z",
    }]
}
