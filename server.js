const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
require('./config/db');
const { optionalAuth } = require('./middleware/authMiddleware');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(optionalAuth);

app.use('/', require('./routes/home'));
app.use('/comments', require('./routes/comments'));
app.use('/auth', require('./routes/auth'));
app.use('/recipes', require('./routes/addRecipe'));
app.use('/list', require('./routes/recipeList'));
app.use('/search', require('./routes/search'));
app.use('/favorites', require('./routes/favorites'));
app.use('/profile', require('./routes/profile'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Lỗi máy chủ');
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
