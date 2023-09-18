
const input = new Map<string, boolean>(
  [
    ["w", false],
    ["a", false],
    ["s", false],
    ["d", false],
  ]
)

window.addEventListener("keydown", (e) => {
  input.set(e.key.toLowerCase(), true)
})

window.addEventListener("keyup", (e) => {
  input.set(e.key.toLowerCase(), false)
})

export default input