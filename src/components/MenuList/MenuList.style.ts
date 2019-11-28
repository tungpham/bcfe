import { createStyles, Theme } from '@material-ui/core/styles';

export default createStyles((theme: Theme) =>
  ({
    list: {
      width: '60px',
      float: 'left',
      borderRadius: '0',
      height: 'calc(100vh - 64px)',
      [theme.breakpoints.up('md')]: {
        width: '15%',
      },
    },
    listItemText: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    selectedStyle: {
      color: theme.palette.common.black,
    },
    activeIcon: {
      color: "#57e191",
      backgroundColor:"none",
      fontWeight:'700'
    },
    nonactiveIcon: {
      color: theme.palette.primary.dark
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));
