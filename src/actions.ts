import Main from "./main"

export const toggleMenuAction = (() => {
  const menu = document.querySelector('.action-menu')
  if (menu === null) {
    throw new Error('Failed to find menu')
  }
  return () => {
    menu.classList.toggle('closed')
  }
})()

export function randomizeAction() {
  const input = window.prompt('Select number of vertices: ')
  const count = Number(input)
  Main.randomizeMap(count)
}

export function clearAction() {
  const confirm = window.confirm('Clear the map?')
  if (confirm) Main.clear()
}

export function removeLastAction() {
  Main.removeLast()
}