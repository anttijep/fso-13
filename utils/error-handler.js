const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  res.status(400).json({error: err.message});
  next(err);
};

module.exports = errorHandler;
