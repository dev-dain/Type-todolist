// 이 때 taskList는 Element | null (union)
// type assertion이 어느 정도 필요
const taskList = document.querySelector('.task-list') as HTMLUListElement;
const doneList = document.querySelector('.task-list.done') as HTMLUListElement;
let taskStorage: Array<string> = JSON.parse(localStorage.getItem('taskList') as string) || [];
let doneStorage: Array<string> = JSON.parse(localStorage.getItem('doneList') as string) || [];

const addZero = (num: number): string => {
  let returnNum: string = '';
  returnNum = (num < 10) ? `0${num}` : String(num);
  return returnNum;
};

const timer = (): void => {
  const clock = document.querySelector('.clock') as HTMLDivElement;
  const today: Date = new Date();
  let h: string = '';

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
  private _taskDiv: HTMLLIElement;
  private _doneItem: HTMLButtonElement;
  private _taskItem: HTMLDivElement;
  private _delItem: HTMLButtonElement;
  private _flag: boolean;

  constructor(private _task: string) {
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

  get taskDiv(): HTMLLIElement { return this._taskDiv; }
  get flagStatus(): boolean { return this._flag; }
  get task(): string { return this._task; }
  poleFlag(): void { this._flag = !(this._flag); }
}

const addTask = (task: string, pole?: boolean): HTMLLIElement => {
  const newTask: Task = new Task(task);
  
  if (pole) {
    newTask.poleFlag();
  }

  newTask.taskDiv.childNodes[0].addEventListener('click', () => {
    newTask.taskDiv.parentNode?.removeChild(newTask.taskDiv);
    const doneItem: HTMLButtonElement = newTask.taskDiv.childNodes[0] as HTMLButtonElement;
      
    if (!newTask.flagStatus) {
      doneItem.classList.add('back');
      doneList.appendChild(newTask.taskDiv);

      taskStorage.splice(taskStorage.indexOf(task), 1);
      doneStorage.push(task);
    } else {
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
    if (newTask.taskDiv.parentNode === taskList) {
      taskStorage.splice(taskStorage.indexOf(task), 1);
      localStorage.setItem('taskList', JSON.stringify(taskStorage));
    } else {
      doneStorage.splice(doneStorage.indexOf(task), 1);
      localStorage.setItem('doneList', JSON.stringify(doneStorage));
    }
    newTask.taskDiv.parentNode?.removeChild(newTask.taskDiv);
  });

  return newTask.taskDiv;
}


const inputNullProcess = (input: HTMLInputElement): void => {
  input.classList.add('input-null');
  input.focus();
};

const registerNewTask = (input: HTMLInputElement): void => {
  const newTask: HTMLLIElement = addTask(input.value);
  taskList.appendChild(newTask);
  taskStorage.push(input.value);
  localStorage.setItem('taskList', JSON.stringify(taskStorage));
  input.value = '';
}

const start = ():void => {
  timer();
  setInterval(timer, 1000);

  if (localStorage.getItem('taskList')) {
    taskStorage.forEach(val => {
      const newTask: HTMLLIElement = addTask(val);
      taskList.appendChild(newTask);
    });
  }
  if (localStorage.getItem('doneList')) {
    doneStorage.forEach(val => {
      const newTask: HTMLLIElement = addTask(val, true);
      doneList.appendChild(newTask);
      const doneItem: HTMLButtonElement = newTask.childNodes[0] as HTMLButtonElement;
      doneItem.classList.add('back');
    });
  }


  const taskInput: HTMLInputElement = document.querySelector('.inputTask') as HTMLInputElement;
  const addBtn: HTMLButtonElement = document.querySelector('.addTask') as HTMLButtonElement;
  const taskDelBtn: HTMLButtonElement = document.querySelector('.a-delete') as HTMLButtonElement;
  const doneDelBtn: HTMLButtonElement = document.querySelector('.a-delete.done') as HTMLButtonElement;

  taskInput.addEventListener('focus', ():void => taskInput.classList.add('inputTask'));
  taskInput.addEventListener('blur', ():void => taskInput.classList.add('inputTask'));
  taskInput.addEventListener('keydown', ():void => {
    const e: KeyboardEvent = window.event as KeyboardEvent;
    if (e.key === 'Enter') {
      if (taskInput.value.length < 1) {
        inputNullProcess(taskInput);
      } else {
        taskInput.classList.add('inputTask');
        registerNewTask(taskInput);
      }
    }
  });

  addBtn.addEventListener('click', ():void => {
    if (taskInput.value.length < 1) {
      inputNullProcess(taskInput);
    } else {
      registerNewTask(taskInput);
    }
  });

  taskDelBtn.addEventListener('click', ():void => {
    taskList.innerHTML = '';
    taskStorage = [];
    localStorage.removeItem('taskList');
  });

  doneDelBtn.addEventListener('click', ():void => {
    doneList.innerHTML = '';
    doneStorage = [];
    localStorage.removeItem('doneList');
  });
}

window.onload = start;