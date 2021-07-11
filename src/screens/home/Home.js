import React, {useEffect} from 'react';
import Header from '../../common/header/Header'
import './Home.css';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {Link} from 'react-router-dom';

import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';

import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import ListItemText from '@material-ui/core/ListItemText';

const styles = (theme) => ({
    typo: {
        color: theme.palette.primary.light
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
        maxWidth: 240
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function Home(props) {
    const [moviesList, setMoviesList] = React.useState([]);
    const [upcomingMovieList, setUpcomingMovieList] = React.useState([]);
    const [genresList, setGenresList] = React.useState([]);
    const [artistList, setArtistList] = React.useState([]);

    const [moviename, setMovieName] = React.useState("");
    const [showgenre, setShowGenre] = React.useState([]);
    const [showartist, setShowArtist] = React.useState([]);
    const [releasedatestart, setReleaseDateStart] = React.useState("");
    const [releasedateend, setReleaseDateEnd] = React.useState("");


    async function loadupcomingMovies() {
        const rawResponse = await fetch(props.baseUrl + "/movies?limit=20&status=PUBLISHED");
        const data = await rawResponse.json();
        setUpcomingMovieList(data.movies);
    }
    async function loadreleasedMovies() {
        const rawResponse = await fetch(props.baseUrl + "/movies?limit=20&status=RELEASED");
        const data = await rawResponse.json();
        setMoviesList(data.movies);
    }
    async function loadGenres() {
        const rawResponse = await fetch(props.baseUrl + "/genres");
        const data = await rawResponse.json();
        setGenresList(data.genres);
    }
    async function loadArtists() {
        const rawResponse = await fetch(props.baseUrl + "/artists");
        const data = await rawResponse.json();
        setArtistList(data.artists.map((artist) => ({
            name: artist.first_name + " " + artist.last_name,
            id: artist.id
        })));
    }


    useEffect(() => {
        loadupcomingMovies();
        loadreleasedMovies();
        loadGenres();
        loadArtists();
    }, []);


    const movieInputHandler = (event) => {
        setMovieName(event.target.value);
    }
    const genreChangeHandler = (event) => {
        setShowGenre(event.target.value);
    }
    const artistChangeHandler = (event) => {
        setShowArtist(event.target.value);
    }
    const releaseDateStartChangeHandler = (event) => {
        setReleaseDateStart(event.target.value);
    }
    const releaseDateEndChangeHandler = (event) => {
        setReleaseDateEnd(event.target.value);
    }

    const onApplyHandler = async () => {
        let filterString = "title="+moviename+"&start_date="+releasedatestart+"&end_date="+releasedateend+"&genre="+showgenre.join()+"&artists="+showartist.join()
        const rawResponse = await fetch(props.baseUrl + "/movies?limit=20&"+filterString);
        const data = await rawResponse.json();
        setMoviesList(data.movies);
    }

    function dateString(string) {
        return new Date(string).toDateString();
    }

    const {classes} = props;

    return (
        <div>
            <Header baseUrl={props.baseUrl}/>
            <div className="heading">Upcoming Movies</div>
            <GridList className="grid-upcoming-movies" cols={6}>
                {upcomingMovieList.map((movie) => (
                    <GridListTile key={movie.id} className="grid-item-upcoming-movies">
                        <img src={movie.poster_url} alt={movie.title}/>
                        <GridListTileBar
                            title={movie.title}
                        />
                    </GridListTile>
                ))}
            </GridList>
            <div style={{display: "flex"}}>
                <div style={{width: "76%", margin: "16px"}}>
                    <GridList cellHeight={350} cols={4}>
                        {moviesList.map((movie) => (
                            <GridListTile key={movie.id}>
                                <Link to={"/movie/" + movie.id}>
                                    <img src={movie.poster_url} alt={movie.title} style={{width: "100%"}}/>
                                    <GridListTileBar
                                        title={movie.title}
                                        subtitle={<span>Release Date: {dateString(movie.release_date)}</span>}
                                    />
                                </Link>
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
                <div style={{width: "24%", margin: "16px"}}>
                    <Card className="cardStyle">
                        <CardContent>
                            <Typography variant="headline" component="h2" className={classes.typo}>
                                FIND MOVIES BY:
                            </Typography>
                            <br/>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="moviename">
                                    Movie Name
                                </InputLabel>
                                <Input
                                    id="moviename"
                                    name="moviename"
                                    onChange={movieInputHandler}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="genres">Genres</InputLabel>
                                <Select
                                    id="genre-mutiple-checkbox"
                                    multiple
                                    value={showgenre}
                                    onChange={genreChangeHandler}
                                    input={<Input/>}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}>
                                    {genresList.map((gen) => (
                                        <MenuItem key={gen.id} value={gen.genre}>
                                            <Checkbox checked={showgenre.indexOf(gen.genre) > -1}/>
                                            <ListItemText primary={gen.genre}/>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="genres">Artists</InputLabel>
                                <Select
                                    id="artist-mutiple-checkbox"
                                    multiple
                                    value={showartist}
                                    onChange={artistChangeHandler}
                                    input={<Input/>}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}>
                                    {artistList.map((artist) => (
                                        <MenuItem key={artist.id} value={artist.name}>
                                            <Checkbox checked={showartist.indexOf(artist.name) > -1}/>
                                            <ListItemText primary={artist.name}/>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    onChange={releaseDateStartChangeHandler}
                                    name="date"
                                    value={releasedatestart}
                                    label="Release Date Start"
                                    variant="filled"
                                    type="date"
                                    InputProps={{
                                        disableUnderline: true,
                                        style: {
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: "4px",
                                            border: "1px solid #CED4DC",
                                            fontSize: ".81em",
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    onChange={releaseDateEndChangeHandler}
                                    name="date"
                                    value={releasedateend}
                                    label="Release Date End"
                                    variant="filled"
                                    type="date"
                                    InputProps={{
                                        disableUnderline: true,
                                        style: {
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: "4px",
                                            border: "1px solid #CED4DC",
                                            fontSize: ".81em",
                                        }
                                    }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </FormControl>
                            <br/>
                            <br/>
                            <Button
                                variant="contained"
                                onClick={onApplyHandler}
                                color="primary"
                            >
                                Apply
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Home);