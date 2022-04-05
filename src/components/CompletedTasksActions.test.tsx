import { fireEvent, screen } from '@testing-library/react';

import { testRender } from '../testUtils';
import CompletedTasksActions from './CompletedTasksActions';

beforeAll(() => {
  global.confirm = jest.fn().mockImplementation((message) => true);
});

const group = 'default group';

it('renders two buttons', () => {
  testRender(<CompletedTasksActions group={group} />);

  expect(screen.getByTestId('reopen-completed-button')).toHaveTextContent(
    'Reopen Completed'
  );
  expect(screen.getByTestId('delete-completed-button')).toHaveTextContent(
    'Delete Completed'
  );
});

it('should dispatch openAllCompleted action', () => {
  testRender(<CompletedTasksActions group={group} />);

  const reOpenCompletedButton = screen.getByTestId('reopen-completed-button');
  fireEvent.click(reOpenCompletedButton);

  expect(window.confirm).toBeCalledWith(
    `Are you sure you want to reopen completed tasks on the '${group}' group?`
  );
  // TODO: test that dispatch is called
});

it('should dispatch deleteCompleted action', () => {
  testRender(<CompletedTasksActions group={group} />);

  const deleteCompletedButton = screen.getByTestId('delete-completed-button');
  fireEvent.click(deleteCompletedButton);

  expect(window.confirm).toBeCalledWith(
    `Are you sure you want to delete completed tasks on the '${group}' group?`
  );
  // TODO: test that dispatch is called
});
