
function errorHandler(err, req, res, next) {
  if (err.name === "NotFound") {
    res.status(404).json({
      message : "Data not found"
    })
  } else if (err.name === "ValidationError") {
    res.status(400).json({
      message : err.errors[Object.keys(err.errors)[0]].message
    })
  } else if (err.name === "Forbidden") {
    res.status(403).json({
      message: "You are forbidden from doing this action"
    })
  } else if (err.name === "Unauthorized") {
    res.status(401).json({
      message : "You do not have access to this action"
    })
  } else if (err.name === "MongoServerError") {
    res.status(400).json({
      message : "This username/email has been taken"
    })
  } else if (err.name === "MongoBulkWriteError") {
    res.status(400).json({
      message : "Forum name already exists"
    })
  } else if (err.name === "InvalidFile") {
    res.status(400).json({
      message : "You have invalid file"
    })
  } else if (err.name === "MulterError") {
    res.status(400).json({
      message : "File too large"
    })
  } else if (err.name === "InvalidLogin") {
    res.status(401).json({
      message : "Email/Password is incorrect"
    })
  } else {
    console.log(err);
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

export default errorHandler;