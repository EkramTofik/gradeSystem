const tbody = document.querySelector("tbody");
const table = document.querySelector("table");
table.style.border = "1px solid";
table.style.borderCollapse = "collapse";
emailjs.init("rbUohutfiyksFbZG-");

async function fetchData() {
  const result = await fetch("http://localhost:3000/users");
  const data = await result.json();
  return data.filter((item) => item.role === "teacher");
}

async function display() {
  const data = await fetchData();

  data.forEach((student) => {
    const tableRow = document.createElement("tr");

    const fields = [
      student.fullname,
      student.email,
      student.password,
      student.phone,
      student.gender,
      student.role,
      Array.isArray(student.files)
        ? student.files.map((f) => f.name).join(", ")
        : "",
      student.status || "",
    ];

    fields.forEach((val) => {
      const td = document.createElement("td");
      td.textContent = val;
      td.style.border = "1px solid";
      tableRow.appendChild(td);
    });

    const actionTd = document.createElement("td");
    actionTd.style.border = "1px solid";

    const approveBtn = document.createElement("button");
    const rejectBtn = document.createElement("button");

    approveBtn.textContent = "Approve";
    rejectBtn.textContent = "Reject";

    approveBtn.className = "approve";
    rejectBtn.className = "reject";

    actionTd.append(approveBtn, rejectBtn);
    tableRow.appendChild(actionTd);

    const idTd = document.createElement("td");
    idTd.className = "student-id-td";
    idTd.style.border = "1px solid";
    idTd.textContent = student.identification || "";
    tableRow.appendChild(idTd);

    approveBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      approveBtn.disabled = true;

      await emailjs.send("service_k2swk5f", "template_shba9pb", {
        name: student.fullname,
        email: student.email,
        message: "Your account has been approved.",
      });

      await fetch(`http://localhost:3000/users/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "approved",
        }),
      });
    });

    tbody.appendChild(tableRow);
  });
}

display();
