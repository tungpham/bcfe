import React from 'react';
import Youtube from 'react-youtube';

interface YoutubeVideoProps{
    videoId: string;
}

class YoutubeVideo extends React.Component<YoutubeVideoProps, any>{
    videoOnReady = (e) => {
        e.target.pauseVideo();
    }
    render(){
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
              autoplay: 1,
              origin: window.location.origin
            }
        };
        console.log("render---")
        const {videoId} = this.props;
        return(
            <Youtube
                videoId={videoId}
                opts={opts}
                onReady={this.videoOnReady}
            />
        )
    }
}
export default YoutubeVideo;