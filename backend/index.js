const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Users
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Create basic test user if none exist
app.post('/api/init', async (req, res) => {
  const count = await prisma.user.count();
  if (count === 0) {
    const admin = await prisma.user.create({
      data: { email: 'admin@atom.com', password: 'password', name: 'Admin User', role: 'ADMIN' }
    });
    const manager = await prisma.user.create({
      data: { email: 'manager@atom.com', password: 'password', name: 'Manager User', role: 'MANAGER' }
    });
    const employee = await prisma.user.create({
      data: { email: 'employee@atom.com', password: 'password', name: 'Employee User', role: 'EMPLOYEE', managerId: manager.id }
    });
    res.json({ success: true, message: 'Initialized test users' });
  } else {
    res.json({ success: false, message: 'Already initialized' });
  }
});

// Goals
app.get('/api/goals/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
  
  if (user.role === 'MANAGER') {
    // Manager sees their team's goals
    const goals = await prisma.goal.findMany({
      where: { owner: { managerId: user.id } },
      include: { owner: true }
    });
    return res.json(goals);
  } else {
    // Employee sees their own goals
    const goals = await prisma.goal.findMany({
      where: { ownerId: parseInt(userId) },
      include: { owner: true }
    });
    return res.json(goals);
  }
});

app.post('/api/goals', async (req, res) => {
  const { title, description, uom, target, weightage, ownerId } = req.body;
  try {
    const goal = await prisma.goal.create({
      data: { title, description, uom, target: parseFloat(target), weightage: parseFloat(weightage), ownerId: parseInt(ownerId) }
    });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/goals/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, uom, target, weightage, status } = req.body;
  try {
    const goal = await prisma.goal.update({
      where: { id: parseInt(id) },
      data: { 
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(uom !== undefined && { uom }),
        ...(target !== undefined && { target: parseFloat(target) }),
        ...(weightage !== undefined && { weightage: parseFloat(weightage) }),
        ...(status && { status })
      }
    });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check-ins
app.get('/api/checkins/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
  
  if (user.role === 'MANAGER') {
    const checkIns = await prisma.checkIn.findMany({
      where: { goal: { owner: { managerId: user.id } } },
      include: { goal: { include: { owner: true } } }
    });
    return res.json(checkIns);
  } else {
    const checkIns = await prisma.checkIn.findMany({
      where: { goal: { ownerId: parseInt(userId) } },
      include: { goal: true }
    });
    return res.json(checkIns);
  }
});

app.post('/api/checkins', async (req, res) => {
  const { goalId, quarter, actual } = req.body;
  
  const goal = await prisma.goal.findUnique({ where: { id: parseInt(goalId) } });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  
  // Calculate status logic
  let status = "Not Started";
  let actualVal = parseFloat(actual);
  
  if (goal.uom === 'Numeric' || goal.uom === 'Max') {
    if (actualVal >= goal.target) status = "Completed";
    else if (actualVal > 0) status = "On Track";
  } else if (goal.uom === 'Zero') {
    if (actualVal === 0) status = "Completed";
    else status = "On Track"; // Or needs attention depending on business logic
  }

  try {
    const checkIn = await prisma.checkIn.upsert({
      where: { goalId_quarter: { goalId: parseInt(goalId), quarter } },
      update: { actual: actualVal, status },
      create: {
        goalId: parseInt(goalId),
        quarter,
        planned: goal.target,
        actual: actualVal,
        status
      }
    });
    res.json(checkIn);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/checkins/:id', async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  try {
    const checkIn = await prisma.checkIn.update({
      where: { id: parseInt(id) },
      data: { comment }
    });
    res.json(checkIn);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// System Stats for Reports Tab (Admin & Manager)
app.get('/api/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'EMPLOYEE' } });
    const totalGoals = await prisma.goal.count();
    const approvedGoals = await prisma.goal.count({ where: { status: 'Approved' } });
    const pendingGoals = await prisma.goal.count({ where: { status: 'Pending Approval' } });
    const totalCheckIns = await prisma.checkIn.count();
    
    const q1Count = await prisma.checkIn.count({ where: { quarter: 'Q1' } });
    const q2Count = await prisma.checkIn.count({ where: { quarter: 'Q2' } });
    const q3Count = await prisma.checkIn.count({ where: { quarter: 'Q3' } });
    const q4Count = await prisma.checkIn.count({ where: { quarter: 'Q4' } });
    const annualCount = await prisma.checkIn.count({ where: { quarter: 'Annual' } });

    // Average progress calculation
    const checkIns = await prisma.checkIn.findMany();
    const avgProgress = checkIns.length > 0 
      ? Math.round((checkIns.reduce((sum, ci) => sum + (ci.planned > 0 ? (ci.actual / ci.planned) : 0), 0) / checkIns.length) * 100)
      : 0;

    res.json({
      totalUsers,
      totalGoals,
      approvedGoals,
      pendingGoals,
      totalCheckIns,
      avgProgress,
      q1Count,
      q2Count,
      q3Count,
      q4Count,
      annualCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;

if (!process.env.NETLIFY) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
