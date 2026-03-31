// LOAD STUDENTS FOR TEACHER
function loadStudents() {
    fetch("http://localhost:3000/students")
        .then(res => res.json())
        .then(data => {
            let html = "";

            data.forEach(s => {
                html += `
                <div>
                    ${s.roll_no} - ${s.name}
                    <select id="${s.roll_no}">
                        <option value="P">P</option>
                        <option value="A">A</option>
                    </select>
                </div>
            `;
            });

            document.getElementById("studentList").innerHTML = html;
        });
}

// SUBMIT ATTENDANCE
function submitAttendance() {
    const subject_id = document.getElementById("subject").value;
    const date = document.getElementById("date").value;

    fetch("http://localhost:3000/students")
        .then(res => res.json())
        .then(students => {

            let attendance = [];

            students.forEach(s => {
                const status = document.getElementById(s.roll_no).value;
                attendance.push({
                    roll_no: s.roll_no,
                    status: status
                });
            });

            fetch("http://localhost:3000/attendance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    subject_id,
                    date,
                    attendance
                })
            })
                .then(res => res.text())
                .then(msg => alert(msg));
        });
}

// STUDENT REPORT
function getReport() {
    const roll = document.getElementById("roll").value;

    fetch(`http://localhost:3000/report/${roll}`)
    .then(res => res.json())
    .then(data => {
        if (data.length > 0) {
            const percent = parseFloat(data[0].percentage).toFixed(2);

            document.getElementById("overall").innerHTML =
                "Overall Attendance: " + percent + "%";

            // CLEAR OLD CHART
            document.getElementById("chart").innerHTML = "";

            const ctx = document.getElementById("chart").getContext("2d");

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Present', 'Absent'],
                    datasets: [{
                        data: [percent, 100 - percent],
                    }]
                }
            });
        }
    });
}

// SUBJECT WISE
function getSubject() {
    const roll = document.getElementById("roll").value;

    fetch(`http://localhost:3000/subject-report/${roll}`)
    .then(res => res.json())
    .then(data => {
        let html = "<h3>Subject Wise Attendance</h3>";

        data.forEach(d => {
            html += `
                <p>${d.subject_name} : ${parseFloat(d.percentage).toFixed(2)}%</p>
            `;
        });

        document.getElementById("subject").innerHTML = html;
    });
}

// DATE WISE
function getByDate() {
    const roll = document.getElementById("roll").value;
    const date = document.getElementById("date").value;

    fetch(`http://localhost:3000/by-date/${roll}/${date}`)
    .then(res => res.json())
    .then(data => {

        let html = "<h3>Day Attendance</h3>";

        data.forEach(d => {

            let color = "gray";

            if (d.status === 'P') color = "green";
            else if (d.status === 'A') color = "red";
            else if (d.status === 'Not Marked') color = "orange";

            html += `
                <p style="color:${color}; font-weight:bold;">
                    ${d.subject_name} : ${d.status}
                </p>
            `;
        });

        document.getElementById("datewise").innerHTML = html;
    });
}