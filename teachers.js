document.addEventListener("DOMContentLoaded", function () {
    fetch("updated_faculty_data.json")
        .then(response => response.json())
        .then(data => {
            const teachersContainer = document.getElementById("teachers-container");
            
            data.forEach(teacher => {
                const teacherCard = document.createElement("div");
                teacherCard.classList.add("teacher-card");

                teacherCard.innerHTML = `
                    <img src="${teacher.image_url}" alt="${teacher.name}">
                    <h2>${teacher.name}</h2>
                    <p><strong>Position:</strong> ${teacher.position}</p>
                    <p>${teacher.academic_info}</p>
                    <p><strong>Email:</strong> <a href="mailto:${teacher.email}" style="color:#FFD369; text-decoration: none;">${teacher.email}</a></p>
                    <p><a href="${teacher.linkedin_url}" target="_blank" style="color:#FFD369; text-decoration: none;">LinkedIn Profile</a></p>
                `;

                teachersContainer.appendChild(teacherCard);
            });
        })
        .catch(error => console.error("Error loading teachers:", error));
});

/* Search Function */
function searchTeachers() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let teacherCards = document.getElementsByClassName("teacher-card");

    for (let i = 0; i < teacherCards.length; i++) {
        let name = teacherCards[i].getElementsByTagName("h2")[0].innerText.toLowerCase();
        let position = teacherCards[i].getElementsByTagName("p")[0].innerText.toLowerCase();

        if (name.includes(input) || position.includes(input)) {
            teacherCards[i].style.display = "block";
        } else {
            teacherCards[i].style.display = "none";
        }
    }
}
