const express = require('express');
const Student = require('../models/Student');
const Counter = require('../models/Counter');
const router = express.Router();

// View Fee History
router.get('/:id', async (req, res) => {
  const student = await Student.findById(req.params.id).populate('course');
  res.render('feeHistory', { student });
});

// Add New Payment
router.post('/:id/add', async (req, res) => {
  const { amount, paymentDate, collectedBy, paymentMode, notes } = req.body;
  const student = await Student.findById(req.params.id);

  // 🔢 Universal Receipt Number
  let counter = await Counter.findOne({ name: 'receiptCounter' });
  if (!counter) counter = await Counter.create({ name: 'receiptCounter', value: 1 });
  else {
    counter.value += 1;
    await counter.save();
  }

  const newReceiptNo = `REC-ITCS${String(counter.value).padStart(3, '0')}`;


  const payment = {
    receiptNo: newReceiptNo,
    amount,
    paymentDate: new Date(paymentDate),
    collectedBy,
    paymentMode,
    notes
  };

  student.payments.push(payment);
  student.paidFees += Number(amount);
  await student.save();

  res.redirect(`/fees/${student._id}`);
});

// 📝 EDIT PAYMENT - show edit form
router.get('/:studentId/edit/:receiptNo', async (req, res) => {
  const { studentId, receiptNo } = req.params;
  const student = await Student.findById(studentId);
  const payment = student.payments.find(p => p.receiptNo === receiptNo);

  res.render('editPayment', { student, payment });
});

// 📝 EDIT PAYMENT - update logic
router.post('/:studentId/edit/:receiptNo', async (req, res) => {
  const { studentId, receiptNo } = req.params;
  const { amount, paymentDate, collectedBy, paymentMode, notes } = req.body;

  const student = await Student.findById(studentId);

  // Find existing payment
  const payment = student.payments.find(p => p.receiptNo === receiptNo);

  if (payment) {
    // adjust total paid fees (remove old, add new)
    student.paidFees -= Number(payment.amount);
    student.paidFees += Number(amount);

    // update fields
    payment.amount = amount;
    payment.paymentDate = new Date(paymentDate);
    payment.collectedBy = collectedBy;
    payment.paymentMode = paymentMode;
    payment.notes = notes;
  }

  await student.save();
  res.redirect(`/fees/${student._id}`);
});

// 🗑️ DELETE PAYMENT (with confirmation)
router.post('/:studentId/delete/:receiptNo', async (req, res) => {
  const { studentId, receiptNo } = req.params;
  const student = await Student.findById(studentId);

  // Find the payment
  const paymentIndex = student.payments.findIndex(p => p.receiptNo === receiptNo);

  if (paymentIndex !== -1) {
    const deletedPayment = student.payments[paymentIndex];

    // Adjust total fees
    student.paidFees -= Number(deletedPayment.amount);

    // Remove payment
    student.payments.splice(paymentIndex, 1);

    await student.save();
  }

  res.redirect(`/fees/${studentId}`);
});


module.exports = router;
