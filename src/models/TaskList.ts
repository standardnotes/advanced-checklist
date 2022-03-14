import Task from './Task';
import ExtendedArray from './ExtendedArray';

const TASK_DELIMITER = '\n';

class TaskList {
  private store: ExtendedArray<Task>;

  constructor(rawString: string) {
    this.store = this.parseRawString(rawString);
  }

  private parseRawString(rawString: string) {
    if (!rawString) {
      rawString = '';
    }

    const allTasks = rawString
      .split(TASK_DELIMITER)
      .filter((s) => s.replace(/ /g, '').length > 0)
      .map((rawString) => {
        return this.createTask(rawString);
      });

    return new ExtendedArray<Task>(...allTasks);
  }

  public keyForTask(task: Task): string {
    return this.store.indexOf(task) + task.rawString;
  }

  public getTasks(): Task[] {
    return this.store;
  }

  public createTask(rawString: string): Task {
    return new Task(rawString);
  }

  public addTask(task: Task): void {
    this.store.unshift(task);
  }

  public getCompletedTasks(): Task[] {
    return this.store.filter((task) => task.completed);
  }

  public getDataString(): string {
    const tasks = this.getTasks();
    return tasks.map((task) => task.rawString).join(TASK_DELIMITER);
  }

  public openTasks(tasks: Task[]): void {
    tasks.forEach((task) => {
      task.markOpen();
    });
  }

  public removeTasks(tasks: Task[]): void {
    this.store = this.store.filter(
      (task) => !tasks.includes(task)
    ) as ExtendedArray<Task>;
  }

  /**
   * Splits into completed and non completed piles,
   * and organizes them into an ordered array.
   */
  public splitTasks() {
    const tasks = this.getTasks();
    const openTasks: Task[] = [];
    const completedTasks: Task[] = [];

    tasks.forEach((task) => {
      if (task.completed) {
        completedTasks.push(task);
      } else {
        openTasks.push(task);
      }
    });

    return {
      openTasks,
      completedTasks,
    };
  }

  public moveTaskToTop(task: Task): void {
    this.store.splice(this.store.indexOf(task), 1);
    this.store.unshift(task);
  }

  public changeTaskPosition(
    task: Task,
    taskOccupyingTargetLocation: Task
  ): void {
    /*const from = this.store.indexOf(task);
    const to = this.store.indexOf(taskOccupyingTargetLocation);

    this.store = this.store.move(from, to);*/
  }

  public reOpenCompleted(): void {
    const completedTasks = this.getCompletedTasks();
    this.openTasks(completedTasks);
  }

  public deleteCompleted(): void {
    const completedTasks = this.getCompletedTasks();
    this.removeTasks(completedTasks);
  }

  public deleteTask(task: Task): void {
    this.removeTasks([task]);
  }

  public buildHtmlPreview(): string {
    const { openTasks, completedTasks } = this.splitTasks();
    const totalLength = openTasks.length + completedTasks.length;

    const taskPreviewLimit = 3;
    const tasksToPreview = Math.min(openTasks.length, taskPreviewLimit);

    let html = '<div>';
    html += `<div style="margin-top: 8px;"><strong>${completedTasks.length}/${totalLength} tasks completed</strong></div>`;
    html += `<progress max="100" style="margin-top: 10px; width: 100%;" value="${
      (completedTasks.length / totalLength) * 100
    }"></progress>`;

    if (tasksToPreview > 0) {
      html += "<ul style='padding-left: 19px; margin-top: 10px;'>";
      for (let i = 0; i < tasksToPreview; i++) {
        const task = openTasks[i];
        html += `<li style='margin-bottom: 6px;'>${task.content}</li>`;
      }
      html += '</ul>';

      if (openTasks.length > tasksToPreview) {
        const diff = openTasks.length - tasksToPreview;
        const noun = diff === 1 ? 'task' : 'tasks';
        html += `<div><strong>And ${diff} other open ${noun}.</strong></div>`;
      }
    }

    html += '</div>';

    return html;
  }

  public buildPlainPreview(): string {
    const { openTasks, completedTasks } = this.splitTasks();
    const totalLength = openTasks.length + completedTasks.length;

    return `${completedTasks.length}/${totalLength} tasks completed.`;
  }
}

export default TaskList;
