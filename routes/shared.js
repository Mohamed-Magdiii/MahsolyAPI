
// Verify token very important with my team
const verifyToken = (req, res, next) =>{
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== undefined) {
   token =  bearerHeader.split(" ")[1];
   console.log(token);
    req.token = token
    next();
  } else {
    res.json({ error: "Error of type with token" });
  }
}

module.exports = verifyToken;
