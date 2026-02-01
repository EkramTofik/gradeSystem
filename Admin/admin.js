async function studentInfo() {
  let result = await fetch("http://localhost:3000/students");
  let solution = await result.json();
  return solution;
}

async function groupById() {
  let studentObj = await studentInfo();
  const grouped = {};
  for (const student of studentObj) {
    id = student.StudentID;
    if (!grouped[id]) {
      grouped[id] = {
        studentName: student.StudentName,
        record: [],
      };
    }
    grouped[id].record.push(student);
  }
  return grouped;
}
async function calculateGPA(params) {
  let creditHours = [];
  let rank = [];
  let gpa;
  for (let x of params) {
    creditHours.push(x[2]);
    rank.push(x[1]);
  }

  gpa = rank.reduce((accum, item, index) => {
    accum += item * creditHours[index];
    if (rank.length === index - 1) {
      let totalCredithour = creditHours.reduce(
        (accum, item) => accum + item,
        0,
      );
      return accum / totalCredithour;
      console.log(accum / totalCredithour);
    }
    return accum;
    console.log(accum);
  }, 0);
  console.log(gpa);
}
async function display() {
  let showResult = await groupById();
  for (let key in showResult) {
    let year = Object.values(
      showResult[key].record.map((eachYear) => eachYear.Year),
    );
    let semester = Object.values(
      showResult[key].record.map((eachYear) => eachYear.Semester),
    );
    let maxYear = Math.max(...year);
    let maxSemester = Math.max(...semester);
    for (let y = 1; y <= maxYear; y++) {
      for (let z = 1; z <= maxSemester; z++) {
        let studentTable = document.createElement("table");
        studentTable.style.borderCollapse = "collapse";
        let header = document.createElement("thead");

        let bool = true;
        let final;
        if (bool) {
          let keyValue = Object.keys(showResult[key].record[z]);
          final = keyValue.filter(
            (result) =>
              result == "Course" || result == "Score" || result == "CreditHour",
          );
          bool = false;
        }
        for (let each of final) {
          let eachHeader = document.createElement("th");
          eachHeader.style.borderWidth = "1px";
          eachHeader.style.borderStyle = "solid";
          eachHeader.textContent = each;
          eachHeader.style.padding = "10px";
          header.append(eachHeader);
          studentTable.append(header);
        }
        let eachResult = [];
        for (let num = 0; num < showResult[key].record.length; num++) {
          let eachValue = Object.values(showResult[key].record[num]);
          if (z == eachValue[4]) {
            eachResult.push({
              ...eachValue.filter((result, index) => index >= 5),
            });
          }
        }
        let GPA = await calculateGPA(eachResult);
        for (let val = 0; val < eachResult.length; val++) {
          let tableRow = document.createElement("tr");
          for (let item in eachResult[val]) {
            let tableData = document.createElement("td");
            tableData.style.borderWidth = "1px";
            tableData.style.borderStyle = "solid";
            tableData.style.paddingLeft = "30px";
            tableData.style.width = "100px";
            tableData.textContent = eachResult[val][item];
            tableRow.append(tableData);
          }
          studentTable.style.marginBottom = "15px";
          studentTable.append(tableRow);
        }
        document.body.append(studentTable);
      }
    }
  }
}
display();
