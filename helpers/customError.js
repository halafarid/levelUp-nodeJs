module.exports = (status, message, details = []) => {
    const err = new Error(message);
    err.status = status;
    err.details = details;
    return err;
}