const storage = localStorage.getItem('data')
const data = storage ? JSON.parse(storage) : []
const formCreateElement = document.querySelector('#formCreate');
const listElement = document.querySelector('#list');
let isEdit = false
const searchTitleElement = document.querySelector('#searchTitle')
const sortElement = document.querySelector('#sort')
const btnSearchElement = document.querySelector('#btnSearch')
const searchElement = document.querySelector('.search')
// -------------------------------------------------------------------------------------------------

formCreateElement.addEventListener('submit', handelSubmitFormCreate);
listElement.addEventListener('change', handelChange);
searchTitleElement.addEventListener('input', handelSearchFormTitle)
sortElement.addEventListener('change', handelSort)
listElement.addEventListener('click', handleRemoveTodo);
listElement.addEventListener('click', handelEditTodo);
listElement.addEventListener('submit', handelSubmitFormEdit);
btnSearchElement.addEventListener('click', handelSearchForm)
window.addEventListener('beforeunload', () => {
  const string = JSON.stringify(data);
  localStorage.setItem('data', string)
});
document.addEventListener('DOMContentLoaded', () => {
  console.log(data)
  const string = JSON.stringify(data)
  console.log(string)
  render(data)
})

// -----------------------------------------------------------------------------------------------

function handelSubmitFormCreate(event) {
  event.preventDefault();

  const date = new Date();
  const todo = {
    id: date.getTime(),
    createdAt: date,
    isChecked: false,
  };

  let formData = new FormData(formCreateElement);

  for (let [name, value] of formData) {
    todo[name] = value;
  }

  data.push(todo);
  formCreateElement.reset();

  render(data);
}

function handelSubmitFormEdit (event) {
  event.preventDefault();

  const { target } = event; 

  const inputElement = target.querySelector('input[name="title"]')
  const { value } = inputElement
  const { id } = target.dataset

  data.forEach((item) => {
    if (item.id == id) {
      item.title = value;
    }
  })

  const parentElement = target.closest('.island__item');
  parentElement.classList.remove('island__item_edit');


  isEdit = false
  render(data)
}

function handelSearchFormTitle (event) {
  event.preventDefault();

  const { target } = event

  const queryString = target.value 

  const matches = data.filter (item => {
    if (item.title.includes(queryString)) {
      return true
    }
  })

  render(matches)
}

function handelSort (event) {
  const { target } = event
  const { value } = target

  let sortedData = []

  if (value) {
    sortedData = data.sort((a, b) =>  {
      if (+a[value] > +b[value]) return -1
      if (+a[value] == +b[value]) return 0
      if (+a[value] < +b[value]) return 1
    })
  } else {
    sortedData = data
  }

  render(sortedData)
}

function todoTemlate({ title, id, isChecked, createdAt, estimate, priority }) {
  const idAttr = 'todo' + id;

  const dateCreatedAt = buildDate(createdAt) 
  const stars = buildPriority(priority);
  const checkedAttr = isChecked ? 'checked' : '';

  return `
    <div class="island__item ${isChecked ? 'island__item_checked' : ''}">
      <div class="formCheck">
        <div class="todo">
          <input class="form-check-input" type="checkbox"  ${checkedAttr} id="${idAttr}" data-id="${id}">
          <label class="form-check-label" for="${idAttr}">             
          ${title}
          </label>

          <form class="form-edit" data-id="${id}">
            <input type="text" class="form-control" name='title' id="title" placeholder="Задача" value="${title}">
            <button class="btn-save btn-sm btn-primary" type="submit">&#9989;</button>
          </form>
        </div>
          
        <div class="blockBtn">
          <button class="btn-edit" type="button" data-role="edit" data-id="${id}">✎</button>
          <button class="btn" data-role="remove" data-id="${id}">❌</button>
        </div>
        
      </div>
      <div>
        <span>${estimate ? estimate + 'ч.' : ''}</span>
        <span>${stars}</span>
        <span>${dateCreatedAt}</span>
      </div>
   </div>
`;
}

function handelSearchForm () {
  searchElement.classList.toggle('open')
}

function handelChange(event) {
  const { target } = event;
  const { id } = target.dataset;

  if (target.type != 'checkbox') return 

  data.forEach((item) => {
    if (item.id == id) {
      item.isChecked = target.checked;
    }
  });

  const parentElement = target.closest('.island__item');
  parentElement.classList.toggle('island__item_checked');
}

function handleRemoveTodo(event) {
  const { target } = event;

  if (target.dataset.role != 'remove') return;

  const { id } = target.dataset;

  data.forEach((item, index) => {
    if (item.id == id) {
      data.splice(index, 1);
    }
  });

  render(data);
}

function handelEditTodo (event) {
  const { target } = event;

  if (target.dataset.role != 'edit') return;

  if (isEdit) {
    alert('Задача редактируется')
    return
  }
 
  const parentElement = target.closest('.island__item');
  parentElement.classList.add('island__item_edit');
  isEdit = true
}

function buildPriority(count) {
  let stars = '';

  for (let i = 0; i < count; i++) {
    stars = stars + '⭐';
  }

  return stars;
}

function transformTime(time) {
  return time < 10 ? `0${time}` : time;
}

function buildDate (date) {
  const odjecktDate = new Date
  const day = transformTime(odjecktDate.getDate())
  const month = transformTime(odjecktDate.getMonth() + 1)
  const year = transformTime(odjecktDate.getFullYear())
  const hour = transformTime(odjecktDate.getHours())
  const minute = transformTime(odjecktDate.getMinutes())
  const second = transformTime(odjecktDate.getSeconds())

  return `(${day}.${month}.${year},${hour}:${minute}:${second})`
}



function render(todoList) {
  let result = '';
  todoList.forEach((todo) => {
    const template = todoTemlate(todo);

    result = result + template;
  });

  listElement.innerHTML = result;
}