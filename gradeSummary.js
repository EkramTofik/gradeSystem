import { studentDb } from "./studentDatabase.js";

const formSection = document.querySelector(".formSection");
const xIcon = document.querySelector(".x-icon");
const addStudentBtn = document.querySelector(".addStudentBtn");
const overlay = document.querySelector(".overlay");
addStudentBtn.addEventListener("click", () => {
  formSection.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});
xIcon.addEventListener("click", () => {
  formSection.classList.toggle("hidden");
});
async function ask(question, textLable) {
  return new Promise((resolve) => {
    let lable = document.createElement("label");
    lable.textContent = textLable;
    formSection.append(lable);
    formSection.append(document.createElement("br"));
    let inputFromUser = document.createElement("input");
    inputFromUser.placeholder = question;
    inputFromUser.style.outline = "none";
    inputFromUser.style.height = "20px";
    inputFromUser.style.borderRadius = "5px";
    inputFromUser.style.borderColor = " rgb(223, 219, 219)";
    inputFromUser.style.width = "200px";
    formSection.append(inputFromUser);
    formSection.append(document.createElement("br"));
    inputFromUser.focus();

    inputFromUser.addEventListener("keydown", (input) => {
      if (input.key == "Enter") {
        input.preventDefault();
        resolve(inputFromUser.value);
      }
    });
  });
}
async function studentName() {
  const name = await ask("enter student name", "student name");
  while (
    name.length < 3 ||
    name.length > 30 ||
    !/^[a-zA-Z\s\-:&']+$/.test(name)
  ) {
    error("student name length must be (3-30)");
    name = await ask(`enter student name`, "student name");
  }

  return name;
}
async function studentId() {
  const id = await ask("enter student ID", "student id");
  while (
    id.length < 3 ||
    id > 10 ||
    !/^[A-Za-z]{2,5}\d{3,5}\/\d{2}$/.test(id)
  ) {
    error("student id format (ETS0421/15)");
    id = await ask("enter student ID", "student id");
  }
  return id;
}

// main().then((answer) => console.log(answer));
function error(message) {
  let error = document.createElement("p");
  error.textContent = message;
  error.style.color = "red";
  formSection.append(error);
}
let totalGpt = [];
let totalCredithour = [];
async function calculateCourse(semester) {
  let input = await ask(`enter course number `, "course number");
  while (
    isNaN(input) ||
    input === "" ||
    Number(input) < 0 ||
    Number(input) > 7
  ) {
    error("number of course must be (4 - 7)");
    input = await ask(`enter course number `, "course number");
  }
  return input;
}
async function courseTitle(courseNumber) {
  let courseValue = document.createElement("h3");
  courseValue.textContent = `course ${courseNumber}`;
  formSection.append(courseValue);
  let courseName = await ask(`enter course tittle `, "course tittle");

  while (
    courseName.length < 3 ||
    courseName.length > 30 ||
    !/^[a-zA-Z\s\-:&']+$/.test(courseName)
  ) {
    error("course title length must be (3-30)");
    courseName = await ask(`enter course tittle`, "course tittle");
  }
  return courseName;
}
async function CTS(courseNumber) {
  let cts = await ask(`enter ECTS value `, "ECTS value");
  while (isNaN(cts) || cts === null || cts === "" || cts <= 0 || cts > 8) {
    error("ECTS value must be (1-8)");

    cts = await ask(`enter ECTS value `, "ECTS value");
  }
  return cts;
}
async function courseCode(courseNumber) {
  let courseCode = await ask(`enter course code`, "course code");
  while (
    courseCode.length < 3 ||
    courseCode > 30 ||
    !/^[a-zA-Z0-9\s\-:&']+$/.test(courseCode)
  ) {
    error("course code formSectionat like EN103");
    courseCode = await ask(`enter course code `, "course code");
  }
  return courseCode;
}
async function calculateRank(courseNumber) {
  let item = await ask(`Rank out of 100 `, "rank");
  while (isNaN(item) || item === "" || item < 0 || item > 100) {
    error("rank must be (0-100)");
    item = await ask(`Rank out of 100  `, "rank");
  }
  if (item === 0) {
    console.log("Non Grade");
  } else {
    switch (true) {
      case item < 40 && item > 0:
        return [0, "F"];
      case item < 45 && item >= 40:
        return [1, "D"];
      case item < 50 && item >= 45:
        return [1.75, "C-"];
      case item < 60 && item >= 50:
        return [2, "C"];
      case item < 65 && item >= 60:
        return [2.5, "C+"];
      case item < 70 && item >= 65:
        return [2.75, "B-"];

      case item < 75 && item >= 70:
        return [3, "B"];

      case item < 80 && item >= 75:
        return [3.5, "B+"];

      case item < 85 && item >= 80:
        return [3.75, "A-"];

      case item < 90 && item >= 85:
        return [4, "A"];

      case item >= 90 && item <= 100:
        return [4, "A+"];
      default:
        console.log(` default ${item}`);
        break;
    }
  }
}
async function creditHour(courseNumber) {
  let item = await ask(`enter  credithour   `, "credit hour");
  while (item < 1 || item > 12 || isNaN(item) || item === "") {
    error("credithour must be (1-12)");
    item = await ask(`enter  credithour   `, "credit hour");
  }
  return item;
}
function GPT(credithour, rank) {
  let gptSum = credithour * rank[0];
  return gptSum;
}
function calculateGPA(rankArray, credithourArray) {
  let gpaSum = rankArray.reduce((sum, value, index) => {
    sum += value * credithourArray[index];
    if (index == rankArray.length - 1) {
      let credithourSum = credithourArray.reduce(
        (accu, value) => accu + value,
        0,
      );
      return sum / credithourSum;
    }
    return sum;
  }, 0);
  return gpaSum;
}
async function reduce(sum) {
  let summation = sum.reduce((accu, item) => accu + item, 0);
  return summation;
}
async function cumulative(totalGpt, totalCredithour) {
  let sumGpt = await reduce(totalGpt);
  let sumCredithr = await reduce(totalCredithour);
  return sumGpt / sumCredithr;
}
async function calling(eachSemester, semesterNumber) {
  let courseNameArray = [];
  let courseCodeResultArray = [];
  let ctsResultArray = [];
  let rankResultArray = [];
  let gradeResultArray = [];
  let creditHourResultArray = [];
  let gptResultArray = [];
  let courseNumber = await calculateCourse(eachSemester);
  for (let x = 0; x < courseNumber; x++) {
    let courseName = await courseTitle(x + 1);
    courseNameArray.push(courseName);
    let courseCodeResult = await courseCode(x + 1);
    courseCodeResultArray.push(courseCodeResult);
    let ctsResult = await CTS(x + 1);
    ctsResultArray.push(Number(ctsResult));
    let rankResult = await calculateRank(x + 1);

    rankResultArray.push(Number(rankResult[0]));
    let creditHourResult = await creditHour(x + 1);
    creditHourResultArray.push(Number(creditHourResult));
    totalCredithour.push(Number(creditHourResult));
    gradeResultArray.push(rankResult[1]);
    let gptResult = GPT(creditHourResult, rankResult);
    gptResultArray.push(Number(gptResult));
    totalGpt.push(Number(gptResult));
  }
  let gpaResult = calculateGPA(rankResultArray, creditHourResultArray);
  let cumulativeResult = await cumulative(totalGpt, totalCredithour);

  if (eachSemester == semesterNumber) {
    let submitBtn = document.createElement("button");
    submitBtn.textContent = "submit";
    submitBtn.type = "submit";
    submitBtn.style.marginLeft = "200px";
    submitBtn.style.marginTop = "20px";
    formSection.append(submitBtn);
    submitBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      formSection.classList.toggle("hidden");
      overlay.classList.toggle("hidden");
      let table = await display(
        courseNameArray,
        courseCodeResultArray,
        ctsResultArray,
        rankResultArray,
        creditHourResultArray,
        gptResultArray,
        gpaResult,
        gradeResultArray,
        cumulativeResult,
      );
      let header = document.createElement("h2");
      header.textContent = "Grade Summary";
      document.body.append(header);
      let truthy = true;
      for (let x in table) {
        console.log(x);
        const resultTable = document.createElement("table");
        const tableHead = document.createElement("thead");
        const tableBody = document.createElement("tbody");
        for (let z of Object.keys(table[x][0])) {
          // {[{a:1,b:2,c:3},{f:0}],[{d:4,f:5}]}
          const eachHeader = document.createElement("th");
          eachHeader.textContent = z;
          eachHeader.style.borderStyle = "solid";
          eachHeader.style.borderWidth = "1px";
          eachHeader.style.padding = "5px";
          tableHead.append(eachHeader);
        }
        resultTable.append(tableHead);
        for (let y of table[x]) {
          resultTable.style.borderCollapse = "collapse";
          const row = document.createElement("tr");
          for (let index of Object.values(y)) {
            const column = document.createElement("td");
            column.textContent = index;
            column.style.borderStyle = "solid";
            column.style.borderWidth = "1px";
            column.style.padding = "5px";
            row.append(column);
            tableBody.append(row);
            resultTable.append(tableBody);
          }
          document.body.append(resultTable);
        }
        if (truthy) {
          header = document.createElement("h2");
          header.textContent = "Semester Summary";
          document.body.append(header);
        }
        truthy = false;
      }
    });
  }
}
async function display(...result) {
  console.log("Grade Report");
  let rows = result[0].map((_, i) => ({
    CourseName: result[0][i],
    CourseCode: result[1][i],
    CTS: result[2][i],
    Rank: result[3][i],
    CreditHour: result[4][i],
    LetterGrade: result[7][i],
    GPT: result[5][i],
  }));
  let semesterGpt = await reduce(result[5]);
  let semesterCreditHour = await reduce(result[4]);
  let final = [
    {
      GPA: result[6],
      Cumulative: result[8],
      SemesterPoint: semesterGpt,
      SemesterCreditHour: semesterCreditHour,
    },
  ];
  studentDb.push(rows);
  studentDb.push(final);
  return { rows, final };
}
async function calculateSemester() {
  let studName = await studentName();
  let studId = await studentId();
  let semester = await ask(`enter number of semester`, "number of semester");
  while (isNaN(semester) || semester === "" || semester <= 0 || semester > 14) {
    error("number of semesters must be (1-14)");
    semester = await ask(`enter number of semester  `, "number of semester");
  }
  for (let i = 1; i <= semester; i++) {
    let semesterValue = document.createElement("h3");
    semesterValue.textContent = `semster ${i}`;
    semesterValue.style.fontWeight = "bold";
    formSection.append(semesterValue);
    await calling(i, semester);
  }

  let gptTotal = await reduce(totalGpt);
  let creditTotal = await reduce(totalCredithour);
  let cumulativeResult = await cumulative(totalGpt, totalCredithour);
  let summary = [
    {
      TotalCredit: creditTotal,
      cumulative: cumulativeResult,
      TotalGpt: gptTotal,
    },
  ];
  for (let x of summary) {
    for (let [z, y] of Object.entries(x)) {
      const text = document.createElement("p");
      text.textContent = `${z}:${y}`;
      document.body.append(text);
    }
  }
}

calculateSemester();
