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
    // if (this.done) {
    //   prnt('pop from ', fromSection, ' and push to Done')
    //   state.sections[fromSection].items.splice(state.sections[fromSection].items.indexOf(this), 1)
    //   state.sections['Done'].items.push(this)
    //   this.prevSection = fromSection
    //   this.prevIndex = state.sections[fromSection].items.length // after removal, so last index
    //   this.section = 'Done'
    //   if (fromSection === 'Now' && state.sections.Now.items.length === 0 && state.sections.Next.items.length > 0) {
    //     const promote = state.sections.Next.items.shift()
    //     if (promote) state.sections.Now.items.push(promote)
    //   }
    //   return
    // } else {
    //   prnt('pop from Done and push to ', this.prevSection)
    //   state.sections['Done'].items.splice(state.sections['Done'].items.indexOf(this), 1)
    //   let targetArr = state.sections.Now.items
    //   let targetSection = 'Now'
    //   if (this.prevSection && this.prevSection in state.sections) {
    //     targetArr = state.sections[this.prevSection].items
    //     targetSection = this.prevSection
    //   }
    //   let idx = this.prevIndex
    //   if (typeof idx !== 'number' || idx < 0 || idx > targetArr.length) idx = targetArr.length
    //   targetArr.splice(idx, 0, this)
    //   this.section = targetSection
    //   this.prevSection = 'Done'
    // }
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
  selectedIndex: 3,
  sections: {
    // Now: {
    //   collapsed: false,
    //   items: [
    //   ]
    // },
    // Next: {
    //   collapsed: false,
    //   items: [
    //   ]
    // },
    Done: {
      collapsed: false,
      items: [
        new TodoItem({ text: 'Login system hp4', section: 'Now' }),
        new TodoItem({ text: 'Gallery hp4', section: 'Next' }),
        new TodoItem({ text: 'User Prefs hp4', section: 'Next' }),
        new TodoItem({ text: 'Purchases hp4', section: 'Next' }),
        new TodoItem({ text: 'Check Google', section: 'Next' }),
        new TodoItem({ text: 'iOS Image Export', section: 'Done' }),
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
         e.preventDefault()
         document.body.style.userSelect = 'none'
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
           document.body.classList.add('dragging')
           draggedItem = item
           draggedFromSection = sectionName

           // Clear any existing text selection
           if (window.getSelection) {
             window.getSelection().removeAllRanges()
           }

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

                     // Enhanced drop preview
           const elementBelow = document.elementFromPoint(e.clientX, e.clientY)
           const targetItem = elementBelow?.closest('.todo-item')
           const container = elementBelow?.closest('.items-container')

           // Clear previous indicators
           document.querySelectorAll('.todo-item.drag-over, .todo-item.drag-above, .todo-item.drag-below').forEach(el => {
             el.classList.remove('drag-over', 'drag-above', 'drag-below')
           })
           if (previewLine) {
             previewLine.remove()
             previewLine = null
           }

                       if (targetItem && targetItem.id !== item.id) {
              const targetRect = targetItem.getBoundingClientRect()
              const mouseY = e.clientY
              const targetTop = targetRect.top
              const targetBottom = targetRect.bottom
              const targetHeight = targetRect.height
              
              // Create larger drop zones - top 40% and bottom 40% with 20% middle
              const dropAboveZone = targetTop + (targetHeight * 0.4)
              const dropBelowZone = targetBottom - (targetHeight * 0.4)
              
              // Create enhanced preview line
              previewLine = document.createElement('div')
              previewLine.className = 'drop-indicator'
              previewLine.style.cssText = `
                position: absolute;
                left: 0;
                right: 0;
                height: 3px;
                background: #007acc;
                border-radius: 2px;
                box-shadow: 0 0 8px rgba(0, 122, 204, 0.5);
                z-index: 1000;
                pointer-events: none;
                animation: pulse 1s infinite;
              `
              
              // Position indicator based on mouse position in drop zones
              if (mouseY < dropAboveZone) {
                // Drop above target (in top 40% of item)
                targetItem.classList.add('drag-above')
                targetItem.parentNode.insertBefore(previewLine, targetItem)
                previewLine.style.top = '-2px'
              } else if (mouseY > dropBelowZone) {
                // Drop below target (in bottom 40% of item)
                targetItem.classList.add('drag-below')
                targetItem.parentNode.insertBefore(previewLine, targetItem.nextSibling)
                previewLine.style.top = '-2px'
              } else {
                // In middle zone - default to below for better UX
                targetItem.classList.add('drag-below')
                targetItem.parentNode.insertBefore(previewLine, targetItem.nextSibling)
                previewLine.style.top = '-2px'
              }
            } else if (container && !targetItem) {
             // Dropping in empty space at end of list
             previewLine = document.createElement('div')
             previewLine.className = 'drop-indicator'
             previewLine.style.cssText = `
               position: relative;
               height: 3px;
               background: #007acc;
               border-radius: 2px;
               box-shadow: 0 0 8px rgba(0, 122, 204, 0.5);
               margin: 8px 0;
               animation: pulse 1s infinite;
             `
             container.appendChild(previewLine)
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
           const container = elementBelow?.closest('.items-container')
           let droppedItemId = null
           
           if (targetEl && draggedItem && draggedItem.id !== targetEl.id) {
             const arr = state.sections[sectionName].items
             const oldIdx = arr.findIndex(i => i.id === draggedItem.id)
             const targetId = targetEl.getAttribute('id')
             const targetIdx = arr.findIndex(i => i.id === targetId)
             
             if (oldIdx !== -1 && targetIdx !== -1) {
               // Determine if we're dropping above or below using same logic as visual feedback
               const targetRect = targetEl.getBoundingClientRect()
               const mouseY = e.clientY
               const targetTop = targetRect.top
               const targetBottom = targetRect.bottom
               const targetHeight = targetRect.height
               
               // Use same drop zones as visual feedback
               const dropAboveZone = targetTop + (targetHeight * 0.4)
               const dropBelowZone = targetBottom - (targetHeight * 0.4)
               
               let dropAbove = false
               if (mouseY < dropAboveZone) {
                 dropAbove = true
               } else if (mouseY > dropBelowZone) {
                 dropAbove = false
               } else {
                 // Middle zone defaults to below
                 dropAbove = false
               }
               
               // Remove from old position
               arr.splice(oldIdx, 1)
               
               // Calculate new insert position
               let newIdx = targetIdx
               
               // If we removed an item before the target, adjust target index
               if (oldIdx < targetIdx) {
                 newIdx = targetIdx - 1
               }
               
               // If dropping below, increment the position
               if (!dropAbove) {
                 newIdx = newIdx + 1
               }
               
               // Ensure index is within bounds
               newIdx = Math.max(0, Math.min(newIdx, arr.length))
               
               // Insert at new position
               arr.splice(newIdx, 0, draggedItem)
               droppedItemId = draggedItem.id
             }
           } else if (container && !targetEl && draggedItem) {
             // Drop at end of list
             const arr = state.sections[sectionName].items
             const oldIdx = arr.findIndex(i => i.id === draggedItem.id)
             if (oldIdx !== -1) {
               arr.splice(oldIdx, 1)
               arr.push(draggedItem)
               droppedItemId = draggedItem.id
             }
           }

           // Clear all drag indicators
           document.querySelectorAll('.todo-item.drag-over, .todo-item.drag-above, .todo-item.drag-below').forEach(el => {
             el.classList.remove('drag-over', 'drag-above', 'drag-below')
           })
           
           // Add highlight effect to dropped item
           if (droppedItemId) {
             setTimeout(() => {
               const droppedElement = document.getElementById(droppedItemId)
               if (droppedElement) {
                 droppedElement.classList.add('just-dropped')
                 setTimeout(() => {
                   droppedElement.classList.remove('just-dropped')
                 }, 1000)
               }
             }, 50)
           }
        } else if (!isDragging && distance < DRAG_THRESHOLD && timeDelta < CLICK_TIME_THRESHOLD) {
          item.toggle(sectionName)
        }

                 startTime = 0
         isDragging = false
         e.currentTarget.classList.remove('dragging')
         document.body.classList.remove('dragging')
         draggedItem = false
         draggedFromSection = false
         e.currentTarget.releasePointerCapture(e.pointerId)
         document.body.style.userSelect = ''
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
  const todoList = div(
    {
      class: 'todo-list',
      style: `
        height: 70vh;
        overflow-y: auto;
        padding: 2rem;
        border: 2px solid #333;
        border-radius: 8px;
        scroll-behavior: smooth;
      `
    },
    () => List({
      container: div({ class: 'items-container', style: 'position:relative;' }),
      items: state.sections[sectionName].items,
      renderItem: ({value, index}) => createTodoItem(value, sectionName)
    })
  )
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
          style: 'max-width:15rem;min-width:13rem;',
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
      ? todoList
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

// Add CSS for enhanced drag feedback
const style = document.createElement('style')
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scaleY(1); }
    50% { opacity: 0.7; transform: scaleY(1.2); }
  }
  
  .todo-item.dragging {
    opacity: 0.5;
    transform: rotate(2deg);
    cursor: grabbing !important;
  }
  
  .todo-item.drag-above {
    border-top: 2px solid #007acc;
    background: rgba(0, 122, 204, 0.1);
    transform: translateY(-1px);
    transition: all 0.2s ease;
  }
  
  .todo-item.drag-below {
    border-bottom: 2px solid #007acc;
    background: rgba(0, 122, 204, 0.1);
    transform: translateY(1px);
    transition: all 0.2s ease;
  }
  
  .drag-clone {
    border: 2px dashed #007acc !important;
    transform: rotate(5deg);
    filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.3));
  }
  
  .todo-item {
    transition: all 0.2s ease;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  .todo-item:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  .todo-item.dragging {
    user-select: none !important;
    -webkit-user-select: none !important;
  }
  
  body.dragging {
    user-select: none !important;
    -webkit-user-select: none !important;
  }
  
  .todo-item.just-dropped {
    background: linear-gradient(90deg, rgba(40, 167, 69, 0.3), rgba(40, 167, 69, 0.1), rgba(40, 167, 69, 0.3));
    border: 2px solid #28a745;
    transform: scale(1.02);
    animation: dropHighlight 1s ease-out;
    box-shadow: 0 0 15px rgba(40, 167, 69, 0.4);
  }
  
  @keyframes dropHighlight {
    0% { 
      background: rgba(40, 167, 69, 0.6);
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(40, 167, 69, 0.6);
    }
    50% {
      background: rgba(40, 167, 69, 0.4);
      transform: scale(1.02);
    }
    100% { 
      background: rgba(40, 167, 69, 0.1);
      transform: scale(1);
      box-shadow: 0 0 5px rgba(40, 167, 69, 0.2);
    }
  }
`
document.head.appendChild(style)

van.add(document.getElementById('app'), app)
