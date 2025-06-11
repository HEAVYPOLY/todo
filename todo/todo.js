const { div, span, input, button, h1 } = van.tags
const prnt = console.log
let timers = {}
console.clear()
const genId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
class TodoItem {
  constructor({id, text, section, done, prevSection}) {
    this.id = id || genId()
    this.text = text
    this.done = done || false
    this.section = section
    this.prevSection = prevSection || 'Next'
    if (section === 'Done') {
      this.done = true
    } else {
      this.done = false
    }
  }
  static uncheck(item) {
    item.done = false
    item.prevSection = item.section
    item.section = 'Now'
  }
  serialize() {
    return {
      id: this.id,
      text: this.text,
      done: this.done,
      section: this.section,
      prevSection: this.prevSection
    }
  }
  static deserialize(obj) {
    return new TodoItem(obj)
  }
  move(fromSection, toSection, targetIndex = null) {
    this.prevSection = fromSection
    this.section = toSection
    const thisItem = this
    prnt('moveItem', this.text, fromSection, ' -> ', toSection, targetIndex)
    vanX.replace(state.sections[fromSection].items, state.sections[fromSection].items.filter(i => i.id !== thisItem.id))
    if (targetIndex !== null && targetIndex >= 0) {
      state.sections[toSection].items.splice(targetIndex, 0, thisItem)
    } else {
      state.sections[toSection].items.push(thisItem)
    }
  }
  toggle(fromSection) {
    this.done = !this.done
    if (this.done) {
      prnt('pop from ', fromSection, ' and push to Done')
      state.sections[fromSection].items.splice(state.sections[fromSection].items.indexOf(this), 1)
      state.sections['Done'].items.push(this)
      this.prevSection = fromSection
      this.prevIndex = state.sections[fromSection].items.length // after removal, so last index
      this.section = 'Done'
      if (fromSection === 'Now' && state.sections.Now.items.length === 0 && state.sections.Next.items.length > 0) {
        const promote = state.sections.Next.items.shift()
        if (promote) state.sections.Now.items.push(promote)
      }
      return
    } else {
      prnt('pop from Done and push to ', this.prevSection)
      state.sections['Done'].items.splice(state.sections['Done'].items.indexOf(this), 1)
      let targetArr = state.sections.Now.items
      let targetSection = 'Now'
      if (this.prevSection && this.prevSection in state.sections) {
        targetArr = state.sections[this.prevSection].items
        targetSection = this.prevSection
      }
      let idx = this.prevIndex
      if (typeof idx !== 'number' || idx < 0 || idx > targetArr.length) idx = targetArr.length
      targetArr.splice(idx, 0, this)
      this.section = targetSection
      this.prevSection = 'Done'
    }
  }
}

function loadState() {
  const raw = JSON.parse(localStorage.getItem('todo-state'))
  if (!raw) return false
  const result = { projectName: raw.projectName, sections: {} }
  if (!raw.sections) return false
  for (const section of Object.keys(raw.sections)) {
    result.sections[section] = {
      collapsed: raw.sections[section].collapsed,
      items: raw.sections[section].items.map(TodoItem.deserialize)
    }
  }
  prnt('loaded state', result)
  return result
}

const state = vanX.reactive(loadState() || {
  projectName: 'HEAVYPAINT',
  sections: {
    Now: {
      collapsed: false,
      items: [
        new TodoItem({ text: 'Login system hp4', section: 'Now' }),
      ]
    },
    Next: {
      collapsed: false,
      items: [
        new TodoItem({ text: 'Gallery hp4', section: 'Next' }),
        new TodoItem({ text: 'User Prefs hp4', section: 'Next' }),
        new TodoItem({ text: 'Purchases hp4', section: 'Next' }),
        new TodoItem({ text: 'Check Google', section: 'Next' })
      ]
    },
    Done: {
      collapsed: false,
      items: [
        new TodoItem({ text: 'iOS Image Export', section: 'Done' }),
        new TodoItem({ text: 'Android Project export Tab', section: 'Done' }),
        new TodoItem({ text: 'Android Studio update and new project exported', section: 'Done' }),
        new TodoItem({ text: 'Android image export Tab', section: 'Done' }),
        new TodoItem({ text: 'android Image Export Note 9', section: 'Done' }),
        new TodoItem({ text: 'android Project Export', section: 'Done' }),
        new TodoItem({ text: 'iOS Project Export', section: 'Done' })
      ]
    }
  }
})

van.derive(() => {
  if (state) {
    const toSave = { projectName: state.projectName, sections: {} }
    for (const section of Object.keys(state.sections)) {
      toSave.sections[section] = {
        collapsed: state.sections[section].collapsed,
        items: state.sections[section].items.map(item => item.serialize())
      }
    }
    localStorage.setItem('todo-state', JSON.stringify(toSave))
  }
})

let draggedItem = null
let draggedFromSection = null
let nextId = 15
let dragClone = null
let previewLine = null

function removeDragVisuals () {
  if (dragClone) {
    dragClone.remove()
    dragClone = null
  }
  if (previewLine) {
    previewLine.remove()
    previewLine = null
  }
}

function createTodoItem (item, sectionName) {
  // prnt('createTodoItem')
  let startX = 0
  let startY = 0
  let startTime = 0
  let isDragging = false
  const DRAG_THRESHOLD = 10
  const CLICK_TIME_THRESHOLD = 500

  const todoItem = div(
    {
      class: `todo-item ${item.done ? 'done-item' : ''}`,
      id: item.id,
      section: item.section,
      onpointerdown: (e) => {
        startX = e.clientX
        startY = e.clientY
        startTime = Date.now()
        isDragging = false
        e.currentTarget.setPointerCapture(e.pointerId)
      },
      onpointermove: (e) => {
        if (startTime === 0) return

        const deltaX = Math.abs(e.clientX - startX)
        const deltaY = Math.abs(e.clientY - startY)
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const timeDelta = Date.now() - startTime

        if (distance > DRAG_THRESHOLD && timeDelta < CLICK_TIME_THRESHOLD && !isDragging) {
          isDragging = true
          e.currentTarget.classList.add('dragging')
          draggedItem = item
          draggedFromSection = sectionName

          // Create floating clone
          dragClone = e.currentTarget.cloneNode(true)
          dragClone.style.position = 'fixed'
          dragClone.style.pointerEvents = 'none'
          dragClone.style.opacity = '0.8'
          dragClone.style.zIndex = '9999'
          dragClone.classList.add('drag-clone')
          document.body.appendChild(dragClone)
        }

        if (isDragging) {
          // Move floating clone
          if (dragClone) {
            dragClone.style.left = (e.clientX + 8) + 'px'
            dragClone.style.top = (e.clientY + 8) + 'px'
            dragClone.style.width = e.currentTarget.offsetWidth + 'px'
          }

          // Preview line
          const elementBelow = document.elementFromPoint(e.clientX, e.clientY)
          const targetItem = elementBelow?.closest('.todo-item')
          const dropZone = elementBelow?.closest('.drop-zone')

          document.querySelectorAll('.todo-item.drag-over, .drop-zone.drag-over').forEach(el => {
            el.classList.remove('drag-over')
          })
          if (previewLine) previewLine.remove()

          if (targetItem && targetItem.dataset.itemId !== item.id.toString()) {
            targetItem.classList.add('drag-over')
            previewLine = document.createElement('div')
            previewLine.className = 'preview-line'
            targetItem.parentNode.insertBefore(previewLine, targetItem)
          } else if (dropZone) {
            dropZone.classList.add('drag-over')
            previewLine = document.createElement('div')
            previewLine.className = 'preview-line'
            dropZone.appendChild(previewLine)
          }
        }
      },
      onpointerup: (e) => {
        const timeDelta = Date.now() - startTime
        const deltaX = Math.abs(e.clientX - startX)
        const deltaY = Math.abs(e.clientY - startY)
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        if (isDragging) {
          const elementBelow = document.elementFromPoint(e.clientX, e.clientY)
          const targetEl = elementBelow?.closest('.todo-item')
          const dropZone = elementBelow?.closest('.drop-zone')
          if (targetEl) {
            const targetItemId = targetEl.getAttribute('id')
            const targetItemSection = targetEl.getAttribute('section')
            if (draggedItem && draggedFromSection && (draggedItem.id !== targetItemId || draggedFromSection !== targetItemSection)) {
              const fromArr = state.sections[draggedFromSection].items
              const oldIdx = fromArr.findIndex(i => i.id === draggedItem.id)
              if (oldIdx !== -1) fromArr.splice(oldIdx, 1)
              const toArr = state.sections[targetItemSection].items
              const insertIdx = toArr.findIndex(i => i.id === targetItemId)
              if (insertIdx !== -1) toArr.splice(insertIdx, 0, draggedItem)
              else toArr.push(draggedItem)
              draggedItem.section = targetItemSection
            }
          } else if (dropZone && draggedItem && draggedFromSection) {
            const targetSection = dropZone.getAttribute('data-section') || dropZone.dataset?.section
            if (targetSection && targetSection !== draggedFromSection) {
              const fromArr = state.sections[draggedFromSection].items
              const oldIdx = fromArr.findIndex(i => i.id === draggedItem.id)
              if (oldIdx !== -1) fromArr.splice(oldIdx, 1)
              const toArr = state.sections[targetSection].items
              toArr.push(draggedItem)
              draggedItem.section = targetSection
            }
          }

          document.querySelectorAll('.todo-item.drag-over, .drop-zone.drag-over').forEach(el => {
            el.classList.remove('drag-over')
          })
        } else if (!isDragging && distance < DRAG_THRESHOLD && timeDelta < CLICK_TIME_THRESHOLD) {
          item.toggle(sectionName)
        }

        startTime = 0
        isDragging = false
        e.currentTarget.classList.remove('dragging')
        draggedItem = false
        draggedFromSection = false
        e.currentTarget.releasePointerCapture(e.pointerId)
        removeDragVisuals()
      },
      onpointerenter: (e) => {
        if (isDragging && draggedItem && draggedItem.id !== item.id) {
          e.currentTarget.classList.add('drag-over')
        }
      },
      onpointerleave: (e) => {
        e.currentTarget.classList.remove('drag-over')
      }
    },
    span({
      class: `todo-checkbox ${item.done ? 'checked' : ''}`
    }),
    span({ class: 'todo-text' }, item.text)
  )

  return todoItem
}
const maxNowLength = 1 // or whatever you want

function addNewItem (sectionName, inputElement) {
  const text = inputElement.value.trim()
  if (text) {
    const newItem = new TodoItem({ text, section: sectionName, done: sectionName === 'Done' })
    if (sectionName === 'Now' && state.sections.Now.items.length >= maxNowLength) {
      state.sections.Next.items.push(newItem)
    } else {
      state.sections[sectionName].items.push(newItem)
    }
    inputElement.value = ''
  }
}

function toggleSection (sectionName) {
  state.sections[sectionName].collapsed = !state.sections[sectionName].collapsed
}

function createSection (sectionName, section) {
  const isDoneSection = sectionName === 'Done'
  return div(
    { class: 'section', style: () => (['Next', 'Done'].includes(sectionName) ? ('') : '') + cornerRoundLg + paddingLg + darkLow },
    div(
      { class: 'section-header' },
      div(
        {
          class: 'section-title-wrapper',
          onclick: () => toggleSection(sectionName)
        },
        span({ class: () => `collapse-icon ${section.collapsed ? 'collapsed' : ''}` }, '▼'),
        span({ class: 'section-title' }, sectionName)
      ),
      div(
        { class: 'add-item' },
        input({
          class: 'add-input',
          style: 'width:15rem',
          type: 'text',
          placeholder: 'Add new item...',
          onkeypress: (e) => {
            if (e.key === 'Enter') {
              addNewItem(sectionName, e.target)
            }
          }
        }),
        button({
          class: 'add-button',
          onclick: (e) => {
            const input = e.target.previousElementSibling
            addNewItem(sectionName, input)
          }
        }, 'Add')
      )
    ),
    () => !section.collapsed
      ? List({
        container: div({ style: (isDoneSection ? 'flex-direction:column-reverse;display:flex;' : '') + fill + 'margin-top:1em' }),
        items: section.items,
        renderItem: ({value}) => createTodoItem(value, sectionName)
      })
      : Placeholder()
  )
}
const app = div(
  h1({style:'margin-bottom:1em'},state.projectName),
  prnt('sections', state.sections),
  List({
    container: div(),
    items: state.sections,
    renderItem: ({key, value}) => createSection(key, value)
  }),
  button({ onclick: () => {
    localStorage.removeItem('todo-state')
    window.location.reload()
  } }, 'Reset')
)

van.add(document.getElementById('app'), app)
