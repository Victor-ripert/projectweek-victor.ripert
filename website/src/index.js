const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// Allow cross-origin requests during dev. Narrow origin in production.
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));


app.get('/', (req, res) => {
  res.send('Hello World!');
})

const itemRouter = require('./routes/item/item.js');
const registerRouter = require('./routes/auth/register.js');
const userRouter = require('./routes/user/user.js');
const authmiddleware = require('./middleware/auth.js');
const loginRouter = require('./routes/auth/login.js');
const transactionRouter = require('./routes/transaction/transaction.js');


// Public routes
app.use('/item', itemRouter);

app.use('/register', registerRouter);
app.use('/login', loginRouter);

// Authentication Middleware --> all the routes called behin that need the bearer token to be accessed
app.use(authmiddleware);

app.use('/user', userRouter);
app.use('/transaction', transactionRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
})