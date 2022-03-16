import { arrayMoveImmutable } from 'array-move';

import Task from './Task';

const TASK_DELIMITER = '\n';
const TASK_HTML_PREVIEW_LIMIT = 3;

class TaskList {
  private store: Task[];

  constructor(rawString: string) {
    this.store = this.parseRawString(rawString);
  }

  private parseRawString(rawString: string) {
    if (!rawString) {
      rawString = '';
    }

    return rawString
      .split(TASK_DELIMITER)
      .filter((s) => s.replace(/ /g, '').length > 0)
      .map((rawString) => {
        return this.createTask(rawString);
      });
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
    this.store = this.store.filter((task) => !tasks.includes(task));
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
    const from = this.store.indexOf(task);
    const to = this.store.indexOf(taskOccupyingTargetLocation);
    this.store = arrayMoveImmutable(this.store, from, to);
  }

  public taskAtIndex(isOpen: boolean, relativeIndex: number) {
    const tasks = this.splitTasks();
    if (isOpen) {
      return tasks.openTasks[relativeIndex];
    } else {
      return tasks.completedTasks[relativeIndex];
    }
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

    const totalOpenTasks = openTasks.length;
    const totalCompletedTasks = completedTasks.length;
    const totalTasks = totalOpenTasks + totalCompletedTasks;
    const totalTasksToPreview = Math.min(
      totalOpenTasks,
      TASK_HTML_PREVIEW_LIMIT
    );

    const diff = totalOpenTasks - totalTasksToPreview;
    const tasksToPreview = openTasks.slice(0, totalTasksToPreview);

    let htmlPreview = `<div><div style="margin-top: 8px;"><strong>${totalCompletedTasks}/${totalTasks} tasks completed</strong></div>
<progress max="100" style="margin-top: 10px; width: 100%;" value="${
      (totalCompletedTasks / totalTasks) * 100
    }"></progress>`;

    if (totalTasksToPreview > 0) {
      htmlPreview += '<ul style="padding-left: 19px; margin-top: 10px;">';
      tasksToPreview.forEach((task) => {
        htmlPreview += `<li style="margin-bottom: 6px;">${task.content}</li>`;
      });
      htmlPreview += '</ul>';
    }

    if (totalOpenTasks > totalTasksToPreview) {
      htmlPreview += `<div><strong>And ${diff} other open ${
        diff > 1 ? 'tasks' : 'task'
      }.</strong></div>`;
    }

    htmlPreview += '</div>';

    return htmlPreview;
  }

  public buildPlainPreview(): string {
    const { openTasks, completedTasks } = this.splitTasks();
    const totalLength = openTasks.length + completedTasks.length;

    return `${completedTasks.length}/${totalLength} tasks completed.`;
  }
}

export default TaskList;
