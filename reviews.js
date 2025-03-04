document.addEventListener("DOMContentLoaded", function () {
    loadTeachers();
    loadApprovedReviews(); // Ensure reviews are loaded on page load
    setInterval(loadApprovedReviews, 60000); // Refresh reviews every 60 seconds
});

/* Load Teachers into Dropdown */
function loadTeachers() {
    fetch("updated_faculty_data.json") // Load teacher data file
        .then(response => response.json())
        .then(data => {
            const teacherSelect = document.getElementById("teacherSelect");
            teacherSelect.innerHTML = '<option value="">Select a Teacher</option>'; // Reset dropdown

            data.forEach(teacher => {
                let option = document.createElement("option");
                option.value = teacher.name;
                option.textContent = teacher.name;
                teacherSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading teachers:", error));
}

/* Star Rating System */
let selectedStars = { behavior: 0, grading: 0, teaching: 0 };

document.querySelectorAll(".behavior-stars .star").forEach(star => {
    star.addEventListener("click", function () {
        selectedStars.behavior = parseInt(this.getAttribute("data-value"));
        updateStarSelection("behavior-stars", selectedStars.behavior);
    });
});

document.querySelectorAll(".grading-stars .star").forEach(star => {
    star.addEventListener("click", function () {
        selectedStars.grading = parseInt(this.getAttribute("data-value"));
        updateStarSelection("grading-stars", selectedStars.grading);
    });
});

document.querySelectorAll(".teaching-stars .star").forEach(star => {
    star.addEventListener("click", function () {
        selectedStars.teaching = parseInt(this.getAttribute("data-value"));
        updateStarSelection("teaching-stars", selectedStars.teaching);
    });
});

function updateStarSelection(className, value) {
    document.querySelectorAll(`.${className} .star`).forEach(star => star.classList.remove("active"));
    for (let i = 0; i < value; i++) {
        document.querySelectorAll(`.${className} .star`)[i].classList.add("active");
    }
}

/* Submit Review */
function submitReview() {
    const studentId = document.getElementById("studentId").value.trim();
    const teacherName = document.getElementById("teacherSelect").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const gradeReceived = document.getElementById("grade").value.trim(); // Optional Field
    const reviewText = document.getElementById("reviewText").value.trim();

    if (!studentId || !teacherName || !subject || reviewText === "" ||
        selectedStars.behavior === 0 || selectedStars.grading === 0 || selectedStars.teaching === 0) {
        alert("Please complete all required fields.");
        return;
    }

    let review = {
        teacher_name: teacherName,
        student_id: studentId,
        subject: subject,
        teacher_behavior: selectedStars.behavior,
        grading_criteria: selectedStars.grading,
        teaching_quality: selectedStars.teaching,
        review_text: reviewText
    };

    if (gradeReceived) {
        review.grade_received = gradeReceived;
    }

    fetch("https://teacher-recommendationn.onrender.com/api/reviews/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to submit review.");
        }
        return response.json();
    })
    .then(data => {
        console.log("Review submitted:", data);
        alert("Review submitted successfully!");
        loadApprovedReviews(); // Refresh reviews after submission
    })
    .catch(error => console.error("Error submitting review:", error));
}

/* Load and Display Approved Reviews */
function loadApprovedReviews() {
    fetch("https://teacher-recommendationn.onrender.com/api/reviews/approved/?nocache=" + new Date().getTime()) // Cache-buster
        .then(response => response.json())
        .then(data => {
            console.log("Approved Reviews:", data); // Debugging API response

            const reviewsContainer = document.getElementById("reviews-container");
            const teacherFilter = document.getElementById("teacherFilter");

            reviewsContainer.innerHTML = ""; // Clear previous reviews
            teacherFilter.innerHTML = '<option value="all">All Teachers</option>'; // Reset filter before adding options

            if (data.length === 0) {
                reviewsContainer.innerHTML = "<p>No approved reviews available.</p>";
                return;
            }

            let teachers = new Set();

            data.forEach(review => {
                teachers.add(review.teacher_name);
            });

            teachers.forEach(teacher => {
                let option = document.createElement("option");
                option.value = teacher;
                option.textContent = teacher;
                teacherFilter.appendChild(option);
            });

            function displayReviews(filterTeacher = "all") {
                reviewsContainer.innerHTML = "";

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

            displayReviews(); // Show all reviews initially

            window.filterReviews = function () {
                let selectedTeacher = teacherFilter.value;
                displayReviews(selectedTeacher);
            };
        })
        .catch(error => console.error("Error fetching reviews:", error));
}
