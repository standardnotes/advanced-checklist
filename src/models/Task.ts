const OPEN_PREFIX: string = '- [ ] ';
const ALLOWED_PREFIXES: RegExp = /^- \[x\] /i;
const COMPLETED_PREFIX: string = '- [x] ';

class Task {
  public completed: boolean;

  constructor(public rawString: string) {
    // Allow both capital and lowercase X on completed when parsing
    this.completed = ALLOWED_PREFIXES.test(rawString);

    if (!this.completed && !rawString.startsWith(OPEN_PREFIX)) {
      // This is a text being created from user input, prepend open prefix
      this.rawString = OPEN_PREFIX.concat(this.rawString);
    }
  }

  public get content(): string {
    return this.rawString
      .replace(OPEN_PREFIX, '')
      .replace(ALLOWED_PREFIXES, '');
  }

  public isEmpty(): boolean {
    return this.content.replace(/ /g, '').length === 0;
  }

  public toggleStatus(): void {
    this.completed = !this.completed;
    this.updateRawString();
  }

  public markCompleted(): void {
    this.completed = true;
    this.updateRawString();
  }

  public markOpen(): void {
    this.completed = false;
    this.updateRawString();
  }

  public setContentString(string: string): void {
    this.rawString = string;
    if (this.completed) {
      this.rawString = COMPLETED_PREFIX.concat(this.rawString);
    } else {
      this.rawString = OPEN_PREFIX.concat(this.rawString);
    }
  }

  public updateRawString(): void {
    if (this.completed) {
      this.rawString = this.rawString.replace(OPEN_PREFIX, COMPLETED_PREFIX);
    } else {
      this.rawString = this.rawString.replace(ALLOWED_PREFIXES, OPEN_PREFIX);
    }
  }
}

export default Task;
