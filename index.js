const express = require("express");
const app = express();

app.use(express.json());

let globalIdCount = 1;

const { students, mentors } = require("./api");

app.get("/", (req, res) => {
  res.json(mentors);
});

app.get("/students", (req, res) => {
  res.json(students);
});

app.get("/mentors", (req, res) => {
  res.json(mentors);
});

//To create mentor in mentor api
app.post("/createMentor/:mentor_name", (req, res) => {
  mentor_name = req.params.mentor_name;
  const mentorPresent = mentors.find(
    (mentor) => mentor.mentor_name === mentor_name
  );
  if (mentorPresent) {
    return res
      .status(400)
      .send("Mentor is already present try with different name");
  }
  const mentor = {
    mentor_id: mentors.length + 1,
    mentor_name: mentor_name,
    students_assigned: [],
  };
  mentors.push(mentor);
  res.send(mentor);
});

//To create student in student api

app.post("/createStudent", (req, res) => {
  const student_name = req.body.student_name;
  const studentPresent = students.find(
    (student) => student.student_name === student_name
  );
  if (studentPresent) {
    return res
      .status(400)
      .send("Student with this name already present try using other name");
  }
  // globalIdCount++;
  // const student = {
  //   student_id: globalIdCount,
  //   student_name: student_name,
  // };
  students.push(req.body);
  res.status(200).json({ message: "student created" });
});

//assign students to mentor

app.put("/assignStudents/:mentor_name", async (req, res) => {
  const mentor_name = req.params.mentor_name;
  // console.log(mentor_name);
  const mentorPresent = mentors.find(
    (mentor) => mentor.mentor_name === mentor_name
  );
  // console.log(mentorPresent);
  if (!mentorPresent) {
    return res
      .status(400)
      .send("Mentor is not present with this name try something else");
  }
  const studentNames = req.body;

  const mentorIndex = mentors.indexOf(mentorPresent);

  // console.log("mentorIndex=>", mentorIndex);

  studentNames.forEach(async (student_name, index) => {
    console.log("namepassed=>>", student_name);
    const assignStudent = await students.find((student, index) => {
      return student.student_name === student_name;
    });
    if (!assignStudent) {
      return res
        .status(400)
        .send(`${student_name} is not present in the students api`);
    }
    mentors[mentorIndex].students_assigned.push(assignStudent);
    index++;
    const studentIndex = students.indexOf(assignStudent);
    students.splice(studentIndex, 1);
    // console.log(studentIndex, assignStudent);
    if (index === studentNames.length && assignStudent) return res.send("ok");
  });
});

// to change mentor or assign mentor to particular student
app.put("/changeMentor/:mentor_name", async (req, res) => {
  const mentor_name = req.params.mentor_name;
  const mentorPresent = mentors.find(
    (mentor) => mentor.mentor_name === mentor_name
  );
  if (!mentorPresent) {
    return res.status(400).send("mentor is not present with this name");
  }
  const student_name = req.query.student_name;

  const studentPresent = students.find(
    (student) => student.student_name === student_name
  );

  console.log("quer=>>>", student_name);
  let studentPresentInMentor, mentorIndexToDelete, studentIndexToDelete;
  await mentors.forEach((mentor, index) => {
    const dummy = mentor.students_assigned.find(
      (student, studentIndex) => student.student_name === student_name
    );
    if (dummy) {
      studentPresentInMentor = dummy;
      mentorIndexToDelete = index;
      studentIndexToDelete = mentor.students_assigned.indexOf(dummy);
      mentor.students_assigned.splice(studentIndexToDelete, 1);
    }
  });

  if (!(studentPresentInMentor || studentPresent)) {
    return res.status(400).send("student is not present");
  }

  const mentorIndex = mentors.indexOf(mentorPresent);
  const studentIndex = students.indexOf(studentPresent);
  let actualStudent, actualIndex;

  if (studentPresentInMentor) {
    actualStudent = studentPresentInMentor;
    actualIndex = studentIndexToDelete;
    mentors[mentorIndex].students_assigned.splice(actualIndex, 1);
  } else {
    actualIndex = studentIndex;
    actualStudent = studentPresent;
    students.splice(actualIndex, 1);
  }

  mentors[mentorIndex].students_assigned.push(actualStudent);
  res.send(actualStudent);
});

// to get students assigned to particular mentor
app.get("/studentsAssigned/:mentor_name", (req, res) => {
  const mentor_name = req.params.mentor_name;
  const mentorPresent = mentors.find(
    (mentor) => mentor.mentor_name === mentor_name
  );
  if (!mentorPresent) {
    return res.status(400).send("Mentor with this name is not present");
  }
  res.send(mentorPresent.students_assigned);
});

app.listen(8080, () => console.log("app is running on 8080"));
