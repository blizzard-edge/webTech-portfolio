const winston=require("winston");
const logger=winston.createLogger({level:"info",format:winston.format.combine(winston.format.timestamp(),winston.format.json()),transports:[new winston.transports.Console()]});
function loggingMiddleware(req,res,next){
    /* TODO */
    // Generate a unique ID to identify and track each request.
    req.requestId=Math.random().toString(36).substring(2,9);

    // Record when the request started for request tracking and timing.
    req.startTime=Date.now();

    // Log information about the incoming request for debugging and monitoring.
    logger.info({message:"Incoming request",
        requestId:req.requestId,
        method:req.method,
        url:req.originalUrl,
        ip:req.ip,
        userAgent:req.get("user-agent")
    });
    // Pass the request to the next handler.
    next();
} 
module.exports=loggingMiddleware;
module.exports.logger=logger;
