function openTab(tabName) {
  var i, tabContent;
  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }
  if (tabName === "view") {
    document.getElementById("filter-options").style.display = "block";
  } else {
    document.getElementById("filter-options").style.display = "none";
  }
  document.getElementById(tabName + "-content").style.display = "block";

  if (tabName === "submit") {
    // Load submit form
    fetch("submitForm.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("submit-content").innerHTML = data;
        document
          .getElementById("submit-form")
          .addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission
            if (!validateForm()) {
              return; // Exit if validation fails
            }

            // Function to validate form fields
            function validateForm() {
              const name = document.getElementById("name").value.trim();
              const age = document.getElementById("age").value.trim();
              const dob = document.getElementById("dob").value.trim();
              const mobile = document.getElementById("mobile").value.trim();
              const gender = document.getElementById("gender").value.trim();
              const address = document.getElementById("address").value.trim();
              const email = document.getElementById("email").value.trim();
              const password = document.getElementById("password").value.trim();

              // Minimum and maximum lengths for each field
              const validations = {
                name: { min: 5, max: 50 },
                age: { min: 1, max: 2 },
                // dob: { min: 10, max: 10 },
                mobile: { min: 10, max: 10 },
                // gender: { min: 1, max: 10 },
                address: { min: 5, max: 100 },
                email: { min: 5, max: 50 },
                password: { min: 8, max: 20 },
              };

              // Validate each field
              for (const field in validations) {
                const minLength = validations[field].min;
                const maxLength = validations[field].max;
                const value = eval(field); // dynamically retrieves the value of the current field from the form or data object. It's using eval() to evaluate the field name dynamically.

                if (value.length < minLength || value.length > maxLength) {
                  alert(
                    `${
                      field.charAt(0).toUpperCase() + field.slice(1)
                    } must be between ${minLength} and ${maxLength} characters`
                  );
                  return false;
                }
              }

              return true; // Return true if all validations pass
            }

            // Serialize form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => (formObject[key] = value));

            // Send form data to backend
            fetch("http://localhost:3000/api/saveData", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formObject),
            })
              //It returns a promise that resolves with the parsed JSON data
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                //parses response body as json
                return response.json();
              })
              //This continues the promise chain, handling the parsed JSON data received from the server
              .then((data) => {
                console.log("Data saved successfully:", data);
                // Optionally, do something after successful form submission
              })
              .catch((error) => {
                console.error("Error saving data:", error);
                // Optionally, handle errors
              });
          });
      });
  } else if (tabName === "view") {
    // Load view data
    fetchAllData();
  }
}

// Fetch all user data and display
function fetchAllData() {
  fetch("http://localhost:3000/api/getAllData")
    .then((response) => response.json())
    .then((data) => displayData(data))
    .catch((error) => console.error("Error:", error));
}

// Display data in table
function displayData(data) {
  // Assuming there's a table with id 'user-table' in your HTML
  const table = document.getElementById("user-table");
  // Clear existing table data
  table.innerHTML = "";

  // Create table header row
  const headerRow = table.insertRow();
  for (const key in data[0]) {
    if (data[0].hasOwnProperty(key)) {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    }
  }

  // Create table rows with user data
  data.forEach((user) => {
    const row = table.insertRow();
    for (const key in user) {
      if (user.hasOwnProperty(key)) {
        const cell = row.insertCell();
        cell.textContent = user[key];
      }
    }
  });
}
// Fetch user data by name
function fetchByName(name) {
  fetch(`http://localhost:3000/api/getDataByName/${name}`)
    .then((response) => response.json())
    .then((data) => displayFilteredData(data))
    .catch((error) => console.error("Error:", error));
}

// Fetch user data by DOB
function fetchByDOB(dob) {
  fetch(`http://localhost:3000/api/getDataByDOB/${dob}`)
    .then((response) => response.json())
    .then((data) => displayFilteredData(data))
    .catch((error) => console.error("Error:", error));
}

// Fetch user data by age
function fetchByAge(age) {
  fetch(`http://localhost:3000/api/getDataByAge/${age}`)
    .then((response) => response.json())
    .then((data) => displayFilteredData(data))
    .catch((error) => console.error("Error:", error));
}

// Display filtered data in table
function displayFilteredData(data) {
  const table = document.getElementById("user-table");
  table.innerHTML = ""; // Clear existing table data

  // Create table header row
  const headerRow = table.insertRow();
  //Generating Table Header Cells
  for (const key in data[0]) {
    if (data[0].hasOwnProperty(key)) {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    }
  }

  // Create table rows with filtered user data
  data.forEach((user) => {
    const row = table.insertRow();
    for (const key in user) {
      if (user.hasOwnProperty(key)) {
        const cell = row.insertCell();
        cell.textContent = user[key];
      }
    }
  });
}

// Function to filter data based on user input
function filterData() {
  const filterType = document.getElementById("filter-type").value;
  const filterValue = document.getElementById("filter-value").value;

  if (filterType === "name") {
    fetchByName(filterValue);
  } else if (filterType === "dob") {
    fetchByDOB(filterValue);
  } else if (filterType === "age") {
    fetchByAge(filterValue);
  }
}
