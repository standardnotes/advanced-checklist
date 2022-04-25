import { SKAlert } from '@standardnotes/stylekit'
import { sanitizeHtmlString } from '@standardnotes/utils'
import { GroupedTaskPayload, TaskPayload } from '../features/tasks/tasks-slice'

export function arrayMoveMutable(
  array: any[],
  fromIndex: number,
  toIndex: number
) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex
  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex
    const [item] = array.splice(fromIndex, 1)
    array.splice(endIndex, 0, item)
  }
}

export function arrayMoveImmutable(
  array: any[],
  fromIndex: number,
  toIndex: number
) {
  array = [...array]
  arrayMoveMutable(array, fromIndex, toIndex)
  return array
}

export function getPercentage(numberA: number, numberB: number): number {
  if (numberA === 0 || numberB === 0) {
    return 0
  }
  const min = Math.min(numberA, numberB)
  const max = Math.max(numberA, numberB)
  const percentage = (min / max) * 100
  return Number(percentage.toFixed(2))
}

export function groupTasksByCompletedStatus(tasks: TaskPayload[]) {
  const openTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)
  return {
    openTasks,
    completedTasks,
  }
}

export function getTaskArrayFromGroupedTasks(
  groupedTasks: GroupedTaskPayload
): TaskPayload[] {
  let taskArray: TaskPayload[] = []

  Object.keys(groupedTasks).forEach((group) => {
    taskArray = taskArray.concat(groupedTasks[group])
  })

  return taskArray
}

export function truncateText(text: string, limit: number = 50) {
  if (text.length <= limit) {
    return text
  }
  return text.substring(0, limit) + '...'
}

export function getPlainPreview(groupedTasks: GroupedTaskPayload) {
  const allTasks = getTaskArrayFromGroupedTasks(groupedTasks)
  const { openTasks } = groupTasksByCompletedStatus(allTasks)

  return `${openTasks.length}/${allTasks.length} tasks completed`
}

export function confirmDialog({
  text,
  title,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonStyle = 'info',
}: {
  text: string
  title?: string
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonStyle?: 'danger' | 'info'
}) {
  return new Promise<boolean>((resolve) => {
    const alert = new SKAlert({
      title: title && sanitizeHtmlString(title),
      text: sanitizeHtmlString(text),
      buttons: [
        {
          text: cancelButtonText,
          style: 'neutral',
          action() {
            resolve(false)
          },
        },
        {
          text: confirmButtonText,
          style: confirmButtonStyle,
          action() {
            resolve(true)
          },
        },
      ],
    })
    alert.present()
  })
}

export function alertDialog({
  title,
  text,
  closeButtonText = 'OK',
}: {
  title?: string
  text: string
  closeButtonText?: string
}) {
  return new Promise<void>((resolve) => {
    const alert = new SKAlert({
      title: title && sanitizeHtmlString(title),
      text: sanitizeHtmlString(text),
      buttons: [
        {
          text: closeButtonText,
          style: 'neutral',
          action: resolve,
        },
      ],
    })
    alert.present()
  })
}
