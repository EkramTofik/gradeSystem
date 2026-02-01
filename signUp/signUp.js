const radios = document.querySelectorAll('input[name="role"]');
const extraFields = document.getElementById("extraFields");
const signUpText = document.querySelector(".text");
const fullname = document.querySelector(".fullname");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const phone = document.querySelector(".phonenumber");
const submitBtn = document.querySelector(".submitBtn");
const errMessage = document.querySelector(".error");
const signUpForm = document.querySelector("form");
const confirmPassword = document.querySelector(".confirmpassword");
const gender = document.querySelector('input[name="gender"]:checked');

function renderFields(role) {
  extraFields.innerHTML = "";

  if (role === "student") {
    ["Transcript", "Grade 8", "Grade 12"].forEach((text) => {
      const label = document.createElement("label");
      label.textContent = text;
      extraFields.append(label);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf";
      input.style.display = "block";
      extraFields.appendChild(input);
    });
  } else {
    ["Degree", "Masters", "NationalID", "CV"].forEach((text) => {
      const label = document.createElement("label");
      label.textContent = text;
      extraFields.append(label);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf";
      input.style.display = "block";
      extraFields.appendChild(input);
    });
  }
}
radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    renderFields(radio.value);
  });
});

const defaultSelected = document.querySelector('input[name="role"]:checked');
if (defaultSelected) {
  renderFields(defaultSelected.value);
}

function error(message) {
  errMessage.innerHTML = "";
  errMessage.textContent = message;
  errMessage.style.color = "red";
  signUpText.prepend(errMessage);
}
signUpForm.addEventListener("input", () => {
  errMessage.textContent = "";
});
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (fullname.value === "") {
    error("name is required");
    return;
  } else if (
    fullname.value.length < 3 ||
    fullname.value.length > 30 ||
    !/^[a-zA-Z\s\-:&']+$/.test(fullname.value)
  ) {
    error("enter a valid name");
    return;
  }

  if (email.value === "") {
    error("email is required");
    return;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error("enter a valid email");
    return;
  }

  if (password.value === "") {
    error("password is required");
    return;
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,30}$/.test(
      password.value,
    )
  ) {
    error(
      "Password must be 8-30 characters, include uppercase, lowercase, number, and special character",
    );
    return;
  }
  if (password.value !== confirmPassword.value) {
    error("password doesn't match");
    return;
  }
  function getFilesData() {
    const files = extraFields.querySelectorAll('input[type="file"]');
    const uploadedFiles = [];

    files.forEach((input) => {
      if (input.files.length > 0) {
        const file = input.files[0];
        uploadedFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
        });
      }
    });

    return uploadedFiles;
  }
  let roleSelected = document.querySelector('input[name="role"]:checked').value;

  let sendFiles = getFilesData();
  console.log(sendFiles);
  const data = {
    fullname: fullname.value,
    email: email.value,
    password: password.value,
    phone: phone.value,
    gender: gender.value,
    role: roleSelected,
    files: sendFiles,
    status: "pending",
  };
  await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  window.location.href = "waitingPage.html";
});
