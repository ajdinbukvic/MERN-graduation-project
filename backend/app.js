const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const CustomError = require('./utils/customError');
const globalErrorHandler = require('./controllers/errorController');

const authRouter = require('./routes/authRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.enable('trust proxy');
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// CORS

// const corsOptions = {
//   origin: '*',
//   credentials: true,
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

app.use(
  cors({
    origin: ['http://localhost:5000', 'http://localhost:5173'],
    credentials: true,
  }),
);
app.options('*', cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!',
// });
// app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Cookie parser
app.use(cookieParser());

// ROUTES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRouter);

// Error handling
app.all('*', (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
