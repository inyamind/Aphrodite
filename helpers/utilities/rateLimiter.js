const rateLimit = require('express-rate-limit');

class RateLimiter {
    static createLimiter(options = {}) {
        const defaultOptions = {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: "Too many requests, please try again later."
        };

        return rateLimit({
            ...defaultOptions,
            ...options
        });
    }
}

module.exports = RateLimiter;