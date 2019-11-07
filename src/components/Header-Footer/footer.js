import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import '../../assets/css/conflictRemove.css';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import InsertCommentIcon from '@material-ui/icons/InsertComment';

function Footer() {
    return (
        <Grid container spacing={0} className="footer-bg" >
            <Grid item xs={12}>
                <Divider className="footer-divider" variant="middle" />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}>
                <Typography component={'div'} className="footer-head-text" variant="h6"  >
                    Company
                        </Typography>
                <Typography component={'p'} variant="subtitle1" color="textSecondary"  >
                    About
                          </Typography>
                <Typography component={'p'} variant="subtitle1" color="textSecondary" >
                    Contact Us
                        </Typography>

            </Grid>
            <Grid item xs={5} >
                <Typography component={'div'} className="footer-head-text" variant="h6"  >
                    Connect with us
                     </Typography>
                <Typography component={'div'} className="footerText" >
                    <InsertCommentIcon className="footer-icon" />
                    <Typography component={'p'} color="textSecondary" className="icon-text">
                        Houzz Blog
                             </Typography>
                </Typography>
                <Typography component={'div'} className="footerText" >
                    <TwitterIcon className="footer-icon" />
                    <Typography component={'p'} color="textSecondary" className="icon-text">
                        Twitter
                             </Typography>
                </Typography>
                <Typography component={'div'} className="footerText" >
                    <FacebookIcon className="footer-icon" />
                    <Typography component={'p'} color="textSecondary" className="icon-text">
                        Facebook
                             </Typography>
                </Typography>
                <Typography component={'div'} className="footerText" >
                    < YouTubeIcon className="footer-icon" />
                    <Typography component={'p'} color="textSecondary" className="icon-text">
                        YouTube
                             </Typography>
                </Typography>
                <Typography component={'div'} className="footerText" >
                    <RssFeedIcon className="footer-icon" />
                    <Typography component={'p'} color="textSecondary" className="icon-text">
                        Rss
                             </Typography>
                </Typography>
            </Grid>
        </Grid>

    );
}
export default Footer;