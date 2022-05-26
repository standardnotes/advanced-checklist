import './stylesheets/main.scss'

import React, { useCallback, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import EditorKit, { EditorKitDelegate } from '@standardnotes/editor-kit'
import styled from 'styled-components'

import { store } from './app/store'
import { useAppDispatch, useAppSelector } from './app/hooks'
import CreateGroup from './features/tasks/CreateGroup'
import {
  setCanEdit,
  setIsRunningOnMobile,
  setSpellCheckerEnabled,
} from './features/settings/settings-slice'
import { tasksLoaded } from './features/tasks/tasks-slice'
import InvalidContentError from './features/tasks/InvalidContentError'
import MigrateLegacyContent from './features/tasks/MigrateLegacyContent'
import NotePreview from './features/tasks/NotePreview'
import TaskGroupList from './features/tasks/TaskGroupList'

import { getPlainPreview } from './common/utils'

const SpecialContainer = styled.div`
  margin: 18px;
  position: relative;
`

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
`

const TaskEditor: React.FC = () => {
  const note = useRef<any>()
  const editorKit = useRef<EditorKit>()

  const initialized = useAppSelector((state) => state.tasks.initialized)
  const groupedTasks = useAppSelector((state) => state.tasks.groups)
  const legacyContent = useAppSelector((state) => state.tasks.legacyContent)

  const dispatch = useAppDispatch()

  function isRunningOnMobile(): boolean {
    return editorKit.current!.isRunningInMobileApplication()
  }

  const configureEditorKit = useCallback(() => {
    const editorKitDelegate: EditorKitDelegate = {
      setEditorRawText: (rawString: string) => {
        dispatch(tasksLoaded(rawString))
      },
      onNoteValueChange: async (currentNote: any) => {
        note.current = currentNote

        const editable =
          !currentNote.content.appData['org.standardnotes.sn'].locked ?? true
        const spellCheckEnabled = currentNote.content.spellcheck

        dispatch(setCanEdit(editable))
        dispatch(setSpellCheckerEnabled(spellCheckEnabled))
        dispatch(setIsRunningOnMobile(isRunningOnMobile()))
      },
      onNoteLockToggle: (locked: boolean) => {
        dispatch(setCanEdit(!locked))
      },
    }

    editorKit.current = new EditorKit(editorKitDelegate, {
      mode: 'json',
      supportsFileSafe: false,
    })
  }, [dispatch])

  useEffect(() => {
    configureEditorKit()
  }, [configureEditorKit])

  const saveNote = useCallback(() => {
    const { initialized } = store.getState().tasks
    const currentNote = note.current
    if (!currentNote || !initialized) {
      return
    }

    const canEdit = store.getState().settings.canEdit
    if (!canEdit) {
      return
    }

    editorKit.current!.saveItemWithPresave(currentNote, () => {
      const { schemaVersion, groups } = store.getState().tasks
      currentNote.content.text = JSON.stringify(
        { schemaVersion, groups },
        null,
        2
      )

      currentNote.content.preview_plain = getPlainPreview(groups)
      currentNote.content.preview_html = renderToString(
        <NotePreview groupedTasks={groups} />
      )
    })
  }, [])

  useEffect(() => {
    const unsubscribe = store.subscribe(() => initialized && saveNote())
    return unsubscribe
  })

  /**
   * Prevents dragging and dropping files
   */
  useEffect(() => {
    function rejectDragAndDrop(event: DragEvent) {
      event && event.preventDefault()
    }

    window.addEventListener('drop', rejectDragAndDrop)
    window.addEventListener('dragover', rejectDragAndDrop)

    return () => {
      window.removeEventListener('drop', rejectDragAndDrop)
      window.removeEventListener('dragover', rejectDragAndDrop)
    }
  }, [])

  if (legacyContent) {
    return <MigrateLegacyContent />
  }

  if (!initialized) {
    return <InvalidContentError />
  }

  if (groupedTasks.length === 0) {
    return <CreateGroup />
  }

  return (
    <>
      <TaskGroupList groupedTasks={groupedTasks} />
      <SpecialContainer>
        <CenteredContainer>
          <CreateGroup />
        </CenteredContainer>
      </SpecialContainer>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <TaskEditor />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
