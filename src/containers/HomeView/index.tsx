import React          from 'react'
import { withStyles } from '@material-ui/core/styles'
import kitchen from '../../assets/images/kitchen_sm.jpg'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CustomTableCell from "../../components/shared/CustomTableCell";
import './HomeView.css'

const style = (theme) =>  ({
  root: {
   padding: theme.spacing(1)
  }
})

const divNavLeft = {
    // text-align
}

function HomeView({ classes }) {
  return (
      <div>
        <div className="navHome">
            <div className="navLeft">Welcome Home</div>
            <div className="navRight">Login</div>
        </div>

        <div>
        <img src={kitchen} width="100%" height="5%"/>
        </div>


        <p/>

        <table className="navTable">
            <tr>
                <td colSpan={5}>
                    popular services
                </td>
            </tr>
            <tr>
                <td><a href="/plumbing">plumbing</a></td>
                <td><a href="">roofing</a></td>
                <td><a href="">heating & A/C</a></td>
                <td><a href="">electrical</a></td>
                <td><a href="">landscaping</a></td>
            </tr>
        </table>

      </div>
  )
}

export default withStyles(style)(HomeView);
