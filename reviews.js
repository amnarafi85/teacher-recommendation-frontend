document.addEventListener("DOMContentLoaded", function () {
    loadTeachers();
    loadApprovedReviews(); // ✅ Load approved reviews when the page loads
});

/* Load Teachers for Dropdown */
function loadTeachers() {
    fetch("https://teacher-recommendationn.onrender.com/api/teachers/")
        .then(response => response.json())
        .then(data => {
            const teacherSelect = document.getElementById("teacher");
            teacherSelect.innerHTML = ""; // Clear previous options

            data.forEach(teacher => {
                let option = document.createElement("option");
                option.value = teacher.name;
                option.textContent = teacher.name;
                teacherSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching teachers:", error));
}

/* Load and Display Approved Reviews */
function loadApprovedReviews() {
    fetch("https://teacher-recommendationn.onrender.com/api/reviews/approved/")
        .then(response => response.json())
        .then(data => {
            const reviewsContainer = document.getElementById("reviews-container");
            const teacherFilter = document.getElementById("teacherFilter");

            reviewsContainer.innerHTML = ""; // Clear old data
            teacherFilter.innerHTML = '<option value="all">All Teachers</option>'; // Reset filter

            if (data.length === 0) {
                reviewsContainer.innerHTML = "<p>No reviews available.</p>"; // Handle empty case
                return;
            }

            let teachers = new Set();
            data.forEach(review => {
                teachers.add(review.teacher_name);
            });

            // Populate the teacher filter dropdown
            teachers.forEach(teacher => {
                let option = document.createElement("option");
                option.value = teacher;
                option.textContent = teacher;
                teacherFilter.appendChild(option);
            });

            function displayReviews(filterTeacher = "all") {
                reviewsContainer.innerHTML = ""; // Clear previous reviews
                
                data.forEach(review => {
                    if (filterTeacher !== "all" && review.teacher_name !== filterTeacher) return;

                    let reviewElement = document.createElement("div");
                    reviewElement.classList.add("review-card");

                    reviewElement.innerHTML = `
                        <h3>${review.teacher_name} <span class="student-id">(Student ID: ${review.student_id})</span></h3>
                        <p><strong>Subject:</strong> ${review.subject}</p>
                        <p><strong>Grade Received:</strong> ${review.grade_received || "N/A"}</p>
                        <p class="star-rating"><strong>Teacher Behavior:</strong> ⭐ ${review.teacher_behavior}/5</p>
                        <p class="star-rating"><strong>Grading Criteria:</strong> ⭐ ${review.grading_criteria}/5</p>
                        <p class="star-rating"><strong>Teaching Quality:</strong> ⭐ ${review.teaching_quality}/5</p>
                        <p class="review-text"><strong>Review:</strong> ${review.review_text}</p>
                        <hr>
                    `;
                    reviewsContainer.appendChild(reviewElement);
                });
            }

            displayReviews(); // Show all reviews by default

            // Add event listener for filter
            teacherFilter.addEventListener("change", function () {
                displayReviews(this.value);
            });
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
            document.getElementById("reviews-container").innerHTML = "<p>Failed to load reviews.</p>";
        });
}

/* Submit Review Form */
document.getElementById("review-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
        student_id: document.getElementById("student_id").value,
        teacher_name: document.getElementById("teacher").value,
        subject: document.getElementById("subject").value,
        grade_received: document.getElementById("grade_received").value,
        teacher_behavior: document.getElementById("teacher_behavior").value,
        grading_criteria: document.getElementById("grading_criteria").value,
        teaching_quality: document.getElementById("teaching_quality").value,
        review_text: document.getElementById("review_text").value,
    };

    fetch("https://teacher-recommendationn.onrender.com/api/reviews/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert("Review submitted successfully!");
        document.getElementById("review-form").reset();
        loadApprovedReviews(); // ✅ Reload approved reviews after submission
    })
    .catch(error => {
        console.error("Error submitting review:", error);
        alert("Failed to submit review.");
    });
});
