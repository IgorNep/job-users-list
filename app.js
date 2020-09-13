//define vars
const app = document.querySelector(".app");
const loading = document.querySelector(".loading");
const form = document.querySelector(".form");

//define form variables
let name = document.querySelector("#name");
let phone = document.querySelector("#phone");
let email = document.querySelector("#email");
let job = document.querySelector("#job");
let formTitle = document.querySelector(".form__title");

let submitBtn = document.querySelector("#submit-btn");
const users = document.querySelector(".users");
let currentUserId = null;

//create flag variables
let requiredFlag = false;
let nameFlag = false;
let emailFlag = false;
let phoneFlag = false;
let jobFlag = false;
//get users from local storage
const getUsers = () => {
  let usersList;
  if (localStorage.getItem("usersList") === "null") {
    usersList = [];
  } else {
    usersList = JSON.parse(localStorage.getItem("usersList"));
  }

  usersList.forEach((user) => {
    createUser(user.name, user.phone, user.email, user.job, user.id);
  });
};
//listen DOM loading
document.addEventListener("DOMContentLoaded", getUsers);

//Listen for form submit
form.addEventListener("submit", (e) => {
  //prevent default action
  e.preventDefault();

  //Check required
  checkRequired([name, phone, email, job]);
  //Check name field
  checkName(name);
  //check the length of the field
  checkLength(job, 5);
  //check email
  checkEmail(email);
  //check phone number
  checkPhone(phone);

  //Show loader if needed for user experience
  // showLoading();
  if (!requiredFlag && !emailFlag && !jobFlag && !phoneFlag && !nameFlag) {
    if (submitBtn.dataset.flag != "edit") {
      let id = Math.round(Math.random() * 10000000000000);
      setToLocalStorage(name.value, phone.value, email.value, job.value, id);
      createUser(name.value, phone.value, email.value, job.value, id);
      clearFields();
    }
    if (submitBtn.dataset.flag == "edit") {
      replaceInLocalStorage(
        name.value,
        phone.value,
        email.value,
        job.value,
        currentUserId
      );
      formTitle.textContent = "Новый Сотрудник";
      submitBtn.value = "Сохранить";
      submitBtn.removeAttribute("data-flag");
      currentUserId = null;
      clearFields();
    }
  }
});
//Check name field
const checkName = (input) => {
  nameFlag = false;
  const re = /^([а-яА-Яa-zA-Z]{2,}\s[а-яА-Яa-zA-Z]{1,}'?-?[а-яА-Яa-zA-Z]{2,}\s?([а-яА-Яa-zA-Z]{1,})?)/;
  if (re.test(input.value.trim().toLowerCase())) {
    showSuccess(input);
  } else {
    showError(input, "Имя введено не верно");
    nameFlag = true;
  }
};
//Check length of the fields
const checkLength = (input, min) => {
  jobFlag = false;
  if (input.value.length < min) {
    showError(input, `Должность должна содержать минимум ${min} букв`);
    jobFlag = true;
  }
};

//Clear fields values
const clearFields = () => {
  name.value = "";
  phone.value = "";
  email.value = "";
  job.value = "";
};
//Check required fields
const checkRequired = (inputArr) => {
  requiredFlag = false;
  inputArr.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${getInputName(input)} is required`);
      requiredFlag = true;
    } else {
      showSuccess(input);
    }
  });
};

//Check is valid email
const checkEmail = (input) => {
  emailFlag = false;
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim().toLowerCase())) {
    showSuccess(input);
  } else {
    showError(input, "Формат Email не верный");
    emailFlag = true;
  }
};

//Check phone
const checkPhone = (input) => {
  phoneFlag = false;
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (re.test(input.value.trim().toLowerCase())) {
    showSuccess(input);
  } else {
    showError(input, "Формат телефона не верный");
    phoneFlag = true;
  }
};

//Get input name
const getInputName = (input) => {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
};
//showLoading
const showLoading = () => {
  loading.style.display = "block";
  app.style.opacity = "0";
  setTimeout(() => {
    loading.style.display = "none";
    app.style.opacity = "1";
  }, 500);
};

//show error
const showError = (input, message) => {
  const formItem = input.parentElement;
  formItem.className = "form__item error";
  const messageField = formItem.querySelector(".form__message");
  messageField.innerText = message;
};
//show success
const showSuccess = (input) => {
  const formItem = input.parentElement;
  formItem.className = "form__item success";
};
//replace user's data in local storage
const replaceInLocalStorage = (name, phone, email, job, id) => {
  let usersList;
  if (localStorage.getItem("usersList") === "null") {
    usersList = [];
  } else {
    usersList = JSON.parse(localStorage.getItem("usersList"));
  }

  usersList.forEach((user) => {
    if (user.id == id) {
      user.name = name;
      user.phone = phone;
      user.job = job;
      user.email = email;
    }
  });
  localStorage.setItem("usersList", JSON.stringify(usersList));
  users.innerHTML = "";
  getUsers();
};
//Create user function
const createUser = (name, phone, email, job, id) => {
  const userBlock = document.createElement("div");
  userBlock.setAttribute("data-id", id);
  userBlock.classList.add("user-block");
  userBlock.innerHTML = `
  <p class="user-block__name"><span>Имя:</span> ${name} <a href="!#" class="delete"><i class="fa fa-times"></i></a> <a href="!#" class="edit"><i class="fa fa-pencil"></i></a></p>
  <p class="user-block__job"><span>Должность:</span> ${job} </p> 
  <p class="user-block__contact"><span>Email:</span> ${email} | <span>Телeфон:</span> ${phone} </p>
   `;
  users.appendChild(userBlock);
};
//listen for users section actions
users.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.parentElement.classList.contains("delete")) {
    e.target.parentElement.parentElement.parentElement.remove();
    removeFromLS(e.target.parentElement.parentElement.parentElement.dataset.id);
    showLoading();
  }
  if (e.target.parentElement.classList.contains("edit")) {
    let user = getUserFromLS(
      e.target.parentElement.parentElement.parentElement.dataset.id
    )[0];

    currentUserId =
      e.target.parentElement.parentElement.parentElement.dataset.id;
    name.value = user.name;
    phone.value = user.phone;
    email.value = user.email;
    job.value = user.job;
    submitBtn.value = "Редактировать";
    formTitle.textContent = "Редактировать Сотрудника";
    submitBtn.setAttribute("data-flag", "edit");
  }
});
//Get single user from Local Storage
const getUserFromLS = (id) => {
  let usersList;
  if (localStorage.getItem("usersList") === "null") {
    usersList = [];
  } else {
    usersList = JSON.parse(localStorage.getItem("usersList"));
  }

  return usersList.filter((user) => user.id == id);
};
//set users to local storage
const setToLocalStorage = (name, phone, email, job, id) => {
  let usersList;
  if (localStorage.getItem("usersList") === null) {
    usersList = [];
  } else {
    usersList = JSON.parse(localStorage.getItem("usersList"));
  }

  const newUser = {
    name,
    phone,
    email,
    job,
    id,
  };
  usersList.push(newUser);
  localStorage.setItem("usersList", JSON.stringify(usersList));
};
//remove from local storage
const removeFromLS = (id) => {
  let usersList;
  if (localStorage.getItem("usersList") === "null") {
    usersList = [];
  } else {
    usersList = JSON.parse(localStorage.getItem("usersList"));
  }
  usersList.forEach((user, index) => {
    if (user.id == id) {
      usersList.splice(index, 1);
    }
  });
  localStorage.setItem("usersList", JSON.stringify(usersList));
};
