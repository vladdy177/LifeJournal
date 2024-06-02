const calendar = document.querySelector('.calendar'),
  date = document. querySelector('.date'),
  daysContainer = document.querySelector('.days'),
  prev = document.querySelector('.prev'),
  next = document.querySelector('.next'),
  gotoBtn = document.querySelector('.goto-btn'),
  todayBtn  = document.querySelector('.today-btn'),
  dateInput = document.querySelector('.date-input');

  let today = new Date();
  let activeDay;
  let month = today.getMonth();
  let year = today.getFullYear();

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December',
  ];

  //Function to add days
function initCalendar() {
  //Getting previous month days and current month days and remaining next month days
  const firstDay = new Date(year, month, 0);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  //Updating date on top of calendar
  date.innerHTML = months[month] + " " + year;

  //Adding days on DOM

  //Adding previous month days
  let days = "";
  for (let x = day; x > 0; x--){
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`
  }

  //Current month days
  for (let y = 1; y <= lastDate; y++){
    //If day is today adding class today
    if(y === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()){
      days += `<div class="day today">${y}</div>`
    }
    //Adding remaining days
    else {
      days += `<div class="day">${y}</div>`
    }
  }

  //Adding next month days
  for (let j = 1; j <= nextDays + 1; j++) {
    days += `<div class="day next-date">${j}</div>`
  }
  daysContainer.innerHTML = days
}

initCalendar();

//Previous month
function previousMonth(){
  month--;
  if(month < 0){
    month = 11;
    year--;
  }
  initCalendar()
}

//Next month
function nextMonth(){
  month++;
  if(month > 11){
    month = 0;
    year++;
  }
  initCalendar()
}

//Adding event listeners on prev and next buttons
prev.addEventListener("click", previousMonth);
next.addEventListener("click", nextMonth);

//'Go to date' and 'Today' buttons functionality
todayBtn.addEventListener('click', function(event){
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

//Date input validation
dateInput.addEventListener('input', function(event){
  //Allow only numbers, removing anything else
  dateInput.value = dateInput.value.replace(/[^0-9]/g, "");

  if(dateInput.value.length >= 2 && dateInput.value.indexOf("/") === -1) {
    //Adding a slash if two or more numbers entered and there is no slash yet
    dateInput.value = dateInput.value.slice(0,2) + "/" + dateInput.value.slice(2);
  }

  if(dateInput.value.length > 7){
    //Don't allow more than 7 characters
    dateInput.value = dateInput.value.slice(0,7)
  }

  //If backspace pressed
  if(event.inputType === 'deleteContentBackward'){
    if(dateInput.value.length === 3){
      dateInput.value = dateInput.value.slice(0,2)
    }
  }
});

gotoBtn.addEventListener('click', gotoDate);

//Function to go to entered date
function gotoDate(){
  const dateArr = dateInput.value.split("/");
  console.log(dateArr);
  //Little date validation
  if(dateArr.length === 2){
    if(dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4){
      month = dateArr[0] - 1
      year = dateArr[1];
      initCalendar();
      return;
    }
    //If invalid date
    alert("Invalid date!")
  }
}
