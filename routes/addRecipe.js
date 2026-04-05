const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/Recipe');
const { getTokenFromRequest } = require('../middleware/authMiddleware');

const router = express.Router();

/** Đồng bộ với trang chủ (TV A) — danh mục hiển thị form */
const RECIPE_CATEGORIES = ['Món Việt', 'Món Hàn', 'Tráng miệng', 'Món Ý', 'Đồ uống', 'Ăn vặt'];

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '') || '.jpg';
    const safe = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Chỉ chấp nhận file ảnh.'));
    }
    cb(null, true);
  },
});

function requireLoginPage(req, res, next) {
  const token = getTokenFromRequest(req);
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) {
    return res.redirect('/auth/login?next=' + encodeURIComponent(req.originalUrl));
  }
  try {
    const payload = jwt.verify(token, secret);
    const userId = payload.userId || payload.id || payload.sub;
    if (!userId) return res.redirect('/auth/login');
    req.user = { userId: String(userId), ...payload };
    res.locals.currentUser = req.user;
    next();
  } catch {
    return res.redirect('/auth/login');
  }
}

function authorObjectId(req) {
  return new mongoose.Types.ObjectId(req.user.userId);
}

function isRecipeOwner(recipe, userIdStr) {
  const uid = String(userIdStr);
  if (recipe.author && String(recipe.author) === uid) return true;
  if (recipe.userId && String(recipe.userId) === uid) return true;
  return false;
}

function parseIngredientsFromBody(body) {
  const names = body.ingredientName;
  const qtys = body.ingredientQty;
  if (!names) return [];
  const nArr = Array.isArray(names) ? names : [names];
  const qArr = Array.isArray(qtys) ? qtys : qtys != null && qtys !== '' ? [qtys] : [];
  const out = [];
  for (let i = 0; i < nArr.length; i++) {
    const name = String(nArr[i] || '').trim();
    if (!name) continue;
    const q = String(qArr[i] || '').trim();
    out.push(q ? `${name} — ${q}` : name);
  }
  return out;
}

function parseStepsFromBody(body) {
  const s = body.step;
  if (s == null || s === '') return [];
  const arr = Array.isArray(s) ? s : [s];
  return arr.map((x) => String(x || '').trim()).filter(Boolean);
}

function ingredientRowsFromRecipe(ingredients) {
  if (!ingredients || !ingredients.length) return [{ name: '', qty: '' }];
  return ingredients.map((line) => {
    const str = String(line);
    const em = str.split(/\s—\s/, 2);
    if (em.length === 2) return { name: em[0].trim(), qty: em[1].trim() };
    const hy = str.split(/\s-\s/, 2);
    if (hy.length === 2 && hy[0].indexOf('http') !== 0) return { name: hy[0].trim(), qty: hy[1].trim() };
    const colon = str.indexOf(':');
    if (colon > 0) {
      return { name: str.slice(0, colon).trim(), qty: str.slice(colon + 1).trim() };
    }
    return { name: str.trim(), qty: '' };
  });
}

async function loadMyRecipesLean(userIdStr) {
  const uid = new mongoose.Types.ObjectId(userIdStr);
  return Recipe.find({ $or: [{ author: uid }, { userId: uid }] })
    .sort({ createdAt: -1 })
    .select('title image')
    .lean();
}

function buildFormPayload(body) {
  return {
    title: (body.title || '').trim(),
    description: (body.description || '').trim(),
    category: (body.category || RECIPE_CATEGORIES[0] || '').trim(),
    difficulty: ['easy', 'medium', 'hard'].includes(body.difficulty) ? body.difficulty : 'medium',
    cookTime: body.cookTime === '' || body.cookTime == null ? '' : String(body.cookTime),
  };
}

function renderCreate(res, opts) {
  res.render('recipes/create', {
    title: 'Thêm công thức — RecipeShare',
    formAction: '/recipes/create',
    categories: RECIPE_CATEGORIES,
    editingId: null,
    currentImage: opts.currentImage || '',
    form: opts.form || {},
    ingredientRows: opts.ingredientRows || [{ name: '', qty: '' }],
    stepRows: opts.stepRows && opts.stepRows.length ? opts.stepRows : [''],
    myRecipes: opts.myRecipes || [],
    error: opts.error || null,
  });
}

function renderEdit(res, opts) {
  res.render('recipes/edit', {
    title: 'Sửa công thức — RecipeShare',
    formAction: `/recipes/${opts.editingId}/edit`,
    categories: RECIPE_CATEGORIES,
    editingId: opts.editingId,
    currentImage: opts.currentImage || '',
    form: opts.form || {},
    ingredientRows: opts.ingredientRows || [{ name: '', qty: '' }],
    stepRows: opts.stepRows && opts.stepRows.length ? opts.stepRows : [''],
    myRecipes: opts.myRecipes || [],
    error: opts.error || null,
  });
}

/** GET /recipes/create */
router.get('/create', requireLoginPage, async (req, res, next) => {
  try {
    const myRecipes = await loadMyRecipesLean(req.user.userId);
    renderCreate(res, { myRecipes });
  } catch (err) {
    next(err);
  }
});

/** POST /recipes/create */
router.post('/create', requireLoginPage, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return loadMyRecipesLean(req.user.userId)
        .then((myRecipes) =>
          renderCreate(res, {
            myRecipes,
            error: err.message || 'Lỗi upload ảnh.',
            form: buildFormPayload(req.body),
            ingredientRows: ingredientRowsFromRecipe(parseIngredientsFromBody(req.body)),
            stepRows: parseStepsFromBody(req.body).length ? parseStepsFromBody(req.body) : [''],
          })
        )
        .catch(next);
    }
    next();
  });
});

router.post('/create', requireLoginPage, async (req, res, next) => {
  try {
    const myRecipes = await loadMyRecipesLean(req.user.userId);
    const form = buildFormPayload(req.body);
    const ingredients = parseIngredientsFromBody(req.body);
    const steps = parseStepsFromBody(req.body);

    if (!form.title) {
      return renderCreate(res, {
        myRecipes,
        error: 'Vui lòng nhập tên món ăn.',
        form,
        ingredientRows: ingredientRowsFromRecipe(ingredients),
        stepRows: steps.length ? steps : [''],
      });
    }

    const uid = authorObjectId(req);
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    await Recipe.create({
      title: form.title,
      description: form.description,
      ingredients,
      steps,
      cookTime: form.cookTime === '' ? null : Math.max(0, parseInt(form.cookTime, 10) || 0),
      difficulty: form.difficulty,
      category: form.category || RECIPE_CATEGORIES[0],
      image: imagePath,
      author: uid,
      userId: uid,
    });

    res.redirect('/recipes/create');
  } catch (err) {
    next(err);
  }
});

/** GET /recipes/:id/edit */
router.get('/:id/edit', requireLoginPage, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('Không tìm thấy công thức.');
    }
    const recipe = await Recipe.findById(id).lean();
    if (!recipe) return res.status(404).send('Không tìm thấy công thức.');
    if (!isRecipeOwner(recipe, req.user.userId)) {
      return res.status(403).send('Bạn không có quyền sửa công thức này.');
    }

    const myRecipes = await loadMyRecipesLean(req.user.userId);
    const form = {
      title: recipe.title || '',
      description: recipe.description || '',
      category: recipe.category || RECIPE_CATEGORIES[0],
      difficulty: recipe.difficulty || 'medium',
      cookTime: recipe.cookTime != null ? String(recipe.cookTime) : '',
    };

    renderEdit(res, {
      editingId: id,
      currentImage: recipe.image || '',
      form,
      ingredientRows: ingredientRowsFromRecipe(recipe.ingredients),
      stepRows: recipe.steps && recipe.steps.length ? recipe.steps : [''],
      myRecipes,
    });
  } catch (err) {
    next(err);
  }
});

/** POST /recipes/:id/edit */
router.post('/:id/edit', requireLoginPage, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const { id } = req.params;
      return Recipe.findById(id)
        .lean()
        .then((recipe) => {
          if (!recipe) {
            return res.status(404).send('Không tìm thấy công thức.');
          }
          if (!isRecipeOwner(recipe, req.user.userId)) {
            return res.status(403).send('Bạn không có quyền sửa công thức này.');
          }
          return loadMyRecipesLean(req.user.userId).then((myRecipes) =>
            renderEdit(res, {
              editingId: id,
              currentImage: recipe.image || '',
              form: buildFormPayload(req.body),
              ingredientRows: ingredientRowsFromRecipe(parseIngredientsFromBody(req.body)),
              stepRows: parseStepsFromBody(req.body).length ? parseStepsFromBody(req.body) : [''],
              myRecipes,
              error: err.message || 'Lỗi upload ảnh.',
            })
          );
        })
        .catch(next);
    }
    next();
  });
});

router.post('/:id/edit', requireLoginPage, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('Không tìm thấy công thức.');
    }
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).send('Không tìm thấy công thức.');
    if (!isRecipeOwner(recipe, req.user.userId)) {
      return res.status(403).send('Bạn không có quyền sửa công thức này.');
    }

    const myRecipes = await loadMyRecipesLean(req.user.userId);
    const form = buildFormPayload(req.body);
    const ingredients = parseIngredientsFromBody(req.body);
    const steps = parseStepsFromBody(req.body);

    if (!form.title) {
      return renderEdit(res, {
        editingId: id,
        currentImage: recipe.image || '',
        form,
        ingredientRows: ingredientRowsFromRecipe(ingredients),
        stepRows: steps.length ? steps : [''],
        myRecipes,
        error: 'Vui lòng nhập tên món ăn.',
      });
    }

    recipe.title = form.title;
    recipe.description = form.description;
    recipe.ingredients = ingredients;
    recipe.steps = steps;
    recipe.cookTime = form.cookTime === '' ? null : Math.max(0, parseInt(form.cookTime, 10) || 0);
    recipe.difficulty = form.difficulty;
    recipe.category = form.category || RECIPE_CATEGORIES[0];

    if (req.file) {
      recipe.image = `/uploads/${req.file.filename}`;
    }

    const uid = authorObjectId(req);
    recipe.author = uid;
    recipe.userId = uid;

    await recipe.save();
    res.redirect('/recipes/create');
  } catch (err) {
    next(err);
  }
});

/** POST /recipes/:id/delete */
router.post('/:id/delete', requireLoginPage, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).send('Không tìm thấy công thức.');
    }
    const recipe = await Recipe.findById(id).lean();
    if (!recipe) return res.status(404).send('Không tìm thấy công thức.');
    if (!isRecipeOwner(recipe, req.user.userId)) {
      return res.status(403).send('Bạn không có quyền xóa công thức này.');
    }
    await Recipe.deleteOne({ _id: id });
    res.redirect('/recipes/create');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
