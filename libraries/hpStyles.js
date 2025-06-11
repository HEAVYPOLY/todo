// STYLES //
const sm = '0.25rem'
const md = '0.5rem'
const lg = '1rem'
const fontMd = 'font-size:.75rem;'
const fontLg = 'font-size:1rem;'
const fontSm = 'font-size:.5rem;'
const timeSm = '.1s'
const buttonHeight = '1.5rem'
const uiColors = {
  r: 'hsl(338, 100%, 50%)',
  g: 'hsl(147, 100%, 50%)',
  b: 'hsl(220, 100%, 50%)',
  ghost9: 'hsla(0, 0%, 100%, 0.09)',
  ghost6: 'hsla(0, 0%, 100%, 0.06)',
  ghost3: 'hsla(0, 0%, 100%, 0.03)',
  active: 'hsla(121, 88%, 74%, 0.816)',
  button: 'hsl(0, 0%, 16%)',
  text: 'hsla(0, 0%, 100%, 0.5)',
  textHover: 'hsla(0, 0%, 100%, 0.6)',
  textActive: 'hsla(0, 0%, 100%, 0.95)',
  textInverted: 'hsla(0, 0%, 0%, 0.796)',
  neutralBG: 'hsla(0, 0%, 100%, 0.06)',
  neutralBGActive: 'hsla(0, 0%, 100%, 0.1)',
  neutralActive: 'hsla(0, 0%, 100%, 0.44)',
  neutral: 'hsla(0, 0%, 100%, 0.2)',
  neutralHover: 'hsla(0, 0%, 100%, 0.25)',
  grabber: 'hsla(0, 0%, 100%, 0.55)',
  panel: 'hsl(0, 0%, 15%)',
  darkSemitransparent: 'hsla(0, 0%, 0%, 0.65)'
}
const colDarkTransparent = 'background:hsla(0, 0%, 0%, 0.5);'
const colorSets = {
  handle: {
    base: 'hsla(0, 0%, 100%, 0.2)',
    hover: 'hsla(0, 0%, 100%, 0.25)',
    active: 'hsla(0, 0%, 100%, 0.3)',
  },
  accent: {
    base: 'hsla(121, 88%, 74%, 0.616)',
    hover: 'hsla(121, 88%, 74%, 0.756)',
    active: 'hsla(121, 88%, 74%, 0.816)',
  },
  button: {
    base: 'hsla(0, 0%, 100%, 0.06)',
    hover: 'hsla(0, 0%, 100%, 0.1)',
    active: 'hsla(0, 0%, 100%, 0.15)',
  },
  bgButton: {
    base: 'hsla(0, 0%, 100%, 0.06)',
    hover: 'hsla(0, 0%, 100%, 0.1)',
    active: 'hsla(0, 0%, 100%, 0.15)',
  },
  iconButton: {
    base: 'transparent',
    hover: 'hsla(0, 0%, 100%, 0.1)',
    active: 'hsla(0, 0%, 100%, 0.15)',
  }
}
const opSm = 'opacity: 0.5;'
const opMd = 'opacity: 0.75;'
const opLg = 'opacity: 0.9;'
const noInput = 'pointer-events:none;'
const pointerEvents = 'pointer-events:all;'
const fill = 'width: 100%; height: 100%;'
const centerSelf = 'align-self: center;justify-self: center;'
const red = 'background:red;'
const blue = 'background-color:#4343ed;'
const yellow = 'background-color:#ffd700;'
const accentColor = 'background:hsla(121, 88%, 74%, 0.616);'
const blackOutline = 'outline:1px solid black;'
const hidden = 'display: none;'
const clrPanel = 'background:hsla(240, 5%, 16%, 1);'
const abs = 'position: absolute;'
const rel = 'position: relative;'
const darkLow = 'background:hsla(0, 0%, 0%, 0.2);'
const darkMid = 'background:hsla(0, 0%, 0%, 0.5);'
const darkHigh = 'background:hsla(0, 0%, 0%, 0.8);'
const col = 'flex-direction: column;'
const row = 'flex-direction: row;'
const colReverse = 'flex-direction: column-reverse;'
const rowReverse = 'flex-direction: row-reverse;'
const gapSm = `gap: ${sm};`
const gapMd = `gap: ${md};`
const gapLg = `gap: ${lg};`
const w100 = 'width: 100%;'
const h100 = 'height: 100%;'
const wMin = 'width: min-content;'
const minH0 = 'min-height: 0;'
const borderDotted = 'border: .2rem dotted #ffffff8e; border-spacing: .5rem;'
const paddingSm = `padding: ${sm};`
const paddingMd = `padding: ${md};`
const paddingLg = `padding: ${lg};`
const paddingNone = 'padding: 0;'
const cornerRoundSm = `border-radius: ${sm};`
const cornerRoundMd = `border-radius: ${md};`
const cornerRoundLg = `border-radius: ${lg};`
const clip = 'overflow:hidden;'
const marginSm = `margin: ${sm};`
const marginMd = `margin: ${md};`
const marginLg = `margin: ${lg};`
const marginBottomAuto = 'margin-bottom: auto;'
const centerContents = 'align-items: center; justify-content: center;'
const centeredMain = 'align-items: center;'
const centeredCross = 'justify-content: center;'
const transformMid = 'transform: translate(-50%, -50%);'
const grabberWidth = '.25rem'
const sliderHeight = '1.65rem'
const dropShadowLow = 'box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);'
const dropShadowMid = 'box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5);'
const dropShadowHigh = 'box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.5);'
const buttonStyle = cornerRoundSm + paddingLg + centerContents + darkMid
const buttonSizeSm = 'width:2rem;height:2rem;'
const buttonSizeMd = 'width:2.1rem;height:2.1rem;'
const buttonSizeLg = 'width:3rem;height:3rem;'
const squareSm = 'width:1rem;height:1rem;'
const squareMd = 'width:1.5rem;height:1.5rem;'
const squareLg = 'width:3rem;height:3rem;'
const ghostXs = 'background:hsla(0, 0%, 100%, 0.2);'
const ghostSm = 'background:hsla(0, 0%, 100%, 0.4);'
const ghostMd = 'background:hsla(0, 0%, 100%, 0.5);'
const ghostLg = 'background:hsla(0, 0%, 100%, 0.7);'
const ghostXl = 'background:hsla(0, 0%, 100%, 0.9);'
const graySm = 'background:hsla(0, 0%, 80%, 0.5);'
const grayMd = 'background:hsla(0, 0%, 80%, 0.75);'
const grayXl = 'background:hsla(0, 0%, 80%, 1);'
const active = 'background:hsla(148, 100%, 50%, 0.731);'
const iconButtonStyle = cornerRoundSm + paddingNone + centerContents + buttonSizeMd
const panel = col + pointerEvents + gapSm + clrPanel + cornerRoundSm + dropShadowLow + paddingMd
const colorSlider = `width: 100%; height: ${sliderHeight}; border-radius: .25rem; margin-bottom: ${sm};`

const resizeCallbacks = new Map()
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const callback = resizeCallbacks.get(entry.target)
    if (callback) {
      callback(entry.contentRect)
    }
  })
})
const addResizeListener = (el, callback) => {
  resizeCallbacks.set(el, callback)
  resizeObserver.observe(el)
  return () => {
    resizeCallbacks.delete(el)
    resizeObserver.unobserve(el)
  }
}
const withMount = ({ el, onMount, onResize }) => {
  if (el.isConnected) {
    onMount(el)
    return el
  }
  if (onMount) mountCallbacks.set(el, onMount)
  if (onResize) {
    resizeCallbacks.set(el, onResize)
  }
  resizeObserver.observe(el)
  return el
}
const List = ({ container, items, renderItem, onItemObserved, scroll }) => {
  let listObserver
  let list
  if (onItemObserved) {
    list = vanX.list(container, items, ({ val: v }, deleter, key) => withMount({
      el: renderItem(key, v, deleter),
      onMount: (el) => {
        if (listObserver) {
          listObserver.observe(el)
        } else {
          timers.listItem = requestAnimationFrame(() => {
            if (listObserver) {
              listObserver.observe(el)
            } else {
              prnt('no list observer')
            }
          })
        }
      }
    })
    )
  } else {
    list = vanX.list(container, items, ({ val: value }, deleter, key) => renderItem({ key, value, deleter }))
  }
  if (scroll) {
    list = ScrollContainer(list)
  }
  if (onItemObserved) {
    return withMount({
      el: list,
      onMount: (el) => {
        listObserver = new IntersectionObserver((entries) => {
          entries.forEach(onItemObserved)
        }, { root: el, threshold: 0, rootMargin: '50% 0px 50% 0px', })
      }
    })
  }
  return list
}
const Placeholder = () => {
  return div({ style: abs + noInput + hidden + 'width:0;height:0' })
}
