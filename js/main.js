// 이 때 taskList는 Element | null (union)
// type assertion이 어느 정도 필요
const taskList = document.querySelector('.task-list');
const doneList = document.querySelector('.task-list.done');
let taskStorage = JSON.parse(localStorage.getItem('taskList')) || [];
let doneStorage = JSON.parse(localStorage.getItem('doneList')) || [];
const addZero = (num) => {
    let returnNum = '';
    returnNum = (num < 10) ? `0${num}` : String(num);
    return returnNum;
};
const timer = () => {
    const clock = document.querySelector('.clock');
    const today = new Date();
    let h = '';
    // 자정
    h = addZero(today.getHours());
    if (today.getHours() === 0) {
        h = '12';
    }
    clock.innerHTML = `
  ${h} : ${addZero(today.getMinutes())} :
  ${addZero(today.getSeconds())}
  `;
};
// 클래스 프로퍼티에는 const, let이 들어가지 않음!
// const를 하고 싶다면 readonly를 붙일 것
class Task {
    constructor(_task) {
        this._task = _task;
        // 클래스 프로퍼티에 접근할 때 this 키워드 써주기 필수
        this._taskDiv = document.createElement('li');
        this._doneItem = document.createElement('button');
        this._taskItem = document.createElement('div');
        this._delItem = document.createElement('button');
        this._flag = false;
        this._doneItem.classList.add('done-item');
        this._doneItem.innerHTML = '&#10003;';
        this._taskItem.classList.add('task-item');
        this._delItem.classList.add('del-item');
        this._delItem.innerHTML = '&#215;';
        this._taskItem.innerHTML = _task;
        this._taskDiv.appendChild(this._doneItem);
        this._taskDiv.appendChild(this._taskItem);
        this._taskDiv.appendChild(this._delItem);
        this._taskDiv.classList.add('task');
    }
    get taskDiv() { return this._taskDiv; }
    get flagStatus() { return this._flag; }
    get task() { return this._task; }
    poleFlag() { this._flag = !(this._flag); }
}
const addTask = (task, pole) => {
    const newTask = new Task(task);
    if (pole) {
        newTask.poleFlag();
    }
    newTask.taskDiv.childNodes[0].addEventListener('click', () => {
        var _a;
        (_a = newTask.taskDiv.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(newTask.taskDiv);
        const doneItem = newTask.taskDiv.childNodes[0];
        if (!newTask.flagStatus) {
            doneItem.classList.add('back');
            doneList.appendChild(newTask.taskDiv);
            taskStorage.splice(taskStorage.indexOf(task), 1);
            doneStorage.push(task);
        }
        else {
            doneItem.classList.remove('back');
            doneItem.classList.add('done-item');
            taskList.appendChild(newTask.taskDiv);
            doneStorage.splice(doneStorage.indexOf(task), 1);
            taskStorage.push(task);
        }
        localStorage.setItem('taskList', JSON.stringify(taskStorage));
        localStorage.setItem('doneList', JSON.stringify(doneStorage));
        newTask.poleFlag();
    });
    newTask.taskDiv.childNodes[2].addEventListener('click', () => {
        var _a;
        if (newTask.taskDiv.parentNode === taskList) {
            taskStorage.splice(taskStorage.indexOf(task), 1);
            localStorage.setItem('taskList', JSON.stringify(taskStorage));
        }
        else {
            doneStorage.splice(doneStorage.indexOf(task), 1);
            localStorage.setItem('doneList', JSON.stringify(doneStorage));
        }
        (_a = newTask.taskDiv.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(newTask.taskDiv);
    });
    return newTask.taskDiv;
};
const inputNullProcess = (input) => {
    input.classList.add('input-null');
    input.focus();
};
const registerNewTask = (input) => {
    const newTask = addTask(input.value);
    taskList.appendChild(newTask);
    taskStorage.push(input.value);
    localStorage.setItem('taskList', JSON.stringify(taskStorage));
    input.value = '';
};
const start = () => {
    timer();
    setInterval(timer, 1000);
    if (localStorage.getItem('taskList')) {
        taskStorage.forEach(val => {
            const newTask = addTask(val);
            taskList.appendChild(newTask);
        });
    }
    if (localStorage.getItem('doneList')) {
        doneStorage.forEach(val => {
            const newTask = addTask(val, true);
            doneList.appendChild(newTask);
            const doneItem = newTask.childNodes[0];
            doneItem.classList.add('back');
        });
    }
    const taskInput = document.querySelector('.inputTask');
    const addBtn = document.querySelector('.addTask');
    const taskDelBtn = document.querySelector('.a-delete');
    const doneDelBtn = document.querySelector('.a-delete.done');
    taskInput.addEventListener('focus', () => taskInput.classList.add('inputTask'));
    taskInput.addEventListener('blur', () => taskInput.classList.add('inputTask'));
    taskInput.addEventListener('keydown', () => {
        const e = window.event;
        if (e.key === 'Enter') {
            if (taskInput.value.length < 1) {
                inputNullProcess(taskInput);
            }
            else {
                taskInput.classList.add('inputTask');
                registerNewTask(taskInput);
            }
        }
    });
    addBtn.addEventListener('click', () => {
        if (taskInput.value.length < 1) {
            inputNullProcess(taskInput);
        }
        else {
            registerNewTask(taskInput);
        }
    });
    taskDelBtn.addEventListener('click', () => {
        taskList.innerHTML = '';
        taskStorage = [];
        localStorage.removeItem('taskList');
    });
    doneDelBtn.addEventListener('click', () => {
        doneList.innerHTML = '';
        doneStorage = [];
        localStorage.removeItem('doneList');
    });
};
window.onload = start;
