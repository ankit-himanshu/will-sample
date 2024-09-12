require("string-format").extend(String.prototype);

const dotenv = require("dotenv");
dotenv.config();

let app = require("../expressApp");
app.use("/users/api/v1", require("../routes/users/v1"));

app.listen(process.env.PORT_USERS);
console.log("Users Service Listening at PORT:", process.env.PORT_USERS);