window.addEventListener('load', displayActors);
window.addEventListener('load', initializeRoundCounter);

const inputForm = document.getElementById('input-form');
const nextBtn = document.getElementById('next-actor');
const clearBtn = document.getElementById('clear-entries');
const counter = document.getElementById('round-num');

inputForm.addEventListener('submit', addActor);

document.getElementById('next-actor').addEventListener('click', setNextActorActive);

document.getElementById('clear-entries').addEventListener('click', clearActors);

function addActor(e) {
  e.preventDefault();
  const nameInput = document.getElementById('input-text').value.toLowerCase();
  const numberInput = document.getElementById('input-number').value;
  const inputText = document.getElementById('input-text');

  if (!nameInput || !numberInput) {
    alert('Please fill in both name and number!');
    return false;
  }

  const actor = {
    name: nameInput,
    value: numberInput,
    currentTurn: false
  };

  if (localStorage.getItem('actors') === null) {
    let actors = [];
    actors.push(actor);
    localStorage.setItem('actors', JSON.stringify(actors));
  } else {
    let actors = JSON.parse(localStorage.getItem('actors'));
    actors.push(actor);
    actors.sort(function (a, b) {
      return b.value - a.value;
    });
    localStorage.setItem('actors', JSON.stringify(actors));
  }

  inputForm.reset();
  inputText.focus();
  displayActors();
}

function displayActors() {
  let actors = JSON.parse(localStorage.getItem('actors'));
  const actorsList = document.getElementById('actors-list');

  if (actors && actorsList) {
    if (localStorage.getItem('actors') !== null) {
      actorsList.innerHTML = '';
      for (let i = 0; i < actors.length; i++) {
        let name = actors[i].name;
        let value = actors[i].value;
        let isActive = actors[i].currentTurn ? 'active' : '';

        actorsList.innerHTML += `<tr>
          <td>${value}</td>
          <td class="${isActive}">${name}</td>
          <td><button onclick="deleteActor(${value})" class="btn del-btn">X</button></td>
        </tr>
        `;
      }
    }
  }
}

function setNextActorActive() {
  let actors = JSON.parse(localStorage.getItem('actors')) || [];

  const activeIndex = actors.findIndex(actor => actor.currentTurn);

  // Remove active class from all actors
  actors.forEach(actor => (actor.currentTurn = false));

  if (actors.length > 0) {
    // Determine the index of the next actor
    const nextIndex = (activeIndex + 1) % actors.length;

    // Add active class to the next actor
    actors[nextIndex].currentTurn = true;

    // Update the round counter if the next actor is the first element
    if (nextIndex === 0) {
      roundCounter();
    }
  }

  localStorage.setItem('actors', JSON.stringify(actors));

  // Update the display
  displayActors();
}

function deleteActor(value) {
  let actors = JSON.parse(localStorage.getItem('actors'));

  for (let i = 0; i < actors.length; i++) {
    if (actors[i].value == value) {
      actors.splice(i, 1);
    }
  }

  localStorage.setItem('actors', JSON.stringify(actors));

  displayActors();
}

function clearActors() {
  let actors = JSON.parse(localStorage.getItem('actors'));
  if (actors.length > 0) {
    const userResponse = confirm('Are you sure you want to clear the list?');
    if (userResponse) {
      localStorage.clear();
      location.reload();
    } else {
      return;
    }
  }
}

function roundCounter() {
  // Increment the round counter and update the display
  let currentRound = parseInt(counter.innerText) || 0;
  currentRound++;
  counter.innerText = currentRound;

  localStorage.setItem('roundCounter', currentRound);
}

function initializeRoundCounter() {
  const savedRoundCounter = localStorage.getItem('roundCounter');

  if (savedRoundCounter !== null) {
    counter.innerText = savedRoundCounter;
  } else {
    // Set the default round counter to 0 if it is not present in local storage
    counter.innerText = '0';
    localStorage.setItem('roundCounter', '0');
  }
}

// Year update

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

document.getElementById('year').innerHTML = `${currentYear}`;
