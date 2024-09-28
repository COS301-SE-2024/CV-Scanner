import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  useTheme,
  Autocomplete,
  Grid,
} from "@mui/material";
import {
  FaFilter,
  FaSearch,
  FaStar,
  FaHeart,
  FaRegHeart,
  FaMapMarkedAlt,
} from "react-icons/fa";
import Sidebar from "./sidebar";
import {
  getFirestore,
  collection,
  query as firestoreQuery,
  where,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const allowedCities = [
  "Pretoria",
  "Johannesburg",
  "Cape Town",
  "Durban",
  "Gqeberha",
];

const getClosestCity = (input) => {
  return allowedCities.reduce(
    (closest, city) => {
      const distance = getLevenshteinDistance(
        input.toLowerCase(),
        city.toLowerCase(),
      );
      return distance < closest.distance ? { city, distance } : closest;
    },
    { city: "", distance: Infinity },
  ).city;
};

const getLevenshteinDistance = (a, b) => {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]).concat(
    Array.from({ length: a.length + 1 }, () => []),
  );
  for (let i = 1; i <= a.length; i++) matrix[0][i] = i;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (b[i - 1] === a[j - 1] ? 0 : 1),
      );
    }
  }
  return matrix[b.length][a.length];
};

const Activities = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    price: [0, 5000],
    rating: "",
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Track user authentication state
  const [booked, setBooked] = useState({}); // Track booked state for each accommodation
  const [alert, setAlert] = useState("");
  const [showOnlyLiked, setShowOnlyLiked] = useState(false); // Filter toggle

  const location = useLocation();
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set user state on auth state change
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destinationParam = params.get("destination");

    if (destinationParam) {
      setQuery(destinationParam);
      handleSearch(destinationParam.toLowerCase().replace(/\s+/g, ""));
    }
  }, [location, user]);
  const capitalizeFirstLetterOfEachWord = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const handleSearch = async (searchQuery = query) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      console.log("Authenticated user:", user.uid);

      const db = getFirestore();
      const activitiesRef = collection(db, "Activities");
      const formattedQuery = capitalizeFirstLetterOfEachWord(
        searchQuery.replace(/\s+/g, ""),
      );
      const q = firestoreQuery(
        activitiesRef,
        where("city", "==", formattedQuery),
      );
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      if (results.length > 0) {
        setSearchResults(results);
        setFilteredResults(results);
        setError("");
        // After fetching search results, fetch user's liked accommodations
        fetchLikedActivities(results);
      } else {
        setError(`No activities found for "${searchQuery}".`);
        setSearchResults([]);
        setFilteredResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results from Firestore:", error);
      setError("Failed to fetch activities data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedActivities = async (results) => {
    try {
      const db = getFirestore();
      const likedActivitiesRef = collection(db, "LikedActivities");
      const likedQuery = firestoreQuery(
        likedActivitiesRef,
        where("uid", "==", user.uid),
      );
      const likedSnapshot = await getDocs(likedQuery);

      const likedActivities = new Set();
      likedSnapshot.forEach((doc) => {
        const data = doc.data();
        likedActivities.add(data.accommodationName.toLowerCase());
      });

      const updatedBooked = {};
      results.forEach((accommodation, index) => {
        updatedBooked[index] = likedActivities.has(
          accommodation.name.toLowerCase(),
        );
      });

      setBooked(updatedBooked); // Update the booked state to reflect liked accommodations
    } catch (error) {
      console.error(
        "Error fetching liked accommodations from Firestore:",
        error,
      );
    }
  };

  const handleFilterChange = (event, newValue) => {
    if (Array.isArray(newValue)) {
      setFilters({ ...filters, price: newValue });
    } else {
      const { name, value } = event.target;
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const applyFiltersAndSorting = () => {
    let updatedResults = [...searchResults];

    // apply filters
    updatedResults = updatedResults.filter((result) => {
      const meetsPrice =
        result.price >= filters.price[0] && result.price <= filters.price[1];
      const meetsRating = filters.rating
        ? result.rating >= Number(filters.rating)
        : true;
      return meetsPrice && meetsRating;
    });

    // apply sorting
    if (sortOption === "priceAsc") {
      updatedResults.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceDesc") {
      updatedResults.sort((a, b) => b.price - a.price);
    } else if (sortOption === "ratingDesc") {
      updatedResults.sort((a, b) => b.rating - a.rating);
    }

    return updatedResults;
  };

  const handleFilterApply = () => {
    setFilteredResults(applyFiltersAndSorting());
  };

  const handleBookNowClick = async (index, accommodation) => {
    if (!user) {
      setError("You must be logged in to like an accommodation.");
      return;
    }

    const liked = !booked[index];
    setBooked((prevBooked) => ({
      ...prevBooked,
      [index]: liked,
    }));

    try {
      const db = getFirestore();
      const userUid = user.uid; // Get the authenticated user's UID

      const likedAccommodationRef = doc(
        collection(db, "LikedActivitiess"),
        `${userUid}_${accommodation.name}`,
      );

      if (liked) {
        // Save the accommodation to Firestore when liked
        await setDoc(likedAccommodationRef, {
          uid: userUid,
          accommodationName: accommodation.name,
          city: accommodation.city,
          price: accommodation.price,
          rating: accommodation.category,
          rating: accommodation.sub_category,
          description: accommodation.description,
          address: accommodation.address,
        });
        console.log("Activities liked and saved to Firestore");
      } else {
        // Delete the accommodation from Firestore when unliked
        await deleteDoc(likedAccommodationRef);
        console.log("Activities unliked and deleted from Firestore");
      }
    } catch (error) {
      console.error("Error updating liked accommodation in Firestore:", error);
      setError("Failed to update liked accommodation. Please try again.");
    }
  };

  const handleToggleLikedFilter = () => {
    setShowOnlyLiked(!showOnlyLiked);
    if (!showOnlyLiked) {
      const likedResults = searchResults.filter((_, index) => booked[index]);
      setFilteredResults(likedResults); // Show only liked accommodations
    } else {
      setFilteredResults(searchResults); // Show all accommodations
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        sx={{
          width: "250px",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          borderRight: "1px solid #ddd",
          p: 2,
          backgroundColor: "#fff",
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          ml: "250px",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Autocomplete
              freeSolo
              options={allowedCities}
              value={query}
              onChange={(event, newValue) => {
                setQuery(newValue || "");
                handleSearch(newValue || "");
              }}
              onInputChange={(event, newInputValue) => {
                setQuery(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Search accommodations"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleSearch(query)}>
                          <FaSearch />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flexGrow: 1,
                    minWidth: "200px",
                    input: {
                      color: isDarkMode ? "#ffffff" : "#000000",
                    },
                  }}
                />
              )}
            />
            <Button
              variant="outlined"
              startIcon={<FaFilter />}
              onClick={() => setFilterVisible(!filterVisible)}
            >
              Toggle Filters
            </Button>
          </Box>

          {filterVisible && (
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                p: 2,
                mt: 2,
                // backgroundColor: "#fff",
                backgroundColor: isDarkMode ? "#424242" : "#ffffff",
              }}
            >
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="sort-by-select">Sort By</InputLabel>
                <Select
                  sx={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  value={sortOption}
                  onChange={handleSortChange}
                  inputProps={{ id: "sort-by-select" }}
                >
                  <MenuItem
                    value="priceAsc"
                    sx={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  >
                    Price: Low to High
                  </MenuItem>
                  <MenuItem
                    value="priceDesc"
                    sx={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  >
                    Price: High to Low
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <Typography>Price Range</Typography>
                <Slider
                  sx={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  value={filters.price}
                  onChange={handleFilterChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5000}
                  step={100}
                />
              </FormControl>
              <FormControl>
                {" "}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFilterApply}
                >
                  Apply Filters
                </Button>
              </FormControl>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 1 }}>
          <Button
            onClick={handleToggleLikedFilter}
            variant="contained"
            sx={{
              backgroundColor: "lightgrey",
              color: "black",
              "&:hover": { backgroundColor: "grey" },
              textTransform: "none",
            }}
          >
            {showOnlyLiked ? "Show All" : "Show Favourites"}
          </Button>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {filteredResults.map((accommodation, index) => (
                <Grid key={index} item xs={12} sm={10} md={4}>
                  <Card
                    key={index}
                    sx={{
                      maxWidth: 345,
                      width: "100%",
                      maxheight: 480,
                      height: "100%",
                      mb: 1,
                    }}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {accommodation.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {accommodation.category} - {accommodation.sub_category}{" "}
                        <br />
                        <FaMapMarkedAlt /> {accommodation.address}
                        <br />
                        <br />
                        {accommodation.description}
                        <br />
                        <br />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              textAlign: "right",
                              flexGrow: 1,
                            }}
                          >
                            from {"  "} R{accommodation.price}
                            /person
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <IconButton
                                onClick={() =>
                                  handleBookNowClick(index, accommodation)
                                }
                                sx={{
                                  color: booked[index] ? "red" : "grey",
                                  backgroundColor: "transparent",
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                  },
                                }}
                              >
                                {booked[index] ? <FaHeart /> : <FaRegHeart />}
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Activities;
