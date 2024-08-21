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
} from "@mui/material";
import { FaFilter, FaSearch } from "react-icons/fa";
import Sidebar from "./sidebar";
import { db } from "../../firebase/firebase-config";
import { collection, doc, setDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Accommodation = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    price: [0, 1000],
    rating: "",
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destinationParam = params.get("destination");

    if (destinationParam) {
      setQuery(destinationParam);
      handleSearch(destinationParam); // Trigger search with destinationParam
    }
  }, [location]);

  const db = getFirestore();

  const handleSearch = async (searchQuery = query) => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User is not authenticated");
      }

      console.log("Authenticated user:", user.uid);

      const response = await fetch(
        `http://localhost:5000/api/search?query=${searchQuery}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.results);
      setFilteredResults(data.results);
      setError("");

      data.results.forEach(async (accommodation, index) => {
        const accommodationId = accommodation.id || `acc_${index}`;
        const docRef = doc(db, "Accommodation", accommodationId);
        const accommodationData = {
          name: accommodation.name,
          description: accommodation.description,
          link: accommodation.link,
          price: accommodation.price,
          rating: accommodation.rating,
          image: accommodation.image,
          city: searchQuery,
        };

        try {
          await setDoc(docRef, accommodationData);
          console.log(
            `Successfully wrote accommodation ${accommodation.name} to Firestore`,
          );
        } catch (firestoreError) {
          console.error(
            `Error writing accommodation ${accommodation.name} to Firestore:`,
            firestoreError,
          );
        }
      });
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError(
        `Failed to fetch accommodation data: ${error.message}. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event, newValue) => {
    const { name, value } = event.target;
    if (name === "price") {
      setFilters({ ...filters, price: newValue });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const applyFiltersAndSorting = () => {
    let updatedResults = [...searchResults];

    // Apply filters
    updatedResults = updatedResults.filter((result) => {
      const meetsPrice =
        result.price >= filters.price[0] && result.price <= filters.price[1];
      const meetsRating = filters.rating
        ? result.rating >= Number(filters.rating)
        : true;
      return meetsPrice && meetsRating;
    });

    // Apply sorting
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

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
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

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: "250px",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search Bar and Filters */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Search accommodations"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleSearch(query)}>
                      <FaSearch />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: "200px" }}
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
                backgroundColor: "#fff",
              }}
            >
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="sort-by-select">Sort By</InputLabel>
                <Select
                  value={sortOption}
                  onChange={handleSortChange}
                  inputProps={{ id: "sort-by-select" }}
                >
                  <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                  <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                  <MenuItem value="ratingDesc">Rating: High to Low</MenuItem>
                </Select>
              </FormControl>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <Typography>Price Range</Typography>
                <Slider
                  value={filters.price}
                  onChange={(event, newValue) =>
                    handleFilterChange(event, newValue)
                  }
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor="rating-select">Minimum Rating</InputLabel>
                <Select
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  inputProps={{ id: "rating-select" }}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFilterApply}
              >
                Apply Filters
              </Button>
            </Box>
          )}
        </Box>

        {/* Accommodation Results */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            filteredResults.map((accommodation, index) => (
              <Card key={index} sx={{ maxWidth: 300 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={accommodation.image}
                  alt={accommodation.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {accommodation.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {accommodation.description}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Price: R{accommodation.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rating: {accommodation.rating}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Accommodation;
