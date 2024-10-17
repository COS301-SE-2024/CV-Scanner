import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaDollarSign,
  FaHotel,
  FaTasks,
  FaClock,
} from "react-icons/fa";
import { IoAirplaneSharp } from "react-icons/io5"; // For airline icon

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase/firebase-config";
import {
  collection,
  getFirestore,
  query as firestoreQuery,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPEN_AI_KEY,
  dangerouslyAllowBrowser: true,
});

import { Button, Box, Typography, Card, CardContent, TextField, MenuItem, Grid, Alert, Checkbox, FormControlLabel } from "@mui/material";
import { FaPlaneDeparture, FaPlaneArrival, FaDollarSign, FaClock } from "react-icons/fa";
// import { FaPlaneDeparture, FaPlaneArrival, FaDollarSign, FaClock } from 'react-icons/fa';
import { IoAirplaneSharp } from 'react-icons/io5'; // For airline icon
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase/firebase-config";
import { collection, getFirestore, query as firestoreQuery, where, getDocs, setDoc, doc } from "firebase/firestore";


// Amadeus API details and helper functions
const client_id = "rwfsFIbmTtMXDAAjzXKCBcR6lZZirbin";
const client_secret = "RGeFEPqnTMNFKNjd";
const convertPriceToZar = (price, fromCurrency) =>
  fromCurrency === "EUR" ? price * 19.21 : null;

const getFlightOffers = async (
  origin,
  destination,
  departureDate,
  adults,
  maxOffers,
) => {

const convertPriceToZar = (price, fromCurrency) => (fromCurrency === "EUR" ? price * 19.21 : null);

const getFlightOffers = async (origin, destination, departureDate, adults, maxOffers) => {
  const tokenUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";
  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id,
        client_secret,
        grant_type: "client_credentials",
      }),
    });
    const { access_token } = await tokenResponse.json();
    const searchUrl = new URL(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
    );
    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults: adults.toString(),
      max: maxOffers.toString(),
    };
    Object.keys(params).forEach((key) =>
      searchUrl.searchParams.append(key, params[key]),
    );

    const searchResponse = await fetch(searchUrl.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const flightData = await searchResponse.json();

    flightData.data.forEach((flight) => {
      flight.priceInZar =
        convertPriceToZar(
          parseFloat(flight.price.total),
          flight.price.currency,
        )?.toFixed(2) || "N/A";
    const searchUrl = new URL("https://test.api.amadeus.com/v2/shopping/flight-offers");
    const params = { originLocationCode: origin, destinationLocationCode: destination, departureDate, adults: adults.toString(), max: maxOffers.toString() };
    Object.keys(params).forEach((key) => searchUrl.searchParams.append(key, params[key]));

    const searchResponse = await fetch(searchUrl.toString(), { method: "GET", headers: { Authorization: `Bearer ${access_token}` } });
    const flightData = await searchResponse.json();
    
    flightData.data.forEach((flight) => {
      flight.priceInZar = convertPriceToZar(parseFloat(flight.price.total), flight.price.currency)?.toFixed(2) || "N/A";
    });
    console.log("Flight Data: ", flightData.data);
    return flightData.data;
  } catch (error) {
    console.error("Error fetching flight offers:", error);
    return null;
  }
};

function ItineraryForm() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Flights", "Accommodations", "Activities"];

  // Flights state
  const [itineraryName, setItineraryName] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnFlight, setReturnFlight] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState([]);
  const [showFlightSearch, setShowFlightSearch] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("");

  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [arrivalPlaces, setArrivalplaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showActivities, setShowActivities] = useState({});
  const [showAccommodations, setShowAccommodations] = useState({});
  const [filterCriteria, setFilterCriteria] = useState({});
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  //fetch userid


  // Fetch user ID (UID)

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
  }, []);

  // Predefined South African airport codes
  const airportOptions = [
    { label: "Durban (DUR)", code: "DUR" },
    { label: "Cape Town (CPT)", code: "CPT" },
    { label: "Johannesburg (JNB)", code: "JNB" },
    { label: "Port Elizabeth (PLZ)", code: "PLZ" },
    { label: "East London (ELS)", code: "ELS" },
    { label: "Lanseria (HLA)", code: "HLA" },
  ];

  const handleSearchFlights = async () => {
    if (startLocation && endLocation && departureDate) {
      if (startLocation === endLocation) {
        setErrorMessage("Origin and destination cannot be the same.");
        return;
      }

      setErrorMessage("");
      setFlights([]);

      const departureFlights = await getFlightOffers(
        startLocation,
        endLocation,
        departureDate,
        1,
        12,
      );
      setFlights(departureFlights);

      if (returnFlight && returnDate) {
        const returnFlightResults = await getFlightOffers(
          endLocation,
          startLocation,
          returnDate,
          1,
          12,
        );
        setReturnFlights(returnFlightResults);
      }
    }
  };

  const handleFlightToggle = (flight) => {
    setSelectedFlights((prevSelected) =>
      prevSelected.some((f) => f.id === flight.id)
        ? prevSelected.filter((f) => f.id !== flight.id)
        : [...prevSelected, flight],
    );
  };

  const getAirlineName = (carrierCode) => {
    const airlineMap = {
      SA: "South African Airways",
      MN: "Kulula.com",
      "4Z": "Airlink",
      FA: "FlySafair",
      BA: "British Airways (operated by Comair)",
      // Add more airline mappings
    };
    return airlineMap[carrierCode] || carrierCode;
  };

  const getAccommodations = async (endLocations) => {
    try {
      if (!userId) throw new Error("User is not authenticated");

      const db = getFirestore();
      const accommodationsByLocation = {};

      // Fetch accommodations for each end location
      await Promise.all(
        endLocations.map(async (location) => {
          const accommodationsRef = collection(db, "Accommodation");
          const q = firestoreQuery(
            accommodationsRef,
            where(
              "city",
              "==",
              getAirportName(location).toLowerCase().replace(/\s+/g, ""),
            ),
          );

          const querySnapshot = await getDocs(q);
          let results = [];
          querySnapshot.forEach((doc) => {
            results.push(doc.data());
          });

          // Remove duplicate accommodations
          const uniqueResults = results.filter(
            (accommodation, index, self) =>
              index === self.findIndex((a) => a.name === accommodation.name),
          );

          // Store results by location
          accommodationsByLocation[location] = uniqueResults;
        }),
      );

      setAccommodations(accommodationsByLocation);
      return accommodationsByLocation;
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      // setErrorMessage("Failed to fetch accommodations. Please try again.");
    }
  };

  const getActivities = async (endLocations) => {
    try {
      if (!userId) throw new Error("User is not authenticated");

      const db = getFirestore();
      const accommodationsByLocation = {};

      // Fetch activities for each end location
      await Promise.all(
        endLocations.map(async (location) => {
          const accommodationsRef = collection(db, "LikedActivities");
          const q = firestoreQuery(
            accommodationsRef,
            where(
              "city",
              "==",
              getAirportName(location).toLowerCase().replace(/\s+/g, ""),
            ),
          );

          const querySnapshot = await getDocs(q);
          let results = [];
          querySnapshot.forEach((doc) => {
            results.push(doc.data());
          });

          // Remove duplicate accommodations
          const uniqueResults = results.filter(
            (accommodation, index, self) =>
              index === self.findIndex((a) => a.name === accommodation.name),
          );

          // Store results by location
          accommodationsByLocation[location] = uniqueResults;
        }),
      );

      setActivities(accommodationsByLocation);
      return accommodationsByLocation;
    } catch (error) {
      console.error("Error fetching activities:", error);
      //  setErrorMessage("Failed to fetch activities. Please try again.");
    } finally {
      //setLoading(false);
    }
  };

  const handleAccommodationToggle = (accommodation) => {
    //console.log("Toggling accommodation:", accommodation);
    setSelectedAccommodations((prevSelected) => {
      const isSelected = prevSelected.some(
        (acc) => acc.name === accommodation.name,
      );
      return isSelected
        ? prevSelected.filter((acc) => acc.name !== accommodation.name) // Remove if already selected
        : [...prevSelected, accommodation]; // Add if not selected
    });
  };

  const handleActivityToggle = (activity) => {
    setSelectedActivities((prevSelected) => {
      const isSelected = prevSelected.some((a) => a.name === activity.name);
      return isSelected
        ? prevSelected.filter((a) => a.name !== activity.name) // Remove if already selected
        : [...prevSelected, activity]; // Add if not selected
    });
  };

  const getAirportName = (code) => {
    const airport = airportOptions.find((airport) => airport.code === code);
    if (code === "HLA") {
      return "Pretoria";
    }
    if (code === "DUR") {
      return "Durban";
    }
    if (code === "CPT") {
      return "Capetown";
    }
    if (code === "PLZ") {
      return "Gqeberha";
    }
    if (code === "JNB") {
      return "Johannesburg";
    }

    if (code === "ELS") {
      return "Durban";
    }
    return airport ? airport.label : "Airport not found";
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate Flights step
      /*if (selectedFlights.lengt === 0) {
        setErrorMessage("Please select at least one flight.");
        return;
      }*/
      setErrorMessage("");
      const arrivalPlaces = selectedFlights.map(
        (flight) => flight.itineraries[0].segments[0].arrival.iataCode,
      );
      setArrivalplaces(arrivalPlaces);
      const fetchedAccommodations = await getAccommodations(arrivalPlaces);
      setAccommodations(fetchedAccommodations);
      const fetchedActivities = await getActivities(arrivalPlaces);
      setActivities(fetchedActivities);
    } else if (activeStep === 1) {
      // Fetch Accommodations
      setLoading(true);
      const fetchedAccommodations = await getAccommodations(endLocation);
      //setAccommodations(fetchedAccommodations);
      setLoading(false);
    } else if (activeStep === 2) {
      // Fetch Activities
      setLoading(true);
      const fetchedActivities = await getActivities(endLocation);
      //setActivities(fetchedActivities);
      setLoading(false);

      const departureFlights = await getFlightOffers(startLocation, endLocation, departureDate, 1, 12);
      setFlights(departureFlights);

      if (returnFlight && returnDate) {
        const returnFlightResults = await getFlightOffers(endLocation, startLocation, returnDate, 1, 12);
        setReturnFlights(returnFlightResults);
      }

    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);

      const itineraryPrompt = `
        The user has selected the following details for their trip:
        - Flights: ${selectedFlights
          .map(
            (f) =>
              `${f.itineraries[0].segments[0].departure.iataCode} to ${f.itineraries[0].segments[0].arrival.iataCode}`,
          )
          .join(", ")}
        - Accommodations: ${selectedAccommodations
          .map((a) => a.name)
          .join(", ")}
        - Activities: ${selectedActivities.map((act) => act.name).join(", ")}
        
        Create a detailed itinerary based on the provided details. The itinerary should be structured day by day, including any relevant suggestions for travel, lodging, or activities.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful travel assistant." },
          { role: "user", content: itineraryPrompt },
        ],
        max_tokens: 1000,
      });

      const aiGeneratedItinerary = response.choices[0].message.content;

      const itineraryData = {
        userId,
        itineraryName,
        flights: selectedFlights,
        accommodations: selectedAccommodations,
        activities: selectedActivities,
        generatedItinerary: aiGeneratedItinerary,
        createdAt: new Date(),
      };

      /*await setDoc(
        doc(db, "itineraries", `${userId}_${Date.now()}`),
        itineraryData,
      );*/
      console.log(selectedFlights);
      console.log(aiGeneratedItinerary);

      alert("Itinerary saved successfully!");
      setAiResponse(aiGeneratedItinerary);
      setLoading(false);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setErrorMessage("Failed to generate itinerary. Please try again.");
      setLoading(false);
    }
  };

  //filtering for accommodations
  // Toggle the visibility of accommodations for a specific location
  const handleToggle = (location) => {
    setShowAccommodations((prevState) => ({
      ...prevState,
      [location]: !prevState[location],
    }));
  };

  // Update the filter criteria
  const handleFilterChange = (location, criteria) => {
    setFilterCriteria((prevState) => ({
      ...prevState,
      [location]: criteria,
    }));
  };

  // Function to filter accommodations based on the selected criteria
  const applyFilters = (accommodations, criteria) => {
    if (!criteria) return accommodations;
    let filteredAccommodations = [...accommodations];

    // Apply sorting based on the criteria
    if (criteria === "price") {
      filteredAccommodations.sort((a, b) => a.price - b.price);
    } else if (criteria === "rating") {
      filteredAccommodations.sort((a, b) => b.rating - a.rating);
    } else if (criteria === "name") {
      filteredAccommodations.sort((a, b) => a.name - b.name);
    }

    return filteredAccommodations;

  const handleFlightToggle = (flight) => {
    setSelectedFlights((prevSelected) =>
      prevSelected.some((f) => f.id === flight.id) ? prevSelected.filter((f) => f.id !== flight.id) : [...prevSelected, flight]
    );
  };

const getAirlineName = (carrierCode) => {
  const airlineMap = {
   'SA': 'South African Airways',
   'MN': 'Kulula.com',
   '4Z': 'Airlink',
   'FA': 'FlySafair',
   'BA': 'British Airways (operated by Comair)',
    // Add more airline mappings

  };
  return airlineMap[carrierCode] || carrierCode;
};

  //filtering for activities
  // Toggle the visibility of accommodations for a specific location
  const handleToggleactivity = (location) => {
    setShowActivities((prevState) => ({
      ...prevState,
      [location]: !prevState[location],
    }));
  };

  // Update the filter criteria
  const handleFilterChangeactivities = (location, criteria) => {
    setFilterCriteria((prevState) => ({
      ...prevState,
      [location]: criteria,
    }));
  };

  // Function to filter accommodations based on the selected criteria
  const applyFiltersactivities = (accommodations, criteria) => {
    if (!criteria) return accommodations;
    let filteredAccommodations = [...accommodations];

    // Apply sorting based on the criteria
    if (criteria === "sub_categories") {
      filteredAccommodations.sort(
        (a, b) => a.sub_categories[0] - b.sub_categories[0],
      );
    } else if (criteria === "category") {
      filteredAccommodations.sort((a, b) => b.category - a.category);
    } else if (criteria === "name") {
      filteredAccommodations.sort((a, b) => a.name - b.name);
    }

    return filteredAccommodations;
  };

  return (
    <Box alignItems="center" alignContent="center" marginLeft="280px">
      <Box margin="20px">
        <h1 style={{ marginTop: "30px" }}>Itinerary Form</h1>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        {activeStep === 0 && (
          <Box>
            <h2>Step 1: Flights</h2>

            {/* Itinerary, start, end locations, and search button */}
            <TextField
              label="Itinerary Name"
              value={itineraryName}
              onChange={(e) => setItineraryName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Start Location"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              fullWidth
              margin="normal"
            >
              {airportOptions.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="End Location"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              fullWidth
              margin="normal"
            >
              {airportOptions.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              onClick={() => setShowFlightSearch(true)}
              fullWidth
            >
              + Add a Flight
            </Button>

            {/* Flight search section */}
            {showFlightSearch && (
              <>
                {/* Date inputs and checkboxes */}
                <TextField
                  label="Departure Date"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={returnFlight}
                      onChange={(e) => setReturnFlight(e.target.checked)}
                    />
                  }
                  label="Return Flight"
                />
                {returnFlight && (
                  <TextField
                    label="Return Date"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                <Button
                  onClick={handleSearchFlights}
                  variant="contained"
                  color="primary"
                >
                  Search Flights
                </Button>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                {/* Flight cards */}
                <Grid
                  container
                  spacing={2}
                  sx={{ marginTop: "1rem", marginBottom: "15px" }}
                >
                  <h2>Departure Flights</h2>
                  <Grid
                    container
                    spacing={2}
                    sx={{ marginTop: "1rem", marginBottom: "15px" }}
                  >
                    {flights.length > 0 ? (
                      flights.map((flight, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Card
                            onClick={() => handleFlightToggle(flight)}
                            sx={{
                              // boxShadow: selectedFlights.some((f) => f.id === flight.id) ? '0px 0px 8px 2px #7e57c2' : '0px 0px 5px 1px #bbb',
                              // border: selectedFlights.some((f) => f.id === flight.id) ? '1px solid #7e57c2' : '1px solid #ccc',
                              boxShadow: "0px 0px 5px 1px #bbb",
                              transition: "all 0.2s ease",
                              padding: "8px", // Reducing padding
                              fontSize: "0.9rem", // Smaller text size
                            }}
                            alignItems="center"
                            alignContent="center"
                          >
                            <CardContent
                              alignItems="center"
                              alignContent="center"
                            >
                              <Typography
                                align="center"
                                variant="h6"
                                sx={{ fontWeight: "bold", mb: 1 }}
                              >
                                <FaPlaneDeparture />{" "}
                                {
                                  flight.itineraries[0].segments[0].departure
                                    .iataCode
                                }{" "}
                                →{" "}
                                {
                                  flight.itineraries[0].segments[0].arrival
                                    .iataCode
                                }
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: -2,
                                  fontSize: "15.5px",
                                }}
                              >
                                <FaClock
                                  style={{ color: "#ff9800", marginRight: 4 }}
                                />
                                Departure:{" "}
                                {
                                  flight.itineraries[0].segments[0].departure.at.split(
                                    "T",
                                  )[1]
                                }
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: -2,
                                  fontSize: "15.5px",
                                }}
                              >
                                <FaPlaneArrival
                                  style={{ color: "#2196f3", marginRight: 4 }}
                                />
                                Arrival:{" "}
                                {
                                  flight.itineraries[0].segments[0].arrival.at.split(
                                    "T",
                                  )[1]
                                }
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: -2,
                                  fontSize: "15.5px",
                                }}
                              >
                                <IoAirplaneSharp
                                  style={{ color: "#4caf50", marginRight: 4 }}
                                />
                                Airline:{" "}
                                {getAirlineName(
                                  flight.itineraries[0].segments[0].carrierCode,
                                )}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: -2,
                                  fontSize: "15.5px",
                                }}
                              >
                                <FaDollarSign
                                  style={{ color: "#f44336", marginRight: 4 }}
                                />
                                Price: {flight.priceInZar} ZAR
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  mb: -2,
                                  fontSize: "15.5px",
                                }}
                              >
                                <Button
                                  sx={{
                                    mt: 2,
                                    align: "center",
                                    backgroundColor: selectedFlights.some(
                                      (f) => f.id === flight.id,
                                    )
                                      ? "#7e57c2"
                                      : "#2196f3",
                                    color: "white",
                                    "&:hover": {
                                      backgroundColor: selectedFlights.some(
                                        (f) => f.id === flight.id,
                                      )
                                        ? "#5e35b1"
                                        : "#1976d2",
                                    },
                                    transition: "background-color 0.2s ease",
                                    fontSize: "0.8rem", // Smaller button text
                                  }}
                                  variant="contained"
                                >
                                  {selectedFlights.some(
                                    (f) => f.id === flight.id,
                                  )
                                    ? "Remove from Itinerary"
                                    : "Add to Itinerary"}
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Typography>No flights found.</Typography>
                    )}
                  </Grid>

                  {/* Return flights section */}
                  {returnFlight && returnFlights.length > 0 && (
                    <>
                      <h2>Return Flights</h2>
                      <Grid container spacing={2}>
                        {returnFlights.map((flight, index) => (
                          <Grid item xs={12} sm={6} md={3} key={index}>
                            {/* <Card
                            onClick={() => handleFlightToggle(flight)}
                            sx={{
                              boxShadow: selectedFlights.some((f) => f.id === flight.id) ? '0px 0px 8px 2px #7e57c2' : '0px 0px 5px 1px #bbb',
                              border: selectedFlights.some((f) => f.id === flight.id) ? '1px solid #7e57c2' : '1px solid #ccc',
                              transition: 'all 0.2s ease',
                              padding: '8px',
                              fontSize: '0.9rem',
                            }}
                          > */}
                            <Card
                              onClick={() => handleFlightToggle(flight)}
                              sx={{
                                // boxShadow: selectedFlights.some((f) => f.id === flight.id) ? '0px 0px 8px 2px #7e57c2' : '0px 0px 5px 1px #bbb',
                                // border: selectedFlights.some((f) => f.id === flight.id) ? '1px solid #7e57c2' : '1px solid #ccc',
                                boxShadow: "0px 0px 5px 1px #bbb",
                                transition: "all 0.2s ease",
                                padding: "8px", // Reducing padding
                                fontSize: "0.9rem", // Smaller text size
                              }}
                              alignItems="center"
                              alignContent="center"
                            >
                              <CardContent>
                                <Typography
                                  align="center"
                                  variant="h6"
                                  sx={{ fontWeight: "bold", mb: 1 }}
                                >
                                  <FaPlaneArrival />{" "}
                                  {
                                    flight.itineraries[0].segments[0].departure
                                      .iataCode
                                  }{" "}
                                  →{" "}
                                  {
                                    flight.itineraries[0].segments[0].arrival
                                      .iataCode
                                  }
                                </Typography>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: -2,
                                    fontSize: "15.5px",
                                  }}
                                >
                                  <FaClock
                                    style={{ color: "#ff9800", marginRight: 4 }}
                                  />
                                  Departure:{" "}
                                  {
                                    flight.itineraries[0].segments[0].departure.at.split(
                                      "T",
                                    )[1]
                                  }
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: -2,
                                    fontSize: "15.5px",
                                  }}
                                >
                                  <FaPlaneArrival
                                    style={{ color: "#2196f3", marginRight: 4 }}
                                  />
                                  Arrival:{" "}
                                  {
                                    flight.itineraries[0].segments[0].arrival.at.split(
                                      "T",
                                    )[1]
                                  }
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: -2,
                                    fontSize: "15.5px",
                                  }}
                                >
                                  <IoAirplaneSharp
                                    style={{ color: "#4caf50", marginRight: 4 }}
                                  />
                                  Airline:{" "}
                                  {getAirlineName(
                                    flight.itineraries[0].segments[0]
                                      .carrierCode,
                                  )}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: -2,
                                    fontSize: "15.5px",
                                  }}
                                >
                                  <FaDollarSign
                                    style={{ color: "#f44336", marginRight: 4 }}
                                  />
                                  Price: {flight.priceInZar} ZAR
                                </Typography>

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mb: -2,
                                    fontSize: "15.5px",
                                  }}
                                >
                                  <Button
                                    sx={{
                                      mt: 2,
                                      backgroundColor: selectedFlights.some(
                                        (f) => f.id === flight.id,
                                      )
                                        ? "#7e57c2"
                                        : "#2196f3",
                                      color: "white",
                                      "&:hover": {
                                        backgroundColor: selectedFlights.some(
                                          (f) => f.id === flight.id,
                                        )
                                          ? "#5e35b1"
                                          : "#1976d2",
                                      },
                                      transition: "background-color 0.2s ease",
                                      fontSize: "0.8rem",
                                    }}
                                    variant="contained"
                                  >
                                    {selectedFlights.some(
                                      (f) => f.id === flight.id,
                                    )
                                      ? "Remove from Itinerary"
                                      : "Add to Itinerary"}
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </Grid>
              </>
            )}

            <h2 style={{ marginTop: "50px" }}>Selected Flights</h2>
            <Grid container spacing={2}>
              {selectedFlights.map((flight, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography
                        align="center"
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        <FaPlaneDeparture />{" "}
                        {flight.itineraries[0].segments[0].departure.iataCode} →{" "}
                        {flight.itineraries[0].segments[0].arrival.iataCode}
                      </Typography>
                      {/* <Typography variant="body1">
                        Price: {flight.priceInZar} ZAR
                      </Typography> */}
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: -3,
                          fontSize: "15.5px",
                        }}
                      >
                        <FaClock style={{ color: "#ff9800", marginRight: 4 }} />
                        Departure:{" "}
                        {
                          flight.itineraries[0].segments[0].departure.at.split(
                            "T",
                          )[1]
                        }
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: -3,
                          fontSize: "15.5px",
                        }}
                      >
                        <FaPlaneArrival
                          style={{ color: "#2196f3", marginRight: 4 }}
                        />
                        Arrival:{" "}
                        {
                          flight.itineraries[0].segments[0].arrival.at.split(
                            "T",
                          )[1]
                        }
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: -3,
                          fontSize: "15.5px",
                        }}
                      >
                        <IoAirplaneSharp
                          style={{ color: "#4caf50", marginRight: 4 }}
                        />
                        Airline:{" "}
                        {getAirlineName(
                          flight.itineraries[0].segments[0].carrierCode,
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: -3,
                          fontSize: "15.5px",
                        }}
                      >
                        <FaDollarSign
                          style={{ color: "#f44336", marginRight: 4 }}
                        />
                        Price: {flight.priceInZar} ZAR
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ marginTop: "20px" }}>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <h2>Step 2: Accommodations</h2>

            {loading ? (
              <CircularProgress sx={{ marginTop: "20px" }} />
            ) : (
              <Box sx={{ marginTop: "20px" }}>
                {Object.entries(accommodations).map(
                  ([location, locationAccommodations]) => (
                    <Box key={location} sx={{ marginBottom: "30px" }}>
                      <h2>
                        Accommodations in {getAirportName(location)}
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => handleToggle(location)}
                          sx={{ marginLeft: "10px" }}
                        >
                          {showAccommodations[location] ? "Hide" : "Show"}
                        </Button>
                      </h2>

                      {showAccommodations[location] && (
                        <>
                          {/* Filter buttons */}
                          <Box sx={{ marginTop: "10px", marginBottom: "10px" }}>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleFilterChange(location, "price")
                              }
                              sx={{ marginRight: "10px" }}
                            >
                              Sort by Price
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleFilterChange(location, "rating")
                              }
                              sx={{ marginRight: "10px" }}
                            >
                              Sort by Rating
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleFilterChange(location, "name")
                              }
                            >
                              Sort by Name
                            </Button>
                          </Box>
                          <Grid
                            container
                            spacing={2}
                            sx={{ marginTop: "10px" }}
                          >
                            {applyFilters(
                              locationAccommodations,
                              filterCriteria[location],
                            ).length > 0 ? (
                              applyFilters(
                                locationAccommodations,
                                filterCriteria[location],
                              ).map((acc) => (
                                <Grid item xs={12} sm={6} md={4} key={acc.name}>
                                  <Card
                                    variant={
                                      selectedAccommodations.some(
                                        (a) => a.name === acc.name,
                                      )
                                        ? "outlined"
                                        : "elevation"
                                    }
                                    sx={{
                                      cursor: "pointer",
                                      borderColor: selectedAccommodations.some(
                                        (a) => a.name === acc.name,
                                      )
                                        ? "primary.main"
                                        : "grey.300",
                                    }}
                                    onClick={() =>
                                      handleAccommodationToggle(acc)
                                    }
                                  >
                                    <CardMedia
                                      component="img"
                                      height="100"
                                      image={acc.image}
                                      alt={acc.name}
                                    />
                                    <CardContent>
                                      <Typography variant="h8">
                                        <b>{acc.name}</b>
                                        <br />R{acc.price} per night
                                        <br />
                                        Rating: {acc.rating} ⭐ -
                                        <a href="{acc.link}">More info</a>
                                        <br />
                                      </Typography>

                                      <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                          marginTop: "10px",
                                          backgroundColor:
                                            selectedAccommodations.some(
                                              (a) => a.name === acc.name,
                                            )
                                              ? "#7e57c2"
                                              : "#2196f3",
                                        }}
                                      >
                                        {selectedAccommodations.some(
                                          (a) => a.name === acc.name,
                                        )
                                          ? "Remove"
                                          : "Select"}
                                      </Button>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))
                            ) : (
                              <Typography>No accommodations found.</Typography>
                            )}
                          </Grid>
                          <hr style={{ margin: "20px 0" }} /> {/* Separator */}
                        </>
                      )}
                    </Box>
                  ),
                )}
              </Box>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ marginTop: "10px" }}>
                {errorMessage}
              </Alert>
            )}

            <Box sx={{ marginTop: "20px" }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ marginRight: "10px" }}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
              Step 3: Activities
            </Typography>

            {loading ? (
              <CircularProgress sx={{ marginTop: "20px" }} />
            ) : (
              <Box sx={{ marginTop: "20px" }}>
                {Object.entries(activities).map(
                  ([location, locationActivities]) => (
                    <Box key={location} sx={{ marginBottom: "30px" }}>
                      <h2>
                        Activities in {getAirportName(location)}
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => handleToggleactivity(location)}
                          sx={{ marginLeft: "10px" }}
                        >
                          {showActivities[location] ? "Hide" : "Show"}
                        </Button>
                      </h2>

                      {showActivities[location] && (
                        <>
                          {/* Filter buttons */}
                          <Box sx={{ marginTop: "10px", marginBottom: "10px" }}>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleFilterChangeactivities(
                                  location,
                                  "sub_categories",
                                )
                              }
                              sx={{ marginRight: "10px" }}
                            >
                              Sort activity name
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleFilterChangeactivities(
                                  location,
                                  "category",
                                )
                              }
                              sx={{ marginRight: "10px" }}
                            >
                              Sort by Category
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleFilterChangeactivities(location, "name")
                              }
                            >
                              Sort by Name
                            </Button>
                          </Box>
                          <Grid
                            container
                            spacing={2}
                            sx={{ marginTop: "10px" }}
                          >
                            {applyFiltersactivities(
                              locationActivities,
                              filterCriteria[location],
                            ).length > 0 ? (
                              applyFiltersactivities(
                                locationActivities,
                                filterCriteria[location],
                              ).map((acc) => (
                                <Grid item xs={12} sm={6} md={4} key={acc.name}>
                                  <Card
                                    variant={
                                      selectedActivities.some(
                                        (a) => a.name === acc.name,
                                      )
                                        ? "outlined"
                                        : "elevation"
                                    }
                                    sx={{
                                      cursor: "pointer",
                                      borderColor: selectedActivities.some(
                                        (a) => a.name === acc.name,
                                      )
                                        ? "primary.main"
                                        : "grey.300",
                                    }}
                                    onClick={() => handleActivityToggle(acc)}
                                  >
                                    <CardMedia
                                      component="img"
                                      height="100"
                                      image={acc.image}
                                      alt={acc.name}
                                    />
                                    <CardContent>
                                      <Typography variant="h8">
                                        <b>{acc.name}</b>
                                        <br />
                                        Category: {acc.category}
                                        <br />
                                        {acc.sub_categories[0]} -
                                        <a href="{acc.info_url}">More info</a>
                                        <br />
                                      </Typography>

                                      <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                          marginTop: "10px",
                                          backgroundColor:
                                            selectedActivities.some(
                                              (a) => a.name === acc.name,
                                            )
                                              ? "#7e57c2"
                                              : "#2196f3",
                                        }}
                                      >
                                        {selectedActivities.some(
                                          (a) => a.name === acc.name,
                                        )
                                          ? "Remove"
                                          : "Select"}
                                      </Button>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))
                            ) : (
                              <Typography>No activities found.</Typography>
                            )}
                          </Grid>
                          <hr style={{ margin: "20px 0" }} /> {/* Separator */}
                        </>
                      )}
                    </Box>
                  ),
                )}
              </Box>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ marginTop: "10px" }}>
                {errorMessage}
              </Alert>
            )}

            <Box sx={{ marginTop: "20px" }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ marginRight: "10px" }}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
              Review and Submit
            </Typography>

            <Box sx={{ marginTop: "10px" }}>
              <Typography variant="h6">Itinerary Name:</Typography>
              <Typography>{itineraryName}</Typography>
            </Box>

            <Box sx={{ marginTop: "10px" }}>
              <Typography variant="h6">Flights:</Typography>
              {selectedFlights.map((flight, index) => (
                <Typography key={index}>
                  {flight.itineraries[0].segments[0].departure.iataCode} to{" "}
                  {flight.itineraries[0].segments[0].arrival.iataCode}
                </Typography>
              ))}
            </Box>

            <Box sx={{ marginTop: "10px" }}>
              <Typography variant="h6">Accommodations:</Typography>
              {selectedAccommodations.map((acc, index) => (
                <Typography key={index}>{acc.name}</Typography>
              ))}
            </Box>

            <Box sx={{ marginTop: "10px" }}>
              <Typography variant="h6">Activities:</Typography>
              {selectedActivities.map((act, index) => (
                <Typography key={index}>{act.name}</Typography>
              ))}
            </Box>

            {errorMessage && (
              <Alert severity="error" sx={{ marginTop: "10px" }}>
                {errorMessage}
              </Alert>
            )}

            {loading && <CircularProgress sx={{ marginTop: "20px" }} />}

            {aiResponse && (
              <Box sx={{ marginTop: "20px" }}>
                <Typography variant="h6">Generated Itinerary:</Typography>
                <Typography>{aiResponse}</Typography>
              </Box>
            )}

            <Box sx={{ marginTop: "20px" }}>
              <Button
                variant="outlined"
                onClick={() => setActiveStep(activeStep - 1)}
                sx={{ marginRight: "10px" }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleFinish}
                disabled={loading}
              >
                Finish
              </Button>
            </Box>
          </Box>
        )}
      </Box>


return (
  <Box alignItems="center" alignContent="center" marginLeft="280px">
    <Box margin="20px">
      <h1 style={{ marginLeft: "-40px", marginTop: "-10px" }}>Itinerary Form</h1>
      <h2>Step 1: Flights</h2>

      {/* Itinerary, start, end locations, and search button */}
      <TextField label="Itinerary Name" value={itineraryName} onChange={(e) => setItineraryName(e.target.value)} fullWidth margin="normal" />
      <TextField select label="Start Location" value={startLocation} onChange={(e) => setStartLocation(e.target.value)} fullWidth margin="normal">
        {airportOptions.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="End Location" value={endLocation} onChange={(e) => setEndLocation(e.target.value)} fullWidth margin="normal">
        {airportOptions.map((option) => (
          <MenuItem key={option.code} value={option.code}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="outlined" onClick={() => setShowFlightSearch(true)} fullWidth>
        + Add a Flight
      </Button>

      {/* Flight search section */}
      {showFlightSearch && (
        <>
          {/* Date inputs and checkboxes */}
          <TextField label="Departure Date" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <FormControlLabel control={<Checkbox checked={returnFlight} onChange={(e) => setReturnFlight(e.target.checked)} />} label="Return Flight" />
          {returnFlight && (
            <TextField label="Return Date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          )}
          <Button onClick={handleSearchFlights} variant="contained" color="primary">Search Flights</Button>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {/* Flight cards */}
          <Grid container spacing={2} sx={{ marginTop: "1rem", marginBottom: "15px" }}>
            <h2>Departure Flights</h2>
            <Grid container spacing={2} sx={{ marginTop: "1rem", marginBottom: "15px" }}>
              {flights.length > 0 ? (
                flights.map((flight, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                      onClick={() => handleFlightToggle(flight)}
                      sx={{
                        // boxShadow: selectedFlights.some((f) => f.id === flight.id) ? '0px 0px 8px 2px #7e57c2' : '0px 0px 5px 1px #bbb',
                        // border: selectedFlights.some((f) => f.id === flight.id) ? '1px solid #7e57c2' : '1px solid #ccc',
                        boxShadow: '0px 0px 5px 1px #bbb',
                        transition: 'all 0.2s ease',
                        padding: '8px', // Reducing padding
                        fontSize: '0.9rem', // Smaller text size
                      }}
                      alignItems="center" 
                      alignContent="center"

                    >
                      <CardContent alignItems="center" alignContent="center">
                        <Typography align= "center" variant="h6" sx={{ fontWeight: 'bold', mb: 1}}>
                          <FaPlaneDeparture /> {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments[0].arrival.iataCode}
                        </Typography>

                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -2, fontSize: '15.5px' }}>
                          <FaClock style={{ color: "#ff9800", marginRight: 4 }} />
                          Departure: {flight.itineraries[0].segments[0].departure.at.split("T")[1]}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -2, fontSize: '15.5px' }}>
                          <FaPlaneArrival style={{ color: "#2196f3", marginRight: 4 }} />
                          Arrival: {flight.itineraries[0].segments[0].arrival.at.split("T")[1]}
                        </Typography>                        
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -2 , fontSize: '15.5px'}}>
                          <IoAirplaneSharp style={{ color: "#4caf50", marginRight: 4 }} />
                          Airline: {getAirlineName(flight.itineraries[0].segments[0].carrierCode)}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -2, fontSize: '15.5px'}}>
                          <FaDollarSign style={{ color: "#f44336", marginRight: 4 }} />
                          Price: {flight.priceInZar} ZAR
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: -2, fontSize: '15.5px' }}>
                        <Button
                          
                          sx={{
                            mt: 2,
                            align: "center",
                            backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? "#7e57c2" : "#2196f3",
                            color: "white",
                            '&:hover': {
                              backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? '#5e35b1' : '#1976d2',
                            },
                            transition: 'background-color 0.2s ease',
                            fontSize: "0.8rem" // Smaller button text
                          }}
                          variant="contained"
                          
                        >
                          {selectedFlights.some((f) => f.id === flight.id) ? "Remove from Itinerary" : "Add to Itinerary"}
                        </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography>No flights found.</Typography>
              )}
            </Grid>

            {/* Return flights section */}
            {returnFlight && returnFlights.length > 0 && (
              <>
                <h2>Return Flights</h2>
                <Grid container spacing={2}>
                  {returnFlights.map((flight, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      {/* <Card
                        onClick={() => handleFlightToggle(flight)}
                        sx={{
                          boxShadow: selectedFlights.some((f) => f.id === flight.id) ? '0px 0px 8px 2px #7e57c2' : '0px 0px 5px 1px #bbb',
                          border: selectedFlights.some((f) => f.id === flight.id) ? '1px solid #7e57c2' : '1px solid #ccc',
                          transition: 'all 0.2s ease',
                          padding: '8px',
                          fontSize: '0.9rem',
                        }}
                      > */}
                      <Card 
                      onClick={() => handleFlightToggle(flight)}
                      sx={{
                        // boxShadow: selectedFlights.some((f) => f.id === flight.id) ? '0px 0px 8px 2px #7e57c2' : '0px 0px 5px 1px #bbb',
                        // border: selectedFlights.some((f) => f.id === flight.id) ? '1px solid #7e57c2' : '1px solid #ccc',
                        boxShadow: '0px 0px 5px 1px #bbb',
                        transition: 'all 0.2s ease',
                        padding: '8px', // Reducing padding
                        fontSize: '0.9rem', // Smaller text size
                      }}
                      alignItems="center" 
                      alignContent="center"

                    >
                        <CardContent>
                          <Typography align= "center" variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            <FaPlaneArrival /> {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments[0].arrival.iataCode}
                          </Typography>

                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -2, fontSize: '15.5px' }}>
                            <FaClock style={{ color: "#ff9800", marginRight: 4 }} />
                            Departure: {flight.itineraries[0].segments[0].departure.at.split("T")[1]}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -2, fontSize: '15.5px' }}>
                            <FaPlaneArrival style={{ color: "#2196f3", marginRight: 4 }} />
                            Arrival: {flight.itineraries[0].segments[0].arrival.at.split("T")[1]}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center',mb: -2, fontSize: '15.5px' }}>
                            <IoAirplaneSharp style={{ color: "#4caf50", marginRight: 4 }} />
                            Airline: {getAirlineName(flight.itineraries[0].segments[0].carrierCode)}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -2, fontSize: '15.5px' }}>
                            <FaDollarSign style={{ color: "#f44336", marginRight: 4 }} />
                            Price: {flight.priceInZar} ZAR
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: -2, fontSize: '15.5px' }}>
                        
                          <Button
                            sx={{
                              mt: 2,
                              backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? "#7e57c2" : "#2196f3",
                              color: "white",
                              '&:hover': {
                                backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? '#5e35b1' : '#1976d2',
                              },
                              transition: 'background-color 0.2s ease',
                              fontSize: "0.8rem"
                            }}
                            variant="contained"
                          >
                            {selectedFlights.some((f) => f.id === flight.id) ? "Remove from Itinerary" : "Add to Itinerary"}
                          </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Grid>
        </>
      )}

       <h2 style={{marginTop: "50px"}}>Selected Flights</h2>
         <Grid container spacing={2}>
          {selectedFlights.map((flight, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography align="center" variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    <FaPlaneDeparture /> {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments[0].arrival.iataCode}
                  </Typography>
                  {/* <Typography variant="body1">
                    Price: {flight.priceInZar} ZAR
                  </Typography> */}
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -3, fontSize: '15.5px' }}>
                    <FaClock style={{ color: "#ff9800", marginRight: 4 }} />
                      Departure: {flight.itineraries[0].segments[0].departure.at.split("T")[1]}
                 </Typography>
                 <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -3, fontSize: '15.5px' }}>
                            <FaPlaneArrival style={{ color: "#2196f3", marginRight: 4 }} />
                            Arrival: {flight.itineraries[0].segments[0].arrival.at.split("T")[1]}
                          </Typography>
                       <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center',mb: -3, fontSize: '15.5px' }}>
                            <IoAirplaneSharp style={{ color: "#4caf50", marginRight: 4 }} />
                            Airline: {getAirlineName(flight.itineraries[0].segments[0].carrierCode)}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: -3, fontSize: '15.5px' }}>
                            <FaDollarSign style={{ color: "#f44336", marginRight: 4 }} />
                            Price: {flight.priceInZar} ZAR
                          </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

       <Button variant="contained" sx={{ marginTop: "20px" }}>
         Next: Accommodations
       </Button>

    </Box>
  </Box>
);

  
}

export default ItineraryForm;












/* IGNORE */

// return (
  //   <Box alignItems="center" alignContent="center" marginLeft="280px">
  //   <Box margin="20px">
  //     <h1 style={{marginLeft:"-40px", marginTop:"-10px"}}>Itinerary Form</h1>
  //     <h2>Step 1: Flights</h2>

  //     <TextField label="Itinerary Name" value={itineraryName} onChange={(e) => setItineraryName(e.target.value)} fullWidth margin="normal" />

  //     <TextField select label="Start Location" value={startLocation} onChange={(e) => setStartLocation(e.target.value)} fullWidth margin="normal">
  //       {airportOptions.map((option) => (
  //         <MenuItem key={option.code} value={option.code}>
  //           {option.label}
  //         </MenuItem>
  //       ))}
  //     </TextField>

  //     <TextField select label="End Location" value={endLocation} onChange={(e) => setEndLocation(e.target.value)} fullWidth margin="normal">
  //       {airportOptions.map((option) => (
  //         <MenuItem key={option.code} value={option.code}>
  //           {option.label}
  //         </MenuItem>
  //       ))}
  //     </TextField>

  //     <Button variant="outlined" onClick={() => setShowFlightSearch(true)} fullWidth>
  //       + Add a Flight
  //     </Button>

  //     {showFlightSearch && (
  //       <>
  //         <TextField label="Departure Date" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />

  //         <FormControlLabel
  //           control={<Checkbox checked={returnFlight} onChange={(e) => setReturnFlight(e.target.checked)} />}
  //           label="Return Flight"
  //         />

  //         {returnFlight && (
  //           <TextField label="Return Date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
  //         )}

  //         <Button onClick={handleSearchFlights} variant="contained" color="primary">
  //           Search Flights
  //         </Button>

  //         {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          
  //         <Grid container spacing={2} sx={{ marginTop: "1rem", marginBottom: "15px" }}>
  //           {/* <Typography variant="h6">Departure Flights</Typography> */}
  //           <h2>Departure Flights</h2>
  //           <Grid container spacing={2} sx={{ marginTop: "1rem", marginBottom: "15px" }}>
            
  //           {flights.length > 0 ? (
  //             flights.map((flight, index) => (
  //               <Grid item xs={12} sm={6} md={4} key={index}>
  //                 <Card onClick={() => handleFlightToggle(flight)}>
  //                   <CardContent>
  //                     <Typography>
  //                       <FaPlaneDeparture /> {flight.itineraries[0].segments[0].departure.iataCode} to {flight.itineraries[0].segments[0].arrival.iataCode}
  //                     </Typography>
  //                     <Typography>{flight.price.total} {flight.price.currency} ({flight.priceInZar} ZAR)</Typography>
  //                     <Typography>Class: {flight.travelerPricings[0].fareDetailsBySegment[0].class}, Cabin: {flight.travelerPricings[0].fareDetailsBySegment[0].cabin}</Typography>
  //                     {/* <Button 
  //                       sx={{
  //                           backgroundColor: "purple",
                            
  //                           '&:hover': {
  //                           backgroundColor: '#570987',
      
  //                           },
  //                          }} 
                           
  //                          variant="contained"
  //                     >
  //                       {selectedFlights.some((f) => f.id === flight.id) ? "Remove from Itinerary" : "Add to Itinerary"}
  //                       </Button> */}
  //                       <Button 
  //                         sx={{
  //                           backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? "purple" : "#1769aa",
  //                           '&:hover': {
  //                               backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? '#570987' : '#1769aa',
  //                             },
  //                         }} 
  //                         variant="contained"
  //                       >   
  //                         {selectedFlights.some((f) => f.id === flight.id) ? "Remove from Itinerary" : "Add to Itinerary"}
  //                       </Button>

  //                   </CardContent>
  //                 </Card>
  //               </Grid>
                
  //             ))
  //           ) : (
  //             <Typography>No flights found.</Typography>
  //           )}
  //           </Grid>
            

  //           {returnFlight && returnFlights.length > 0 && (
  //             <>
  //               {/* <Typography variant="h6">Return Flights</Typography> */}
  //               <h2>Return Flights</h2>
  //               <Grid container spacing={2} sx={{ marginTop: "1rem", marginBottom: "15px" }}>
  //               {returnFlights.map((flight, index) => (
  //                 <Grid item xs={12} sm={6} md={4} key={index}>
  //                   <Card onClick={() => handleFlightToggle(flight)}>
  //                     <CardContent>
  //                       <Typography>
  //                         <FaPlaneArrival /> {flight.itineraries[0].segments[0].departure.iataCode} to {flight.itineraries[0].segments[0].arrival.iataCode}
  //                       </Typography>
  //                       <Typography>{flight.price.total} {flight.price.currency} ({flight.priceInZar} ZAR)</Typography>
  //                       <Typography>Class: {flight.travelerPricings[0].fareDetailsBySegment[0].class}, Cabin: {flight.travelerPricings[0].fareDetailsBySegment[0].cabin}</Typography>
  //                       {/* <Button variant="contained">
  //                         {selectedFlights.some((f) => f.id === flight.id) ? "Remove from Itinerary" : "Add to Itinerary"}
  //                       </Button> */}

  //                       <Button 
  //                         sx={{
  //                           backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? "purple" : "#1769aa",
  //                           '&:hover': {
  //                               backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? '#570987' : '#1769aa',
  //                             },
  //                         }} 
  //                         variant="contained"
  //                       >   
  //                         {selectedFlights.some((f) => f.id === flight.id) ? "Remove from Itinerary" : "Add to Itinerary"}
  //                       </Button>
  //                     </CardContent>
  //                   </Card>
  //                 </Grid>
  //               ))}
  //               </Grid>
  //             </>
              
  //           )}
            
  //         </Grid>

  //         <Button marginTop="50px" padding="20px" variant="outlined" onClick={() => setShowFlightSearch(false)}>
  //           Done
  //         </Button>
  //       </>
  //     )}

  //     {/* <Typography variant="h6" sx={{ marginTop: "20px" }}>Selected Flights</Typography> */}
  //     <h2 style={{marginTop: "50px"}}>Selected Flights</h2>
  //     <Grid container spacing={2}>
  //       {selectedFlights.map((flight, index) => (
  //         <Grid item xs={12} sm={6} md={4} key={index}>
  //           <Card>
  //             <CardContent>
  //               <Typography><FaPlaneDeparture /> {flight.itineraries[0].segments[0].departure.iataCode} to {flight.itineraries[0].segments[0].arrival.iataCode}</Typography>
  //               <Typography>{flight.price.total} {flight.price.currency}</Typography>
  //             </CardContent>
  //           </Card>
  //         </Grid>
  //       ))}
  //     </Grid>

  //     <Button variant="contained" sx={{ marginTop: "20px" }}>
  //       Next: Accommodations
  //     </Button>
  //   </Box>
  //   </Box>
  // );
//--------------------------------------------------------------------------------------------------
  // return (
  //   <Box alignItems="center" alignContent="center" marginLeft="280px">
  //     <Box margin="20px">
  //       <h1 style={{marginLeft:"-40px", marginTop:"-10px"}}>Itinerary Form</h1>
  //       <h2>Step 1: Flights</h2>
  
  //       <TextField label="Itinerary Name" value={itineraryName} onChange={(e) => setItineraryName(e.target.value)} fullWidth margin="normal" />
  
  //       <TextField select label="Start Location" value={startLocation} onChange={(e) => setStartLocation(e.target.value)} fullWidth margin="normal">
  //         {airportOptions.map((option) => (
  //           <MenuItem key={option.code} value={option.code}>
  //             {option.label}
  //           </MenuItem>
  //         ))}
  //       </TextField>
  
  //       <TextField select label="End Location" value={endLocation} onChange={(e) => setEndLocation(e.target.value)} fullWidth margin="normal">
  //         {airportOptions.map((option) => (
  //           <MenuItem key={option.code} value={option.code}>
  //             {option.label}
  //           </MenuItem>
  //         ))}
  //       </TextField>
  
  //       <Button variant="outlined" onClick={() => setShowFlightSearch(true)} fullWidth>
  //         + Add a Flight
  //       </Button>
  
  //       {showFlightSearch && (
  //         <>
  //           <TextField label="Departure Date" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
  
  //           <FormControlLabel
  //             control={<Checkbox checked={returnFlight} onChange={(e) => setReturnFlight(e.target.checked)} />}
  //             label="Return Flight"
  //           />
  
  //           {returnFlight && (
  //             <TextField label="Return Date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
  //           )}
  
  //           <Button onClick={handleSearchFlights} variant="contained" color="primary">
  //             Search Flights
  //           </Button>
  
  //           {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            
  //           <Grid container spacing={2} sx={{ marginTop: "1rem", marginBottom: "15px" }}>
  //             <h2>Departure Flights</h2>
  //             <Grid container spacing={2} sx={{ marginTop: "1rem", marginBottom: "15px" }}>
              
  //             {flights.length > 0 ? (
  //               flights.map((flight, index) => (
  //                 <Grid item xs={12} sm={6} md={4} key={index}>
  //                   <Card onClick={() => handleFlightToggle(flight)} sx={{
  //                     boxShadow: selectedFlights.some((f) => f.id === flight.id) ? '0px 0px 15px 2px #570987' : '0px 0px 10px 1px #ccc',
  //                     border: selectedFlights.some((f) => f.id === flight.id) ? '2px solid #570987' : '1px solid #ddd',
  //                     transition: 'all 0.3s ease',
  //                   }}>
  //                     <CardContent>
  //                       <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
  //                         <FaPlaneDeparture /> {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments[0].arrival.iataCode}
  //                       </Typography>
  //                       <Typography variant="body1" sx={{ mb: 1 }}>
  //                         <FaPlaneDeparture style={{ marginRight: 4 }} />
  //                         Departure: {flight.itineraries[0].segments[0].departure.at.split("T")[1]}
  //                       </Typography>
  //                       <Typography variant="body1" sx={{ mb: 1 }}>
  //                         <FaPlaneArrival style={{ marginRight: 4 }} />
  //                         Arrival: {flight.itineraries[0].segments[0].arrival.at.split("T")[1]}
  //                       </Typography>
  //                       <Typography variant="body1" sx={{ mb: 1 }}>
  //                         <FaDollarSign style={{ marginRight: 4 }} />
  //                         Price: {flight.priceInZar} ZAR
  //                       </Typography>
  //                       <Typography variant="body2" sx={{ mb: 1 }}>
  //                         Cabin: {flight.travelerPricings[0].fareDetailsBySegment[0].cabin}
  //                       </Typography>
  //                       <Typography variant="body2" sx={{ mb: 2 }}>
  //                         Carrier: {flight.itineraries[0].segments[0].carrierCode}
  //                       </Typography>
  //                       <Button 
  //                         sx={{
  //                           backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? "purple" : "#1769aa",
  //                           color: "white",
  //                           '&:hover': {
  //                             backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? '#570987' : '#005f9e',
  //                           },
  //                           transition: 'background-color 0.3s ease',
  //                         }} 
  //                         variant="contained"
  //                       >   
  //                         {selectedFlights.some((f) => f.id === flight.id) ? "Remove from Itinerary" : "Add to Itinerary"}
  //                       </Button>
  //                     </CardContent>
  //                   </Card>
  //                 </Grid>
  //               ))
  //             ) : (
  //               <Typography>No flights found.</Typography>
  //             )}
  //             </Grid>
  
  //             {returnFlight && returnFlights.length > 0 && (
  //               <>
  //                 <h2>Return Flights</h2>
  //                 <Grid container spacing={2} sx={{ marginTop: "1rem", marginBottom: "15px" }}>
  //                 {returnFlights.map((flight, index) => (
  //                   <Grid item xs={12} sm={6} md={4} key={index}>
  //                     <Card onClick={() => handleFlightToggle(flight)} sx={{
  //                       boxShadow: selectedFlights.some((f) => f.id === flight.id) ? '0px 0px 15px 2px #570987' : '0px 0px 10px 1px #ccc',
  //                       border: selectedFlights.some((f) => f.id === flight.id) ? '2px solid #570987' : '1px solid #ddd',
  //                       transition: 'all 0.3s ease',
  //                     }}>
  //                       <CardContent>
  //                         <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
  //                           <FaPlaneArrival /> {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments[0].arrival.iataCode}
  //                         </Typography>
  //                         <Typography variant="body1" sx={{ mb: 1 }}>
  //                           <FaPlaneDeparture style={{ marginRight: 4 }} />
  //                           Departure: {flight.itineraries[0].segments[0].departure.at.split("T")[1]}
  //                         </Typography>
  //                         <Typography variant="body1" sx={{ mb: 1 }}>
  //                           <FaPlaneArrival style={{ marginRight: 4 }} />
  //                           Arrival: {flight.itineraries[0].segments[0].arrival.at.split("T")[1]}
  //                         </Typography>
  //                         <Typography variant="body1" sx={{ mb: 1 }}>
  //                           <FaDollarSign style={{ marginRight: 4 }} />
  //                           Price: {flight.priceInZar} ZAR
  //                         </Typography>
  //                         <Typography variant="body2" sx={{ mb: 1 }}>
  //                           Cabin: {flight.travelerPricings[0].fareDetailsBySegment[0].cabin}
  //                         </Typography>
  //                         <Typography variant="body2" sx={{ mb: 2 }}>
  //                           Carrier: {flight.itineraries[0].segments[0].carrierCode}
  //                         </Typography>
  //                         <Button 
  //                           sx={{
  //                             backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? "purple" : "#1769aa",
  //                             color: "white",
  //                             '&:hover': {
  //                               backgroundColor: selectedFlights.some((f) => f.id === flight.id) ? '#570987' : '#005f9e',
  //                             },
  //                             transition: 'background-color 0.3s ease',
  //                           }} 
  //                           variant="contained"
  //                         >   
  //                           {selectedFlights.some((f) => f.id === flight.id) ? "Remove from Itinerary" : "Add to Itinerary"}
  //                         </Button>
  //                       </CardContent>
  //                     </Card>
  //                   </Grid>
  //                 ))}
  //                 </Grid>
  //               </>
  //             )}
  //           </Grid>
  
  //           <Button marginTop="50px" padding="20px" variant="outlined" onClick={() => setShowFlightSearch(false)}>
  //             Done
  //           </Button>
  //         </>
  //       )}
  
  //       <h2 style={{marginTop: "50px"}}>Selected Flights</h2>
  //       <Grid container spacing={2}>
  //         {selectedFlights.map((flight, index) => (
  //           <Grid item xs={12} sm={6} md={4} key={index}>
  //             <Card>
  //               <CardContent>
  //                 <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
  //                   <FaPlaneDeparture /> {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments[0].arrival.iataCode}
  //                 </Typography>
  //                 <Typography variant="body1">
  //                   Price: {flight.priceInZar} ZAR
  //                 </Typography>
  //               </CardContent>
  //             </Card>
  //           </Grid>
  //         ))}
  //       </Grid>
  //     </Box>
  //   </Box>
  // );


