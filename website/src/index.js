const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const db = require('./config/db');

app.get('/', (req, res) => {
  res.send('Hello World!');
})

const itemRouter = require('./routes/item/item.js');
const registerRouter = require('./routes/auth/register.js');
const userRouter = require('./routes/user/user.js');

app.use('/register', registerRouter);


app.use('/item', itemRouter);
app.use('/user', userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
})