const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const router = express.Router();

// Student login page
router.get('/login', (req, res) => res.render('studentLogin'));

// Handle login (now using studentId)
router.post('/login', async (req, res) => {
  const { studentId, password } = req.body;
  const student = await Student.findOne({ studentId }).populate('course');

  if (!student) return res.send('❌ Invalid Student ID');
  const match = await bcrypt.compare(password, student.password);
  if (!match) return res.send('❌ Wrong password');

  req.session.student = student;
  res.redirect('/student/dashboard');
});

// Dashboard
router.get('/dashboard', async (req, res) => {
  if (!req.session.student) return res.redirect('/student/login');
  const student = await Student.findById(req.session.student._id).populate('course');
  res.render('studentDashboard', { student });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/student/login');
});

module.exports = router;
