import { createStyles, emphasize, Theme } from '@material-ui/core/styles';

export default (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: 'calc(100vh - 136px)',
      overflow: 'scroll',
    },
    tableWrap: {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 192px)',
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
    input: {
      display: 'flex',
      padding: 0,
      height: 'auto',
    },
    waitingSpin: {
      position: 'relative',
      left: 'calc(50% - 10px)',
      top: 'calc(40vh)',
    },
    successAlert: {
      marginBottom: '10px',
    },
    editField: {
      lineHeight: '1.5rem',
    },
    pos: {
      marginBottom: 12,
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: theme.spacing(1, 2),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light'
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
        0.08
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      fontSize: 16,
    },
    card: {
      width: '100%',
      marginBottom: '20px',
      padding: theme.spacing(1)
    },
    button: {
      margin: theme.spacing(1),
    },
    btnSearchWrapper: {
      textAlign: 'end',
      alignSelf: 'center'
    }
  });