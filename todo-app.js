(function () {
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.setAttribute("disabled", "disabled");

    input.addEventListener("input", function (e) {
      e.preventDefault();
      if (input.value) {
        button.removeAttribute("disabled");
      } else {
        button.setAttribute("disabled", "disabled");
      }
    });

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function deleteItemInLocalStorageById(id) {
    const keyLocaleStorage = window.keyLocaleStorage;
    const items = getArrInLocalStorage(keyLocaleStorage);
    if (items !== null) {
      const findIdxItem = items.findIndex(item => item.id === id);

        items.splice(findIdxItem, 1);

        localStorage.setItem(keyLocaleStorage, JSON.stringify(items));

      return findIdxItem;
    }
  }

  function modifyItemInLocalStorageById(id, done) {
    const keyLocaleStorage = window.keyLocaleStorage;
    const items = getArrInLocalStorage(keyLocaleStorage);
    if (items !== null) {
      const findIdxItem = items.findIndex(item => item.id === id);

        items[findIdxItem].done = done;

        localStorage.setItem(keyLocaleStorage, JSON.stringify(items));
      
      return findIdxItem;
    }
  }

  function createTodoItem({id, name, done}) {
    const item = document.createElement("li");
    const buttonGroup = document.createElement("div");
    const doneButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = name;


    if (done === true) {
      item.classList.add("list-group-item-success");
    }

    doneButton.addEventListener("click", function () {
      if (item.classList.contains('list-group-item-success')) {
        item.classList.remove('list-group-item-success');
        modifyItemInLocalStorageById(id, false);
      } else {
        item.classList.add('list-group-item-success');
        modifyItemInLocalStorageById(id, true);
      }
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        const idxDelete = deleteItemInLocalStorageById(id);
          item.remove();
        
        
      }
    });

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createLiInTodo(todolist, arrElems) {
    for (const item of arrElems) {
      const liDOM = createTodoItem(item).item;
      todolist.append(liDOM);
    }
  }

  function getArrInLocalStorage(keyLocaleStorage) {
    const getItem = localStorage.getItem(keyLocaleStorage);
    if (getItem !== null) {
      const parseGetItem = JSON.parse(getItem);
      if (Array.isArray(parseGetItem)) {
        return JSON.parse(getItem);
      }
    }
    return null;
  }

  function generateNextId(keyLocaleStorage) {
    const items = getArrInLocalStorage(keyLocaleStorage);
    const maxId = 100;
    const arrAllIds = Array.from(Array(maxId).keys());
    if (items !== null) {
      const ids = items.map(item => item.id);
      for (let i = 0; i < arrAllIds.length; i++) {
        const id = arrAllIds[i]; 
        const findId = ids.find(item => item === id); 
        if (findId === undefined) {
          return id;
        }
      }
    }
  }

  function createTodoApp(container, tittle = "Список дел", keyLocaleStorage) {
    const todoAppTitle = createAppTitle(tittle);
    const todoItemForm = createTodoItemForm();
    const todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    const saveItems = [
      { id: 4, name: "Проснуться", done: true },
      { id: 5, name: "Улыбнуться", done: true },
      { id: 3, name: "Умыться", done: false },
    ];

    window.keyLocaleStorage = keyLocaleStorage;

    const todoItems = getArrInLocalStorage(keyLocaleStorage);

    if (todoItems !== null) {
      createLiInTodo(todoList, todoItems)
    } else {
      localStorage.setItem(keyLocaleStorage, JSON.stringify(saveItems));
      createLiInTodo(todoList, saveItems);
    }

    todoItemForm.form.addEventListener("submit", function(e) {
      e.preventDefault();
      todoItemForm.button.setAttribute("disabled", "disabled");

      if (!todoItemForm.input.value) {
        return;
      }

      const nextId = generateNextId(keyLocaleStorage);

      const objTodo = {id: nextId, name: todoItemForm.input.value, done: false};
      const todoItem = createTodoItem(objTodo);
      const items = getArrInLocalStorage(keyLocaleStorage);
      items.push(objTodo);
      localStorage.setItem(keyLocaleStorage, JSON.stringify(items));
      todoList.append(todoItem.item);
      todoItemForm.input.value = "";
    });
  }
  window.createTodoApp = createTodoApp;
})();
