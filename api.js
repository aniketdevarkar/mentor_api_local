const students = [
  {
    student_id: 1,
    student_name: "aniket",
  },
];

const mentors = [
  {
    mentor_id: 1,
    mentor_name: "rahul",
    students_assigned: [],
  },
];

module.exports = { students, mentors };

/*
  post:  mentor array with {mentor_id,mentor_name}\\to create mentor {path: - createMentor/mentor_name}
  post: condition(student assigned to mentor should not show in list) student array with {student_id,student_name}\\to create mentor
  put:     select one mentor add multiple student
  {mentor_id,mentor_name,students_assigned:[{studen_id,student_name},{}]} ///path: /assignStudent/:mentor_name

  put/delete select student and assign one mentor or change
  get : to get all student for particular mentor   
*/
