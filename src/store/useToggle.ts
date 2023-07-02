import { create } from "zustand"

type Store = {
  toggle: boolean
  openToggle: () => void
  closeToggle: () => void
  handleToggle: () => void
}
const useToggleStore = create<Store>((set) => ({
  toggle: false,
  openToggle: () => set((state) => ({ toggle: (state.toggle = true) })),
  closeToggle: () => set((state) => ({ toggle: (state.toggle = false) })),
  handleToggle: () =>
    set((state) => ({ toggle: (state.toggle = !state.toggle) })),
}))

export default useToggleStore
