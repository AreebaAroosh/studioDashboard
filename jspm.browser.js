SystemJS.config({
    baseURL: "/",
    production: false,
    paths: {
        "github:*": "jspm_packages/github/*",
        "npm:*": "jspm_packages/npm/*",
        "rxjs/*": "node_modules/rxjs/*.js",
        "src/*": "src/*",
        "StudioDashboard/": "src/"
    }
});
