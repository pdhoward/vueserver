const env = process.env.NODE_ENV || 'development';

const config = require('./config.json');
const envConfig = config[env];

Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
});

// process.env.MONGODB_URL = config['mongodbUrl'];
// process.env.SESSION_SECRET = config['sessionSecret'];
// process.env.JWT_SECRET = config['jwtSecret'];
// process.env.EMAIL_USERNAME = config['emailCreds'].username;
// process.env.EMAIL_PASSWORD = config['emailCreds'].password;