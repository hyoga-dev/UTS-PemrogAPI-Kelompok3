function parseId(req, res, next) {
  const id = Number(req.params.id);
  // 2147483647 = batas INTEGER PostgreSQL, supaya id raksasa tidak memicu error 500
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    return res.status(400).json({
      status: 'error',
      message: 'ID harus bilangan bulat positif',
    });
  }
  req.id = id;
  next();
}

module.exports = parseId;