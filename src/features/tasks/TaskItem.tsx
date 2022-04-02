import {
  ChangeEvent,
  KeyboardEvent,
  LegacyRef,
  useEffect,
  useState,
} from 'react';

import { taskDeleted, TaskPayload, taskToggled } from './tasks-slice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export type TaskItemProps = {
  task: TaskPayload;
  group: string;
  innerRef: LegacyRef<HTMLDivElement>;
};

const TaskItem: React.FC<TaskItemProps> = ({ group, innerRef, ...props }) => {
  let textAreaElement: HTMLTextAreaElement | null = null;

  const canEdit = useAppSelector((state) => state.settings.canEdit);
  const spellCheckEnabled = useAppSelector(
    (state) => state.settings.spellCheckerEnabled
  );

  const dispatch = useAppDispatch();

  const [task, setTask] = useState(props.task);

  function resizeTextArea(textarea: HTMLTextAreaElement | null): void {
    if (!textarea) {
      return;
    }

    /**
     * Set to 1px first to reset scroll height in case it shrunk.
     */
    textarea.style.height = '1px';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  useEffect(() => {
    resizeTextArea(textAreaElement);
  });

  function toggleCheckboxChange() {
    dispatch(taskToggled({ id: task.id, group }));
  }

  function onTextChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const description = event.target.value;
    setTask({
      ...task,
      description,
    });
  }

  function onKeyUp(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Delete task if empty and enter pressed
    if (event.key === 'Enter') {
      if (task.description.length === 0) {
        dispatch(taskDeleted({ id: task.id, group }));
        event.preventDefault();
      }
    }

    const element = event.target as HTMLTextAreaElement;
    resizeTextArea(element);
  }

  function onKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      // We want to disable any action on enter.
      event.preventDefault();
    }
  }

  return (
    <div
      className={`task ${task.completed ? 'completed' : ''}`}
      ref={innerRef}
      {...props}
    >
      <label className="checkbox-container">
        <input
          checked={task.completed}
          className="checkbox"
          disabled={!canEdit}
          onChange={toggleCheckboxChange}
          spellCheck={spellCheckEnabled}
          type="checkbox"
        />
        <span className="checkmark" />
      </label>
      <textarea
        disabled={!canEdit || !!task.completed}
        className="task-input-textarea"
        dir="auto"
        onChange={onTextChange}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
        ref={(textarea) => (textAreaElement = textarea)}
        spellCheck={spellCheckEnabled}
        value={task.description}
      />
    </div>
  );
};

export default TaskItem;
