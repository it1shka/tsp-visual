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

const closeMenuAction = (() => {
  const menu = document.querySelector('.action-menu')
  if (menu === null) {
    throw new Error('Failed to find menu')
  }
  return () => {
    menu.classList.add('closed')
  }
})()

export function randomizeAction() {
  const input = window.prompt('Select number of vertices: ')
  const count = Number(input)
  if (Number.isNaN(count) || count <= 0) return 
  Main.randomizeMap(count)
  closeMenuAction()
}

export function clearAction() {
  const confirm = window.confirm('Clear the map?')
  if (!confirm)  return
  Main.clear()
  closeMenuAction()
}

export function removeLastAction() {
  Main.removeLast()
}

export function runAlgorithmAction() {
  Main.runAlgorithm()
  closeMenuAction()
}

export const chooseAlgorithmAction = (() => {
  const panel = document.querySelector('.algorithm-panel')
  if (panel === null) {
    throw new Error('Failed to get algorithm panel')
  }
  return () => {
    panel.classList.toggle('closed')
  }
})()