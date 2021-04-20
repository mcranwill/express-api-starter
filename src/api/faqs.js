/* eslint-disable consistent-return */
const express = require('express');
const monk = require('monk');
const Joi = require('joi');

const router = express.Router();
const db = monk(process.env.MONGO_URI);
const faqs = db.get('faqs');

const schema = Joi.object({
  question: Joi.string().trim().required(),
  answer: Joi.string().trim().required(),
  video_url: Joi.string()
});

// Read ALL
router.get('/', async (req, res, next) => {
  try {
    const items = await faqs.find({});
    res.json(items);
    // res.json('hello');
  } catch (error) {
    next(error);
  }
});

// Read One
// eslint-disable-next-line consistent-return
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await faqs.findOne({
      _id: id,
    });
    if (!item) {
      return next();
    }
    return res.json(item);
  } catch (error) {
    next(error);
  }
});

// Create One
router.post('/', async (req, res, next) => {
  try {
    const value = await schema.validateAsync(req.body);
    const inserted = await faqs.insert(value);
    res.json(inserted);
  } catch (error) {
    next(error);
  }
});

// Update One
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const value = await schema.validateAsync(req.body);
    const item = await faqs.findOne({
      _id: id,
    });
    if (!item) {
      return next();
    }
    const updated = await faqs.update({
      _id: id,
    }, {
      $set: value,
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete One
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await faqs.findOne({
      _id: id,
    });
    if (!item) {
      return next();
    }
    const deleted = await faqs.delete({
      _id: id,
    });
    res.json(deleted);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
