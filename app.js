window.addEventListener('load', displayActors);

const inputForm = document.getElementById('input-form');
const nextBtn = document.getElementById('next-actor');
const clearBtn = document.getElementById('clear-entries');

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

        actorsList.innerHTML += `<tr class="table-row">
        <td>${value}</td>
        <td class="${isActive}">${name}</td>
        <td class="del-btn-cell"><button onclick="deleteActor(${value})" class="btn del-btn">X</button></td>
      </tr>`;
      }
    }
  }
}

function setNextActorActive() {
  let actors = JSON.parse(localStorage.getItem('actors')) || [];

  const activeIndex = actors.findIndex(actor => actor.currentTurn);

  // Remove active class from all actors
  actors.forEach(actor => (actor.currentTurn = false));

  // Determine the index of the next actor
  const nextIndex = (activeIndex + 1) % actors.length;

  // Add active class to the next actor
  actors[nextIndex].currentTurn = true;

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
  if (actors) {
    const userResponse = confirm('Are you sure you want to clear the list?');
    if (userResponse) {
      localStorage.clear();
      location.reload();
    } else {
      return;
    }
  }
}

// Add feature to count rounds...
