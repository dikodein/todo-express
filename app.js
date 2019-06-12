const express = require('express')
var db = require('./db/db')
const PORT = 4000

// Setup express app
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Route
app.get('/todos', (req, res) => {
  res.status(200).send({
    success: true,
    message: 'todos retrieved successfully',
    todos: db
  })
})

app.post('/todos', (req, res) => {
  if (req.body.title.length === 0) {
    return res.status(400).send({
      success: false,
      message: 'Todo must have a title'
    })
  }

  db.push({
    id: db[db.length-1].id + 1,
    title: req.body.title,
    description: req.body.description
  })

  return res.status(201).send({
    success: true,
    message: 'New Todo successfully created'
  })
})

app.get('/todo/:id', (req, res) => {
  let todo = db.filter(item => item.id == req.params.id)
  if (todo.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'Todo not found'
    })
  }
  return res.status(200).send({
    success: true,
    message: `Here is the todo of id ${req.params.id}`,
    todo: todo[0]
  })
})

app.put('/todo/:id', (req, res) => {
  let todo = db.filter(item => item.id == req.params.id)
  if (todo.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'Todo not found'
    })
  }

  db = db.map(item => {
    if (item.id == req.params.id) item = { id: item.id, ...req.body }
    return item
  })

  return res.status(200).send({
    success: true,
    message: 'Todo successfully updated',
  })
})

app.delete('/todo/:id', (req, res) => {
  let todo = db.filter(item => item.id == req.params.id)
  if (todo.length === 0) {
    return res.status(404).send({
      success: false,
      message: 'Todo not found'
    })
  }

  db = db.filter(item => item.id != req.params.id)

  return res.status(200).send({
    success: true,
    message: 'Todo successfully deleted'
  })
})

// Jalankan server
app.listen(PORT, () => {
  console.log('Server is listening on PORT', PORT)
})

