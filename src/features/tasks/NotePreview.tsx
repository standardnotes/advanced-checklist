import {
  getPercentage,
  getTaskArrayFromGroupedTasks,
  groupTasksByCompletedStatus,
  truncateText,
} from '../../common/utils'
import { GroupPayload, TaskPayload } from './tasks-slice'

const GROUPS_PREVIEW_LIMIT = 3
const MAX_GROUP_DESCRIPTION_LENGTH = 30

const Title: React.FC = ({ children }) => {
  return <p className="ml-2 w-full font-medium">{children}</p>
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
            <p key={`group-${group.name}`} className="mb-1">
              {truncateText(group.name, MAX_GROUP_DESCRIPTION_LENGTH)}
              <span className="px-2 neutral">
                {totalCompletedTasks}/{totalTasks}
              </span>
            </p>
          )
        })}
      </div>
      {remainingGroups > 0 && (
        <p>
          And {remainingGroups} other {groupNoun}
        </p>
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
  const percentage = getPercentage(allTasks.length, completedTasks.length)
  const roundedPercentage = Math.floor(percentage / 10) * 10

  return (
    <>
      <div className="flex flex-grow items-center mb-3">
        <svg className="sk-circular-progress" viewBox="0 0 18 18">
          <circle className="background" />
          <circle className={`progress p-${roundedPercentage}`} />
        </svg>
        <Title>
          {completedTasks.length}/{allTasks.length} tasks completed
        </Title>
      </div>
      <GroupSummary groupedTasks={groupedTasks} />
    </>
  )
}

export default NotePreview
