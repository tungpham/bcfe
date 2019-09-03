import React          from 'react'
import { withStyles } from '@material-ui/core/styles'
import kitchen from '../../assets/images/kitchen_sm.jpg'
import './PlumbingView.css'

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
        <div className="nav">
            <div className="navLeft"><a href="/">Tim's List</a></div>
            <div className="navRight">Login</div>
        </div>

        <div className="category">
        </div>


        <p/>

        <table className="category_list_table">
            <tr>
                  <td className="category_list_table_td">services</td>
            </tr>
            <tr>
                  <td className="category_list_table_td">roofing</td>
            </tr>
            <tr>
                  <td className="category_list_table_td">heating & A/C</td>
            </tr>
            <tr>
                  <td className="category_list_table_td">electrical</td>
            </tr>
            <tr>
                  <td className="category_list_table_td">landscaping</td>
            </tr>
        </table>

      </div>
  )
}

export default withStyles(style)(HomeView);
