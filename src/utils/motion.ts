export const asideVariant = {
  initialClose: { width: 96 },
  initialOpen: { width: 224 },
  open: {
    width: 224,
    transition: {
      duration: 1,
      type: "spring",
    },
  },
  close: {
    width: 96,
    transition: {
      duration: 1,
      type: "spring",
    },
  },
}

export const titleVariant = {
  initialClose: {
    fontSize: ".625rem",
  },
  initialOpen: {
    fontSize: ".875rem",
  },
  open: {
    fontSize: ".875rem",
    transition: {
      duration: .75,
      type: "spring",
    },
  },
  close: {
    fontSize: ".625rem",
    transition: {
      duration: .75,
      type: "spring",
    },
  },
}