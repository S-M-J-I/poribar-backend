module.exports = function (path, type) {

    // * check all routes user model can access
    if (type === "user") {
        // check user routes
        if (path.includes("user")) {
            return 1
        }
    } else {
        // check nurse routes
        if (path.includes("nurse")) {
            return 2
        }
    }
}