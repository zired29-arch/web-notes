const theme_btn = document.querySelector('.theme')
const create_btn = document.querySelector('.custom-btn')
const input_block = document.querySelector('.input-block')
const input_task = document.querySelector('.input-task')
const input_date = document.querySelector('.input-date')
const selector_status = document.querySelector('.select-status')
const add_task_btn = document.querySelector('.add-task')
const table = document.querySelector('.table')
const tbody = document.querySelector('.tasks-list')

let edit_id = null // Режим редактирования
let theme = "light"
// Массив задач
let tasks = JSON.parse(localStorage.getItem('tasks')) || []

create_btn.addEventListener('click', function() {
    input_block.style.display = "flex"
    create_btn.style.display = "none"
})

function save_task() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function create_task() {
    let task_text = input_task.value.trim()
    let deadline = input_date.value
    let status = selector_status.value
    if (task_text === "") {
        alert("Введите задачу!")
        return
    }
    console.log(task_text, deadline, status)
    // Логика редактирования
    if (edit_id != null) {
        let task = tasks.find(function(item) {
            return item.id === edit_id
        })
        if (task) {
            task.text = task_text
            task.deadline = deadline
            task.status = status
        }
        edit_id = null
    } else {
        // Создание задач
        let new_task = {
            id: Date.now(),
            text: task_text,
            deadline: deadline,
            status: status
        }
        tasks.push(new_task)
    }
    save_task()
    render_task()
    clear_inputs()
}

function render_task() {
    tbody.innerHTML = ""
    if (tasks.length === 0) {
        table.style.display = "none"
        return
    }
    table.style.display = "block"
    tasks.forEach(function(task, index) {
        let tr = document.createElement("tr")
        // Добавление номера задачи
        let id_td = document.createElement("td")
        id_td.textContent = index + 1
        // Название задачи
        let task_td = document.createElement("td")
        task_td.textContent = task.text
        // Дедлайн задачи
        let deadline_td = document.createElement("td")
        if (task.deadline) {
            let date = new Date(task.deadline)
            deadline_td.textContent = date.toLocaleDateString("ru-RU")
        } else {
            deadline_td.textContent = "-"
        }
        // Статус задачи
        let status_td = document.createElement("td")
        let status_select = document.createElement("select")
        status_select.classList.add("select-status")
        let statuses = ["Выполнено", "Не выполнено", "В процессе"]
        statuses.forEach(function(status) {
            let option = document.createElement("option")
            option.value = status
            option.textContent = status
            if (status === task.status) {
                option.selected = true
            }
            status_select.appendChild(option)
        })
        status_select.addEventListener('change', function() {
            task.status = status_select.value
            save_task()
        })
        status_td.appendChild(status_select)
        // Добавление кнопок
        let actions_td = document.createElement("td")
        let edit_btn = document.createElement("button")
        edit_btn.textContent = "Редактировать"
        edit_btn.classList.add("edit-btn")
        edit_btn.addEventListener('click', function() {
            // Вызов функции редактирования
            edit_task(task.id)
        })
        let delete_btn = document.createElement("button")
        delete_btn.textContent = "Удалить"
        delete_btn.classList.add("delete-btn")
        delete_btn.addEventListener('click', function() {
            // Вызов функции удаления
            delete_task(task.id)
        })
        actions_td.appendChild(edit_btn)
        actions_td.appendChild(delete_btn)
        // Собирание строки
        tr.appendChild(id_td)
        tr.appendChild(task_td)
        tr.appendChild(deadline_td)
        tr.appendChild(status_td)
        tr.appendChild(actions_td)
    });
    // Вызов функции обновления статистики
}

// Функция редактирования
function edit_task(id) {
    let current_task = tasks.find(function(item) {
        return item.id === id
    })
    if (!current_task) {
        return
    }
    input_task.value = current_task.text
    input_date.value = current_task.deadline
    selector_status.value = current_task.status
    edit_id = id
    input_block.style.display = "flex"
    create_btn.style.display = "none"
    input_task.focus()
}

function delete_task(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id
    })
    save_task()
    render_task()
}

// Очистка input
function clear_inputs() {
    input_task.value = ""
    input_date.value = ""
    status_select.value = "Не выполнена"
}

add_task_btn.addEventListener('click', function() {
    create_task()
})
input_task.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        create_task()
    }
})

theme_btn.addEventListener('click', function() {
    if (theme === "light") {
        theme_btn.innerHTML = `<img src="./img/light-theme.png">`
        theme = "dark"
    } else {
        theme_btn.innerHTML = `<img src="./img/dark-theme.png">`
        theme = "light"
    }
})