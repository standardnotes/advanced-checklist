import {
  getTaskArrayFromGroupedTasks,
  groupTasksByCompletedStatus,
  truncateText,
} from '../../common/utils'
import { GroupPayload, TaskPayload } from './tasks-slice'

const GROUPS_PREVIEW_LIMIT = 3
const MAX_GROUP_DESCRIPTION_LENGTH = 30

const Title: React.FC = ({ children }) => {
  return <p className="mt-2 w-full">{children}</p>
}

type GroupSummaryProps = {
  groupedTasks: GroupPayload[]
}

const GroupSummary: React.FC<GroupSummaryProps> = ({ groupedTasks }) => {
  const totalGroups = groupedTasks.length
  const groupsToPreview = groupedTasks.slice(
    0,
    Math.min(totalGroups, GROUPS_PREVIEW_LIMIT)
  )
  if (groupsToPreview.length === 0) {
    return <></>
  }

  const remainingGroups = totalGroups - groupsToPreview.length
  const groupNoun = remainingGroups > 1 ? 'groups' : 'group'

  return (
    <>
      <div className="my-2">
        {groupsToPreview.map((group, index) => {
          const totalTasks = group.tasks.length
          const totalCompletedTasks = group.tasks.filter(
            (task) => task.completed === true
          ).length

          return (
            <div key={`task-${index}`} className="mb-1">
              {truncateText(group.name, MAX_GROUP_DESCRIPTION_LENGTH)}
              <span className="px-2 neutral">
                {totalCompletedTasks}/{totalTasks}
              </span>
            </div>
          )
        })}
      </div>
      {remainingGroups > 0 && (
        <div className="sk-label">
          And {remainingGroups} other {groupNoun}
        </div>
      )}
    </>
  )
}

type NotePreviewProps = {
  groupedTasks: GroupPayload[]
}

const NotePreview: React.FC<NotePreviewProps> = ({ groupedTasks }) => {
  const allTasks: TaskPayload[] = getTaskArrayFromGroupedTasks(groupedTasks)
  const { completedTasks } = groupTasksByCompletedStatus(allTasks)

  return (
    <>
      <Title>
        {completedTasks.length}/{allTasks.length} tasks completed
      </Title>
      <GroupSummary groupedTasks={groupedTasks} />
    </>
  )
}

export default NotePreview
