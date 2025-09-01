import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto",
    h1: {
      fontFamily: "Roboto",
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: "1.8rem",
      letterSpacing: "0.1em",
    },
  },
  palette: {
    primary: {
      main: "#9c27b0",
    },
    secondary: {
      main: "#09d1b1",
    },
    error: {
      main: "#ff202f",
    },
    info: {
      main: "#000000de",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: {
          "& .MuiPaper-root": {
            "&::-webkit-scrollbar": {
              width: "0.25rem",
              height: "0.25rem",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#B0B0B0",
              borderRadius: "0.25rem",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#EBEBEB",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#E5E7EB",
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          borderRadius: "0.5rem",
          textTransform: "none",
          padding: "0 0.9375rem",
          fontWeight: 500,
          fontSize: "1rem",
          lineHeight: "2.125rem",
          border: "1px solid currentColor",
        },
        contained: {
          backgroundColor: "#2A1989",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#2A1989",
          },
        },
        containedSecondary: {
          backgroundColor: "#09D1B1",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#09D1B1",
          },
        },
        containedInfo: {
          backgroundColor: "transparent",
          color: "#000000de",
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
        outlined: {
          fontFamily: "Roboto",
          borderRadius: "0.5rem",
          borderColor: "#2A1989",
          color: "#2A1989",
          "&:hover": {
            backgroundColor: "#f2eeff",
          },
        },
        endIcon: {
          marginLeft: "8px",
          marginRight: "-18px",
          lineHeight: "2rem",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          fontFamily: "'Roboto'",
          borderRadius: "0.5rem",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          fontSize: "1.25rem",
          fontWeight: 700,
          lineHeight: "1.5rem",
          color: "#111827",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          padding: "2rem",
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#6B7280",
          lineHeight: "1.375rem",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5rem",
          padding: "1rem",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          "&:nth-of-type(odd)": {
            backgroundColor: "#ffffff",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "w#f5f5f5",
          },
          "&:hover": {
            backgroundColor: "#f1f1f5",
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          padding: "1rem",
          color: "#333",
          height: "100%",
          boxShadow: "none",
          maxWidth: "200px",
          overflow: "hidden",
          whiteSpace: "normal",
          wordWrap: "break-word",
        },
        head: {
          backgroundColor: "#f5f5f5",
          color: "#000",
          fontWeight: "700",
          padding: "1rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          display: "flex",
          fontSize: "inherit",
          maxWidth: "400px",
          fontWeight: "400",
          lineHeight: "1.125rem",
          fontFamily: "Roboto",
          border: "1rem",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000000",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {},
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2A1989",
            borderWidth: "2px",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2A1989",
          },
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          display: "block",
          flexDirection: "column",
          alignItems: "flex-start",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          fontWeight: "400",
          maxWidth: "400px",
          padding: "0.5rem",
          height: "2.5rem",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            color: "#2A1989",
            backgroundColor: "#f1f1f1",
            borderRadius: "0.35rem",
          },
          "&.Mui-selected": {
            backgroundColor: "#E8EAF6",
            borderRadius: "0.35rem",
            color: "#2A1989",
            "& .MuiSvgIcon-root": {
              color: "#2A1989",
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "48px",
          color: "#000000de",
          "&.Mui-selected": {
            color: "#2A1989",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          "&:hover": {
            color: "#2A1989",
          },
          "&.Mui-selected": {
            color: "#2A1989",
            fontWeight: "500",
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
          // color: "rgba(0, 0, 0, 0.54)",
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.1)",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Roboto",
          fontSize: "1rem",
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#1976d2",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "18rem",
        },
        circle: {
          strokeLinecap: "round",
        },
      },
      defaultProps: {
        size: 80,
        thickness: 3,
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: "0.25rem",
          fontSize: "0.75rem",
          lineHeight: 1.2,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {},
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "0",
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        root: {
          border: "none",
          display: "none",
          borderColor: "none",
          borderTopStyle: "none",
          borderTopWidth: "none",
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          "&.MuiStepLabel-alternativeLabel": {
            margin: "0 1rem 1rem 1rem",
            flexDirection: "row",
          },
          label: {
            fontSize: "0.875rem",
            padding: "0 8px",
          },
          alternativeLabel: {
            fontSize: "0.875rem",
            margin: "1rem",
          },
          iconContainer: {
            paddingRight: "1rem",
          },
          labelContainer: {
            color: "white",
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          marginTop: "1rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#0a2540",
          color: "#fff",
          fontSize: "0.875rem",
          borderRadius: "4px",
          padding: "8px 12px",
        },
        arrow: {
          color: "#0a2540",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: "4px 4px",
          fontSize: "0.75rem",
          textTransform: "none",
          "&.Mui-selected": {
            color: "#000000",
            fontWeight: "bold",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "4px",
        },
      },
    },
  },
});

export { theme };