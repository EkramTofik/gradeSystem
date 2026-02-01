const addCourse = document.querySelector(".addCourses");
const hidden = document.querySelector(".hidden");
const form = document.querySelector("form");
const insertBtn = document.querySelector(".insertBtn");
const title = document.querySelector(".title");
const year = document.querySelector(".year");
const semester = document.querySelector(".semester");
const department = document.querySelector(".department");
const creditHour = document.querySelector(".creditHour");
const table = document.querySelector("table");
addCourse.addEventListener("click", (e) => {
  e.preventDefault();
  form.classList.remove("hidden");
});
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await fetch("http://localhost:3000/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title.value,
      year: year.value,
      semester: semester.value,
      department: department.value,
      creditHour: creditHour.value,
    }),
  });
});
async function display() {
  let data = await fetch("http://localhost:3000/courses");
  let courses = await data.json();
  courses.forEach((course) => {
    let tr = document.createElement("tr");
    let tdTitle = document.createElement("td");
    tdTitle.textContent = course.title;
    let tdYear = document.createElement("td");
    tdYear.textContent = course.year;
    let tdSemester = document.createElement("td");
    tdSemester.textContent = course.semester;
    let tdDepartment = document.createElement("td");
    tdDepartment.textContent = course.department;
    let tdCreditHour = document.createElement("td");
    tdCreditHour.textContent = course.creditHour;
    tr.append(tdTitle);
    tr.append(tdTitle);
    tr.append(tdSemester);
    tr.append(tdDepartment);
    tr.append(tdCreditHour);
    table.append(tr);
  });
}
display();
