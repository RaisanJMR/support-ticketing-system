const registerUser = (req, res) => {
  res.send('register route')
}
const loginUser = (req, res) => {
  res.send('login route')
}
module.exports = {
  registerUser,
  loginUser,
}
