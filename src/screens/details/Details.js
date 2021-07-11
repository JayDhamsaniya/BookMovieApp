import React, {useEffect} from 'react';
import './Details.css';
import Header from '../../common/header/Header';
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import YouTube from 'react-youtube';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import StarBorderIcon from '@material-ui/icons/StarBorder';


export default function Details(props) {

    const [movieDetails, setMovieDetails] = React.useState({
        artists: [],
        censor_board_rating: "",
        duration: 0,
        genres: [],
        id: "",
        poster_url: "",
        rating: 0,
        release_date: "",
        status: "",
        storyline: "",
        title: "",
        trailer_url: "",
        wiki_url: ""
    });
    const opts = {
        height: '390',
        width: '800',
        PlayerVars: {
            autoplay: 1
        }
    };

    async function loadDetails() {
        const rawResponse = await fetch(props.baseUrl + "movies/" + props.match.params.id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        });
        const data = await rawResponse.json();
        setMovieDetails(data);
    }

    function dateString(string) {
        return new Date(string).toDateString();
    }

    const videoOnReady = (event) => {
        event.target.pauseVideo();
    }

    const rateClickHandler = (event) => {
        console.log(event.target);
    }

    useEffect(() => {
        loadDetails();
    }, []);

    return (
        <div>
            <Header baseUrl={props.baseUrl} movieid={movieDetails.id} detailButton/>
            <div className="detailsPage">
                <Typography className="back">
                    <Link to={"/"}>
                        &#60; Back to Home
                    </Link>
                </Typography>
                <div className="details-container">
                    <div style={{width: "20%", margin: "0 24px"}}>
                        <img src={movieDetails.poster_url} alt={movieDetails.title} style={{width: "100%"}}/>
                    </div>
                    <div style={{width: "60%", margin: "0 24px"}}>
                        <Typography variant="headline" component="h2">
                            {movieDetails.title}
                        </Typography>
                        <Typography>
                            <b>Genres:</b> {movieDetails.genres.join(", ")}
                        </Typography>
                        <Typography>
                            <b>Duration:</b> {movieDetails.duration}
                        </Typography>
                        <Typography>
                            <b>Release Date:</b> {dateString(movieDetails.release_date)}
                        </Typography>
                        <Typography><b>Rating:</b> {movieDetails.rating}</Typography>
                        <br/>
                        <Typography>
                            <b>Plot: </b>
                            (<a href={movieDetails.wiki_url} target="_blank">Wiki Link</a>) {movieDetails.storyline}
                        </Typography>
                        <br/>
                        <Typography><b>Trailer:</b> <br/><YouTube videoId={movieDetails.trailer_url.split("v=")[1]}
                                                                  opts={opts}
                                                                  onReady={videoOnReady}/> </Typography>
                    </div>
                    <div style={{width: "20%", margin: "0 24px"}}>
                        <Typography style={{fontWeight: 600}}>
                            Rate this movie:
                            <StarRating
                                numberOfStars="5"
                                rating={movieDetails.rating}
                                onClick={rateClickHandler}
                            />
                        </Typography>
                        <Typography style={{fontWeight: 600, margin: "16px 0"}}>
                            Artists:
                        </Typography>
                        <GridList cols={2}>
                            {movieDetails.artists.map((artist) => (
                                <GridListTile key={artist.id}>
                                    <img src={artist.profile_url} alt=""/>
                                    <a href={artist.wiki_url} target="_blank"> <GridListTileBar
                                        title={artist.first_name + " " + artist.last_name}></GridListTileBar>
                                    </a>
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </div>
            </div>
        </div>
    );
}


function StarRating(props) {
    const [currentRating, setCurrentRating] = React.useState();

    React.useEffect(() => {
        setCurrentRating(Math.floor(props.rating / 2));
    }, [props.rating])

    return (
        <div className="rating" data-rating={currentRating}>
            {[...Array(+props.numberOfStars).keys()].map((n, index) => {
                let starColor = "black";
                if ((index + 1) <= currentRating) {
                    starColor = "goldenrod";
                }
                return (
                    <StarBorderIcon color="default" className="star" style={{color: starColor}}
                                    onClick={() => setCurrentRating(index + 1)}
                    />
                );
            })}
        </div>
    );
}