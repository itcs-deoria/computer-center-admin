const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Course = require('../models/Course');

const router = express.Router();

// Seed admin (first time)
router.get('/seed-admin', async (req, res) => {
  const hashed = await bcrypt.hash('admin123', 10);
  await Admin.create({ username: 'admin', password: hashed });
  res.send('✅ Admin created: username=admin, password=admin123');
});

// Login page
router.get('/login', (req, res) => res.render('login'));

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.send('❌ Invalid credentials');

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.send('❌ Wrong password');

  req.session.admin = admin;
  res.redirect('/dashboard');
});

// Dashboard
router.get('/dashboard', async (req, res) => {
  if (!req.session.admin) return res.redirect('/login');

  const totalStudents = await Student.countDocuments();
  const totalCourses = await Course.countDocuments();
  const totalFees = await Student.aggregate([
    { $group: { _id: null, total: { $sum: '$paidFees' } } }
  ]);

  res.render('dashboard', {
    totalStudents,
    totalCourses,
    totalFees: totalFees[0]?.total || 0
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
