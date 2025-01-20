
const usersDataMockup =
[
    { username: "professor1", password: "password1", divisions: ["A", "B"] },
    { username: "professor2", password: "password2", divisions: ["C"] }
];

const studentsDataMockup =
[
  { name: "Yash", rollNo: "101", division: "A", attendance: {} },
  { name: "Anjali", rollNo: "102", division: "A", attendance: {} },
  { name: "Ravi", rollNo: "201", division: "B", attendance: {} },
];

users.push(...usersDataMockup);
students.push(...studentsDataMockup);