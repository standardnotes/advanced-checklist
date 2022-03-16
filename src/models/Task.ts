export type TaskPayload = {
  description?: string;
  completed?: boolean;
};

class Task {
  public description: string;
  public completed: boolean;

  constructor(data: TaskPayload) {
    this.description = data.description ?? '';
    this.completed = data.completed ?? false;
  }

  public isEmpty(): boolean {
    return this.description.length === 0;
  }

  public toggleStatus(): void {
    this.completed = !this.completed;
  }

  public markCompleted(): void {
    this.completed = true;
  }

  public markOpen(): void {
    this.completed = false;
  }
}

export default Task;
