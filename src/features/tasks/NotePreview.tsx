import {
  getTaskArrayFromGroupedTasks,
  groupTasksByCompletedStatus,
  truncateText,
} from '../../common/utils'
import { GroupedTaskPayload, TaskPayload } from './tasks-slice'

const GROUPS_PREVIEW_LIMIT = 3
const MAX_GROUP_DESCRIPTION_LENGTH = 30

type NotePreviewProps = {
  groupedTasks: GroupedTaskPayload
}

const NotePreview: React.FC<NotePreviewProps> = ({ groupedTasks }) => {
  const groups = Object.keys(groupedTasks)
  const groupsToPreview = groups.slice(
    0,
    Math.min(groups.length, GROUPS_PREVIEW_LIMIT)
  )
  if (groupsToPreview.length === 0) {
    return <></>
  }

  const remainingGroups = groups.length - groupsToPreview.length
  const groupNoun = remainingGroups > 1 ? 'groups' : 'group'

  const allTasks: TaskPayload[] = getTaskArrayFromGroupedTasks(groupedTasks)
  const { completedTasks } = groupTasksByCompletedStatus(allTasks)

  return (
    <>
      <div style={{ marginTop: '5px' }}>
        {completedTasks.length}/{allTasks.length} completed
      </div>
      <div style={{ marginTop: '8px' }}>
        {groupsToPreview.map((groupName, index) => {
          const allTasks: TaskPayload[] = groupedTasks[groupName]
          const { completedTasks } = groupTasksByCompletedStatus(allTasks)
          return (
            <p key={`group-${index}`} style={{ marginBottom: '5px' }}>
              {truncateText(groupName, MAX_GROUP_DESCRIPTION_LENGTH)}{' '}
              {completedTasks.length}/{allTasks.length}
            </p>
          )
        })}
      </div>
      {groups.length > groupsToPreview.length && (
        <div style={{ marginTop: '8px' }}>
          <b>
            And {remainingGroups} other {groupNoun}
          </b>
        </div>
      )}
    </>
  )
}

export default NotePreview
