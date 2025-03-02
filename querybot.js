let teacherData = []; // Store teacher data globally

document.addEventListener("DOMContentLoaded", function () {
    loadTeachers();
});

/* Load Teachers into Dropdown */
function loadTeachers() {
    fetch("teac.json") // Load teacher data file
        .then(response => response.json())
        .then(data => {
            teacherData = Array.isArray(data) ? data : [data]; // Ensure data is an array
            const teacherSelect = document.getElementById("teacherSelect");

            teacherData.forEach(teacher => {
                let option = document.createElement("option");
                option.value = teacher.name;
                option.textContent = teacher.name;
                teacherSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading teachers:", error));
}

/* Handle Query & Display Response */
function getTeacherInfo() {
    const teacherName = document.getElementById("teacherSelect").value;
    const queryType = document.getElementById("queryType").value;

    if (!teacherName || !queryType) {
        document.getElementById("responseText").innerText = "Please select a teacher and a query.";
        return;
    }

    const selectedTeacher = teacherData.find(t => t.name === teacherName);
    if (selectedTeacher) {
        document.getElementById("responseText").innerText = selectedTeacher[queryType] || "No information available.";
    } else {
        document.getElementById("responseText").innerText = "Error retrieving teacher data.";
    }
}
