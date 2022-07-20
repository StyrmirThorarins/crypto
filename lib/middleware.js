// configurations between development and production environment
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
} else {
    // production code
    console.log = function () {}  // disable console.log in production
}