const {ValidationError}=require("../services/xkcdService");
const {logger}=require("./logging");
function errorHandler(err,req,res,next){
    logger.error("Unhandled request error",{
        message:err.message,
        stack:err.stack,
        url:req.originalUrl,
        method:req.method,
        requestId:req.requestId});
    /* TODO */
    // Handle specific error types and return appropriate responses
    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: err.message
        });
    }

    // Return 404 when the requested comic does not exist.
    if (err.message === "Comic not found") {
        return res.status(404).json({
            error: "Comic not found"
        });
    }

    // Invalid comic IDs are also treated as a client-side validation error.
    if (err.message === "Invalid comic ID") {
        return res.status(400).json({
            error: "Invalid comic ID"
        });
    }

    // Operational errors have an expected status code that can be safely returned.
    if (err.isOperational === true) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    // Hide unexpected internal error details from the client.
    return res.status(500).json({
        error: "Internal server error"
    });
}
module.exports=errorHandler;
