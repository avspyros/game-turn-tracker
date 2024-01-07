window.addEventListener('load', displayActors());

const inputForm = document.getElementById('input-form');
const nextBtn = document.getElementById('next-actor');
const clearBtn = document.getElementById('clear-entries');
const { nextItem } = highlightCurrent();

inputForm.addEventListener('submit', addActor);

nextBtn.addEventListener('click', () => nextItem());

clearBtn.addEventListener('click', clearActors);

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

  if (localStorage.getItem('actors') !== null) {
    actorsList.innerHTML = '';
    for (let i = 0; i < actors.length; i++) {
      let name = actors[i].name;
      let value = actors[i].value;

      actorsList.innerHTML += `<tr class="table-row">
        <td>${value}</td>
        <td>${name}</td>
        <td class="del-btn-cell"><button onclick="deleteActor(${value})" class="btn del-btn">X</button></td>
      </tr>`;
    }
  }
}

function highlightCurrent() {
  const activeActors = document.querySelectorAll('#actors-list tr td:nth-child(2)');
  let currentItem = -1;

  function clearPrevious() {
    for (let i = 0; i < activeActors.length; i++) {
      activeActors[i].classList.remove('active');
    }
  }

  function nextItem() {
    if (currentItem === activeActors.length - 1) {
      currentItem = -1;
    }
    clearPrevious();
    activeActors[currentItem + 1].classList.add('active');
    currentItem++;
  }

  return { nextItem };
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
    if (confirm('Are you sure you want to clear the list?')) {
      localStorage.clear();
      location.reload();
    } else {
      return;
    }
  }
}

// Add feature to count rounds...
