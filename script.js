
const users = [
    { username: "professor1", password: "password1", divisions: ["A", "B"] },
    { username: "professor2", password: "password2", divisions: ["C"] }
];

const students = [
    { name: "Yash", rollNo: "101", division: "A", attendance: {} },
    { name: "Anjali", rollNo: "102", division: "A", attendance: {} },
    { name: "Ravi", rollNo: "201", division: "B", attendance: {} }
];
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message;

    if (type === 'error') {
        messageDiv.style.color = 'red';
    } else {
        messageDiv.style.color = 'green';
    }
}

if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        const user = users.find(
            user => user.username === usernameInput && user.password === passwordInput
        );

        if (user) {
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            showMessage('Invalid username or password.', 'error');
        }
    });
}

window.onload = function() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        window.location.href = 'login.html'; 
    }

    const divisionSelect = document.getElementById('divisionSelect');
    loggedInUser.divisions.forEach(division => {
        let option = document.createElement("option");
        option.value = division;
        option.textContent = `Division ${division}`;
        divisionSelect.appendChild(option);
    });

    const studentDivisionSelect = document.getElementById('studentDivision');
    loggedInUser.divisions.forEach(division => {
        let option = document.createElement("option");
        option.value = division;
        option.textContent = `Division ${division}`;
        studentDivisionSelect.appendChild(option);
    });
};
function loadStudents() {
    const divisionSelect = document.getElementById('divisionSelect');
    const selectedDivision = divisionSelect.value;

    if (!selectedDivision) return;

    const studentListDiv = document.getElementById('studentList');
    studentListDiv.innerHTML = ''; 

    const filteredStudents = students.filter(student => student.division === selectedDivision);

    filteredStudents.forEach(student => {
        const label = document.createElement("label");

        label.innerHTML = `
            ${student.name} (Roll No: ${student.rollNo})
            <input type="checkbox" data-rollno="${student.rollNo}" class="attendanceToggle">
            Present/Absent`;

        studentListDiv.appendChild(label);
    });

    document.getElementById('attendanceSection').style.display = 'block';
}

document.getElementById('submitAttendance').addEventListener('click', function() {
    const dateSelected = document.getElementById('dateSelect').value;

    if (!dateSelected) {
        showMessage("Please select a date.", "error");
        return;
    }

    const attendanceToggles = document.querySelectorAll('.attendanceToggle');

    attendanceToggles.forEach(toggle => {
        const rollNo = toggle.dataset.rollno;
        const isPresent = toggle.checked;

        const studentRecord = students.find(student => student.rollNo === rollNo);
        if (!studentRecord.attendance) {
            studentRecord.attendance = {};
        }

        studentRecord.attendance[dateSelected] = { present: isPresent };
    });

    showMessage("Attendance submitted successfully.", "success");
});
document.getElementById('addStudentButton').addEventListener('click', function() {
    const nameInput = document.getElementById('studentName').value.trim();
    const rollNoInput = document.getElementById('rollNo').value.trim();
    const divisionInput = document.getElementById('studentDivision').value;

    if (!nameInput || !rollNoInput || !divisionInput) {
        showMessage("Please fill in all fields.", "error");
        return;
    }

    students.push({ name: nameInput, rollNo: rollNoInput, division: divisionInput });
    showMessage(`Student ${nameInput} added successfully!`, 'success');

    document.getElementById('studentName').value = '';
    document.getElementById('rollNo').value = '';
});

document.getElementById('generateReportButton').addEventListener('click', function() {
    const reportMonthInput = document.getElementById('reportMonth').value;

    if (!reportMonthInput) {
        showMessage("Please select a month.", "error");
        return;
    }

    const reportOutputDiv = document.getElementById('reportOutput');
    reportOutputDiv.innerHTML = '';

    students.forEach(student => {
        let presentDaysCount = 0;
        let absentDaysCount = 0;

        Object.keys(student.attendance || {}).forEach(date => {
            if (date.startsWith(reportMonthInput)) {
                if (student.attendance[date].present) {
                    presentDaysCount++;
                } else {
                    absentDaysCount++;
                }
            }
        });

        reportOutputDiv.innerHTML += `<p>${student.name}: Present - ${presentDaysCount} days, Absent - ${absentDaysCount} days</p>`;
    });
});
