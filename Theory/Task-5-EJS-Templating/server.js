const express = require('express');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home', {
    title: 'EJS Templating',
    heading: 'Welcome to EJS',
    message: 'This HTML page is rendered using an EJS template.',
    student: {
      name: 'Harsh',
      rollNumber: '7930',
      course: 'Backend Development'
    }
  });
});

app.get('/students', (req, res) => {
  const students = [
    { id: 1, name: 'Harsh', course: 'Backend Development', semester: 6 },
    { id: 2, name: 'Rahul', course: 'Node.js', semester: 6 },
    { id: 3, name: 'Priya', course: 'Express.js', semester: 6 }
  ];

  res.render('students', {
    title: 'Students List',
    students
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
