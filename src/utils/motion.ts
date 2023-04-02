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
    fontSize: "0.625rem",
  },
  initialOpen: {
    fontSize: "1rem",
  },
  open: {
    fontSize: "1rem",
    transition: {
      duration: 1,
      type: "spring",
    },
  },
  close: {
    fontSize: "0.625rem",
    transition: {
      duration: 1,
      type: "spring",
    },
  },
}