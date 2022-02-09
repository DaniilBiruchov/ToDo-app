class AppTodo {
  storage = localStorage.getItem('data')
  parsedStorage = this.storage ? JSON.parse(this.storage) : []
  data = this.parsedStorage
  formCreateElement = document.querySelector('#formCreate');
  listElement = document.querySelector('#list');
  isEdit = false
  searchTitleElement = document.querySelector('#searchTitle')
  sortElement = document.querySelector('#sort')
  btnSearchElement = document.querySelector('#btnSearch')
  searchElement = document.querySelector('.search')

  constructor () {
    this.init()
  }

  init () {
    this.formCreateElement.addEventListener('submit', this.handelSubmitFormCreate.bind(this));
    this.listElement.addEventListener('change', this.handelChange.bind(this));
    this.searchTitleElement.addEventListener('input', this.handelSearchFormTitle.bind(this))
    this.sortElement.addEventListener('change', this.handelSort.bind(this))
    this.listElement.addEventListener('click', this.handleRemoveTodo.bind(this));
    this.listElement.addEventListener('click', this.handelEditTodo.bind(this));
    this.listElement.addEventListener('submit', this.handelSubmitFormEdit.bind(this));
    this.btnSearchElement.addEventListener('click', this.handelSearchForm.bind(this))
    window.addEventListener('beforeunload', () => {
      const string = JSON.stringify(this.data);
      localStorage.setItem('data', string)
    });
    document.addEventListener('DOMContentLoaded', () => {
      console.log(this.data)
      const string = JSON.stringify(this.data)
      console.log(string)
      this.render(this.data)
    })
  }

  handelSubmitFormCreate(event) {
  event.preventDefault();

  const date = new Date();
  const todo = {
    id: date.getTime(),
    createdAt: date,
    isChecked: false,
  };

  let formData = new FormData(this.formCreateElement);

  for (let [name, value] of formData) {
    todo[name] = value;
  }

  this.data.push(todo);
  this.formCreateElement.reset();

  this.render(this.data);
}

 handelSubmitFormEdit (event) {
  event.preventDefault();

  const { target } = event; 

  const inputElement = target.querySelector('input[name="title"]')
  const { value } = inputElement
  const { id } = target.dataset

  this.data.forEach((item) => {
    if (item.id == id) {
      item.title = value;
    }
  })

  const parentElement = target.closest('.island__item');
  parentElement.classList.remove('island__item_edit');


  this.isEdit = false
  this.render(this.data)
}

 handelSearchFormTitle (event) {
  event.preventDefault();

  const { target } = event

  const queryString = target.value 

  const matches = this.data.filter (item => {
    if (item.title.includes(queryString)) {
      return true
    }
  })

  this.render(matches)
}

 handelSort (event) {
  const { target } = event
  const { value } = target

  let sortedData = []

  if (value) {
    sortedData = this.data.sort((a, b) =>  {
      if (+a[value] > +b[value]) return -1
      if (+a[value] == +b[value]) return 0
      if (+a[value] < +b[value]) return 1
    })
  } else {
    sortedData =this.data
  }

  this.render(sortedData)
}

 todoTemplate({ title, id, isChecked, createdAt, estimate, priority }) {
  const idAttr = 'todo' + id;

  const dateCreatedAt = this.buildDate(createdAt) 
  const stars = this.buildPriority(priority);
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
  `
}

 handelSearchForm () {
  this.searchElement.classList.toggle('open')
}

 handelChange(event) {
  const { target } = event;
  const { id } = target.dataset;

  if (target.type != 'checkbox') return 

  this.data.forEach((item) => {
    if (item.id == id) {
      item.isChecked = target.checked;
    }
  });

  const parentElement = target.closest('.island__item');
  parentElement.classList.toggle('island__item_checked');
}

 handleRemoveTodo(event) {
  const { target } = event;

  if (target.dataset.role != 'remove') return;

  const { id } = target.dataset;

  this.data.forEach((item, index) => {
    if (item.id == id) {
      this.data.splice(index, 1);
    }
  });

  this.render(this.data);
}

 handelEditTodo (event) {
  const { target } = event;

  if (target.dataset.role != 'edit') return;

  if (this.isEdit) {
    alert('Задача редактируется')
    return
  }
 
  const parentElement = target.closest('.island__item');
  parentElement.classList.add('island__item_edit');
  this.isEdit = true
}

 buildPriority(count) {
  let stars = '';

  for (let i = 0; i < count; i++) {
    stars = stars + '⭐';
  }

  return stars;
}

 transformTime(time) {
  return time < 10 ? `0${time}` : time;
}

 buildDate (date) {
  const odjecktDate = new Date
  const day = this.transformTime(odjecktDate.getDate())
  const month = this.transformTime(odjecktDate.getMonth() + 1)
  const year = this.transformTime(odjecktDate.getFullYear())
  const hour = this.transformTime(odjecktDate.getHours())
  const minute = this.transformTime(odjecktDate.getMinutes())
  const second = this.transformTime(odjecktDate.getSeconds())

  return `(${day}.${month}.${year},${hour}:${minute}:${second})`
}

 render(todoList) {
  let result = '';
  todoList.forEach((todo) => {
    const template = this.todoTemplate(todo);

    result = result + template;
  });

  this.listElement.innerHTML = result;
}
}


const appTodo = new AppTodo()