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
  if (Number.isNaN(count) || count <= 0) return 
  Main.randomizeMap(count)
  toggleMenuAction()
}

export function clearAction() {
  const confirm = window.confirm('Clear the map?')
  if (!confirm)  return
  Main.clear() 
  toggleMenuAction()
}

export function removeLastAction() {
  Main.removeLast()
}

export function runAlgorithmAction() {

}

export function chooseAlgorithmAction() {

}