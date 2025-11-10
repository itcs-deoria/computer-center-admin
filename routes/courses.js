const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.render('courses', { courses });
});

router.post('/add', async (req, res) => {
  const { name, duration, fee } = req.body;
  await Course.create({ name, duration, fee });
  res.redirect('/courses');
});

module.exports = router;
