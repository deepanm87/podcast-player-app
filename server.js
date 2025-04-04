import express from 'express'
const app = express()

app.get('/', (req, res) => {
  res.send('Hello, Deepan')
})

app.listen(3000)