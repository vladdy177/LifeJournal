const calendar = document.querySelector('.calendar'),
  date = document. querySelector('.date'),
  daysContainer = document.querySelector('.days'),
  prev = document.querySelector('.prev'),
  next = document.querySelector('.next'),
  gotoBtn = document.querySelector('.goto-btn'),
  todayBtn  = document.querySelector('.today-btn'),
  dateInput = document.querySelector('.date-input'),
  habitDay = document.querySelector(".habit-day"),
  habitDate = document.querySelector(".habit-date"),
  habitsContainer = document.querySelector('.habits'),
  addHabitBtn = document.querySelector('.add-habit'),
  addHabitWrapper = document.querySelector('.add-habit-wrapper'),
  addHabitInput = document.querySelector('.add-habit-input'),
  addHabitCloseBtn = document.querySelector('.close'),
  addHabitName = document.querySelector('.habit-name'),
  addHabitSubmitBtn = document.querySelector('.add-habit-btn');

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

//Default habits array
// const habitsArray = [
//   {
//     day: 3,
//     month: 6,
//     year: 2024,
//     habits: [
//       {
//         title: 'Read 10 pages'
//       },
//       {
//         title: 'Workout'
//       }
//     ]
//   },
//   {
//     day: 15,
//     month: 6,
//     year: 2024,
//     habits: [
//       {
//         title: 'Read 20 pages'
//       },
//       {
//         title: 'Workout x2'
//       },
//       {
//         title: 'Go to bad at 12PM'
//       }
//     ]
//   }
// ]

// Setting empty habits array
let habitsArray = [];

// Then calling get habits array function
getHabits();

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
  for (let i = 1; i <= lastDate; i++){

    //Check if habits are exist on current day

    let habit = false;
    habitsArray.forEach((habitObject) => {
      if(
        habitObject.day === i &&
        habitObject.month === month + 1 &&
        habitObject.year === year
      ) {
        //If habit found
        habit = true;
      }
    });

    //If day is today adding class today
    if(
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ){
      activeDay = i;
      getActiveDay(i);
      updateHabits(i);
      // TODO class="done" will appear when all habits marked as completed
      //If habit found also add habit class
      if(habit) {
        days += `<div class="day today active done">${i}</div>`
      } else {
        days += `<div class="day today active">${i}</div>`
      }

    }
    //Adding remaining days
    else {
      if(habit) {
        days += `<div class="day done">${i}</div>`
      } else {
        days += `<div class="day">${i}</div>`
      }
    }
  }

  //Adding next month days
  for (let j = 1; j <= nextDays + 1; j++) {
    days += `<div class="day next-date">${j}</div>`
  }
  daysContainer.innerHTML = days
  //Add listener after calender initialized
  addListener();
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


// Add habit functions, logic
addHabitBtn.addEventListener('click', function(){
  addHabitWrapper.classList.toggle('active');
  addHabitInput.setAttribute("autofocus", "");
});

addHabitCloseBtn.addEventListener('click', function(){
  addHabitWrapper.classList.remove('active');
  addHabitInput.removeAttribute("autofocus");
});

// If click is outside add window
document.addEventListener('click', (event)=>{
  if(event.target !== addHabitBtn && !addHabitWrapper.contains(event.target)){
    addHabitWrapper.classList.remove('active');
    addHabitInput.removeAttribute("autofocus");
  }
});

// Allow only 50 chars in title
addHabitName.addEventListener('input', function(event){
  addHabitName.value = addHabitName.value.slice(0, 50);
});

//Function to add listener on days after rendered
function addListener(){
  const days = document.querySelectorAll('.day');
  days.forEach((day) => {
    day.addEventListener('click', (e) => {
      //Set current day as active day
      activeDay = Number(e.target.innerHTML);

      //Call active day function click
      getActiveDay(e.target.innerHTML);
      updateHabits(Number(e.target.innerHTML));

      //Remove active from already active day
      days.forEach((day) => {
        day.classList.remove('active');
      });

      //If previous month day clicked goto previous month and add active
      if(e.target.classList.contains('prev-date')){
        previousMonth();
        setTimeout(() => {
          //Selecting all days of this month
          const days = document.querySelectorAll('.day');

          //After going to previous month add active to clicked
          days.forEach((day)=>{
            if(!day.classList.contains('prev-date') &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);

        //Same with next month days
      } else if(e.target.classList.contains('next-date')){
        nextMonth();

        setTimeout(() => {
          //Selecting all days of this month
          const days = document.querySelectorAll('.day');

          //After going to next month add active to clicked
          days.forEach((day)=>{
            if(!day.classList.contains('next-date') &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        //Remaining days of the month
        e.target.classList.add("active");
      }
    });
  });
}

//Function for showing active day and date on top of the right part
function getActiveDay(date){
  const day = new Date(year, month, date);
  habitDay.innerHTML = day.toString().split(" ")[0];
  habitDate.innerHTML = date + " " + months[month] + " " + year;
}

//Function to show daily habits
function updateHabits(date){
  let habits = "";
  habitsArray.forEach((habit) => {
    //Get habits of active day only
    if(
      date === habit.day &&
      month + 1 === habit.month &&
      year === habit.year
    ){
     //Then show habits on DOM
     habit.habits.forEach(habit => {
       habits +=
         `
          <div class="habit">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="habit-title">${habit.title}</h3>
            </div>
          </div>
         `
     });
    }
  });

  //If nothing found
  if(habits === ""){
    habits =
      `
      <div class="no-habit">
        <h3>No habits</h3>
      </div>
      `;
  }

  habitsContainer.innerHTML = habits;
  // Save habits when update habit called
  saveHabits();
}

// Function to add new habits
addHabitSubmitBtn.addEventListener('click', function(){
  const habitName = addHabitName.value;
  // Some validation
  if(habitName === ""){
    alert("Please enter a valid habit name");
    return;
  }
  const newHabit = {
    title: habitName,
  };

  let habitAdded = false;

  // Checking if habit list is not empty
  if(habitsArray.length > 0){
    // Checking if current day has already any event then add to that
    habitsArray.forEach(item => {
      if(item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.habits.push(newHabit);
        habitAdded = true;
      }
    });
  }

  // If habit array is empty or day has no habits, create new
  if(!habitAdded){
    habitsArray.push(
      {
        day: activeDay,
        month: month + 1,
        year: year,
        habits: [newHabit],
      }
    );
  }

  // Remove active class from add new habit form
  addHabitWrapper.classList.remove(".active");
  // Clear the fields
  addHabitName.value = "";

  // Show current added habit
  updateHabits(activeDay);

  // Add habit class to newly added day if not already
  const activeDayElement = document.querySelector('.day.active');
  //TODO Change done class logic
  if(!activeDayElement.classList.contains('done')){
    activeDayElement.classList.add('done');
  }

});


// Remove habit function
habitsContainer.addEventListener('click', (event)=>{
  if(event.target.classList.contains('habit')){
    const habitTitle = event.target.children[0].children[1].innerHTML;
    // Get the title of habit than search in array by title and delete
    habitsArray.forEach((habit) => {
      if(
        habit.day === activeDay &&
        habit.month === month + 1 &&
        habit.year === year
      ){
        habit.habits.forEach((item, index) => {
          if(item.title === habitTitle){
            habit.habits.splice(index, 1);
          }
        });
        // If no habits remaining on that day remove complete day from array
        if(habit.habits.length === 0){
          habitsArray.splice(habitsArray.indexOf(habit), 1);
          // After remove complete day also remove done class of that day
          const activeDayElement = document.querySelector('.day.active');
          if(activeDayElement.classList.contains('done')){
            activeDayElement.classList.remove('done');
          }
        }
      }
    });
    // After removing from array update habit
    updateHabits(activeDay);
  }
});

// Function for storing and getting habits from local storage
function saveHabits(){
  localStorage.setItem("habits", JSON.stringify(habitsArray));
}

function getHabits(){
  if(localStorage.getItem("habits" === null)){
    return;
  }
  habitsArray.push(...JSON.parse(localStorage.getItem("habits")));
}
