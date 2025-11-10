const express = require('express');
const Student = require('../models/Student');
const Course = require('../models/Course');
const router = express.Router();

router.get('/', async (req, res) => {
  const students = await Student.find().populate('course');
  res.render('students', { students });
});

router.get('/add', async (req, res) => {
  const courses = await Course.find();
  res.render('addStudent', { courses });
});

router.post('/add', async (req, res) => {
  try {
    const student = new Student({
      studentId: req.body.studentId,
      name: req.body.name,
      fatherName: req.body.fatherName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      email: req.body.email,
      phone: req.body.phone,
      parentPhone: req.body.parentPhone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      aadhaarNumber: req.body.aadhaarNumber,
      batchTime: req.body.batchTime,
      course: req.body.course,
      courseDuration: req.body.courseDuration,
      totalFees: req.body.totalFees,
      paidFees: req.body.paidFees,
      paymentPlan: req.body.paymentPlan,
      referredBy: req.body.referredBy,
      admissionTakenBy: req.body.admissionTakenBy,
      status: req.body.status,
      registrationDate: req.body.registrationDate,
      notes: req.body.notes,
      password: req.body.password
    });

    await student.save();
    res.redirect('/students');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding student');
  }
});

// Edit student form
router.get('/edit/:id', async (req, res) => {
  const student = await Student.findById(req.params.id).populate('course');
  const courses = await Course.find();
  res.render('editStudent', { student, courses });
});

// Update student
const bcrypt = require('bcryptjs');

// Update student
router.post('/edit/:id', async (req, res) => {
  const {
      studentId,
      name,
      fatherName,
      dateOfBirth,
      gender,
      email,
      phone,
      parentPhone,
      address,
      batchTime,
      course,
      totalFees,
      paidFees,
      registrationDate,
      status,
      password
  } = req.body;

  const updateData = {
      studentId,
      name,
      fatherName,
      gender,
      email,
      phone,
      parentPhone,
      address,
      batchTime,
      course,
      totalFees,
      paidFees,
      registrationDate,
      status
  };

     // 🗓️ Convert date fields properly
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (registrationDate) updateData.registrationDate = new Date(registrationDate);


  // 🔒 Only update password if a new one was entered
  if (password && password.trim() !== '') {
    const hashed = await bcrypt.hash(password, 10);
    updateData.password = hashed;
  }

await Student.findByIdAndUpdate(req.params.id, updateData);

// ✅ Set success message
req.session.message = {
  type: 'success',
  text: '✅ Student updated successfully!'
};

res.redirect('/students');

});




router.get('/delete/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.redirect('/students');
});

module.exports = router;
