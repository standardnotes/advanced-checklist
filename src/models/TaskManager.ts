import { arrayMoveImmutable } from 'array-move';

import Task, { TaskPayload } from './Task';

const TASK_HTML_PREVIEW_LIMIT = 3;

class TaskManager {
  private storage: Task[];

  constructor(rawString: string) {
    this.storage = this.initializeStore(rawString);
  }

  private initializeStore(rawString: string) {
    if (!rawString) {
      return [];
    }

    try {
      const tasks = JSON.parse(rawString) as TaskPayload[];
      return tasks.map((task) => {
        return this.createTask(task);
      });
    } catch (e) {
      return [];
    }
  }

  public getTasks(): Task[] {
    return this.storage;
  }

  public createTask(data: any): Task {
    return new Task(data);
  }

  public addTask(task: Task): void {
    this.storage.unshift(task);
  }

  public getCompletedTasks(): Task[] {
    return this.storage.filter((task) => task.completed);
  }

  public getStoreAsString(): string {
    const tasks = this.getTasks();
    return JSON.stringify(tasks, null, 2);
  }

  public openTasks(tasks: Task[]): void {
    tasks.forEach((task) => {
      task.markOpen();
    });
  }

  public removeTasks(tasks: Task[]): void {
    this.storage = this.storage.filter((task) => !tasks.includes(task));
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
    this.storage.splice(this.storage.indexOf(task), 1);
    this.storage.unshift(task);
  }

  public changeTaskPosition(
    task: Task,
    taskOccupyingTargetLocation: Task
  ): void {
    const from = this.storage.indexOf(task);
    const to = this.storage.indexOf(taskOccupyingTargetLocation);
    this.storage = arrayMoveImmutable(this.storage, from, to);
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
        htmlPreview += `<li style="margin-bottom: 6px;">${task.description}</li>`;
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

export default TaskManager;
