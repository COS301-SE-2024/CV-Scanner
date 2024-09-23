// import React from "react";
// import {
//   Box,
//   Typography,
//   Container,
//   Paper,
//   Grid,
//   CircularProgress,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import Sidebar from "./sidebar";
//  import "./dashboard.css";

// const Dashboard = ({ itinerary, generateItinerary }) => {
//   const theme = useTheme();
//   const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
//   const isDarkMode = theme.palette.mode === 'dark';

//   return (
    
//     <Box display="flex" >
//       <Drawer
//         variant={isSmUp ? "permanent" : "temporary"}
//         open={true}
//         sx={{
//           "& .MuiDrawer-paper": {
//             boxSizing: "border-box",
//             width: 240,
//           },
//         }}
//       >
//         <Sidebar />
//       </Drawer>
//       <Box
//         flexGrow={1}
//         p={3}
//         //  bgcolor="background.default"
        
//         sx={{ 
//           ml: isSmUp ? "240px" : "0",
//           //bgcolor: isDarkMode ? '#0000007a ' : '#ffffff'
//          }}
//       >
//         <Container maxWidth="lg">
//           {/* <<Typography variant="h4" color="primary" gutterBottom>
//             Analytics Dashboard
//           </Typography> */}
//           <h1>Analytics Dashboard</h1>
//           {/* <Typography variant="body1" paragraph>
//             Welcome to your analytics dashboard. Here you can view insights
//             about user activity and trip creation.
//           </Typography> */}
//           <p>Welcome to your analytics dashboard. Here you can view insights
//           about user activity and trip creation.</p>
//           <Typography variant="h5" color="textSecondary" gutterBottom>
//             Analytics
//           </Typography>

//           <Grid container spacing={3}>
//             {/* Placeholder for an Analytics Component 1 */}
//             <Grid item xs={12} md={6}>
//               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#424242 ' : '#ffffff'}}>
//                 <Typography variant="h6" gutterBottom>
//                   Travel Trends
//                 </Typography>
//                 <Box
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                   height="150px"
//                 >
//                   <CircularProgress />
//                 </Box>
//                 <Typography
//                   variant="body2"
//                   color="textSecondary"
//                   align="center"
//                 >
//                   Loading travel trends data...
//                 </Typography>
//               </Paper>
//             </Grid>

//             {/* Placeholder for an Analytics Component 2 */}
//             <Grid item xs={12} md={6}>
//               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#424242 ' : '#ffffff' }}>
//                 <Typography variant="h6" gutterBottom>
//                   Popular Destinations
//                 </Typography>
//                 <Box
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                   height="150px"
//                 >
//                   <CircularProgress />
//                 </Box>
//                 <Typography
//                   variant="body2"
//                   color="textSecondary"
//                   align="center"
//                 >
//                   Loading popular destinations data...
//                 </Typography>
//               </Paper>
//             </Grid>

//             {/* Placeholder for an Analytics Component 3 */}
//             <Grid item xs={12}>
//               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#424242 ' : '#ffffff' }}>
//                 <Typography variant="h6" gutterBottom>
//                   User Activity
//                 </Typography>
//                 <Box
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                   height="150px"
//                 >
//                   <CircularProgress />
//                 </Box>
//                 <Typography
//                   variant="body2"
//                   color="textSecondary"
//                   align="center"
//                 >
//                   Loading user activity data...
//                 </Typography>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>
//     </Box>
    
//   );
// };

// export default Dashboard;

// // // import React, { useState } from "react";
// // // // import { FaPaperPlane } from "react-icons/fa";
// // // // import { Card, CardContent, Typography, Button, Box } from "@mui/material";
// // // // import Sidebar from "./sidebar";
// // // // // import "./dashboard.css";

// // // // const Dashboard = () => {
// // // //   const [userInput, setUserInput] = useState("");
// // // //   const [responses, setResponses] = useState([]);
// // // //   const [showCards, setShowCards] = useState(true);

// // // //   const handleInputChange = (e) => {
// // // //     setUserInput(e.target.value);
// // // //     if (e.target.value.trim() !== "") {
// // // //       setShowCards(false);
// // // //     }
// // // //   };

// // // //   const handleSubmit = async () => {
// // // //     if (userInput.trim() === "") return;

// // // //     // Add user's input to the responses state
// // // //     const newMessage = { type: "user", text: userInput };
// // // //     setResponses([...responses, newMessage]);

// // // //     try {
// // // //       // Create an array of messages from the current responses state
// // // //       const messages = [
// // // //         {
// // // //           role: "system",
// // // //           content: "You are a helpful trip advisor AI. Remember the user's preferences, and avoid asking repetitive questions. When giving itineraries, make sure to personalize based on the given preferences, such as group size, budget, and specific interests."
// // // //         },
// // // //         ...responses.map((response) => ({
// // // //           role: response.type === "user" ? "user" : "assistant",
// // // //           content: response.text
// // // //         })),
// // // //         { role: "user", content: userInput }
// // // //       ];

// // // //       // Interact with OpenAI GPT-4 model
// // // //       const response = await openai.chat.completions.create({
// // // //         model: "gpt-4",
// // // //         messages: messages,
// // // //         max_tokens: 1000
// // // //       });

// // // //       const botMessage = response.choices[0].message.content;

// // // //       // Add the AI response to the responses state
// // // //       setResponses((prevResponses) => [
// // // //         ...prevResponses,
// // // //         { type: "bot", text: botMessage }
// // // //       ]);
// // // //     } catch (error) {
// // // //       console.error("Error communicating with the OpenAI API:", error);
// // // //       setResponses((prevResponses) => [
// // // //         ...prevResponses,
// // // //         { type: "bot", text: "Sorry, there was an error processing your request." }
// // // //       ]);
// // // //     }

// // // //     setUserInput("");
// // // //   };

// // // //   return (
// // // //     <Box style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
// // // //       <Sidebar
// // // //         style={{
// // // //           flex: "0 0 250px",
// // // //           position: "fixed",
// // // //           height: "100%",
// // // //           borderRight: "1px solid #ddd",
// // // //         }}
// // // //       >
// // // //       <Sidebar />
// // // //       {/* </Drawer> */}
// // // //       <Box
// // // //         flexGrow={1}
// // // //         p={3}
// // // //         //  bgcolor="background.default"
        
// // // //         sx={{ 
// // // //           ml: isSmUp ? "240px" : "0",
// // // //           bgcolor: isDarkMode ? '#0000007a ' : '#ffffff'
// // // //          }}
// // // //       >
// // // //         <Container maxWidth="lg">
// // // //           {/* <<Typography variant="h4" color="primary" gutterBottom>
// // // //             Analytics Dashboard
// // // //           </Typography> */}
// // // //           <h1>Analytics Dashboard</h1>
// // // //           {/* <Typography variant="body1" paragraph>
// // // //             Welcome to your analytics dashboard. Here you can view insights
// // // //             about user activity and trip creation.
// // // //           </Typography> */}
// // // //           <p>Welcome to your analytics dashboard. Here you can view insights
// // // //           about user activity and trip creation.</p>
// // // //           <Typography variant="h5" color="textSecondary" gutterBottom>
// // // //             Analytics
// // // //           </Typography>

// // // //           <Grid container spacing={3}>
// // // //             {/* Placeholder for an Analytics Component 1 */}
// // // //             <Grid item xs={12} md={6}>
// // // //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff'}}>
// // // //                 <Typography variant="h6" gutterBottom>
// // // //                   Travel Trends
// // // //                 </Typography>
// // // //                 <Box
// // // //                   display="flex"
// // // //                   justifyContent="center"
// // // //                   alignItems="center"
// // // //                   height="150px"
// // // //                 >
// // // //                   <CircularProgress />
// // // //                 </Box>
// // // //                 <Typography
// // // //                   variant="body2"
// // // //                   color="textSecondary"
// // // //                   align="center"
// // // //                 >
// // // //                   Loading travel trends data...
// // // //                 </Typography>
// // // //               </Paper>
// // // //             </Grid>

// // // //             {/* Placeholder for an Analytics Component 2 */}
// // // //             <Grid item xs={12} md={6}>
// // // //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff' }}>
// // // //                 <Typography variant="h6" gutterBottom>
// // // //                   Popular Destinations
// // // //                 </Typography>
// // // //                 <Box
// // // //                   display="flex"
// // // //                   justifyContent="center"
// // // //                   alignItems="center"
// // // //                   height="150px"
// // // //                 >
// // // //                   <CircularProgress />
// // // //                 </Box>
// // // //                 <Typography
// // // //                   variant="body2"
// // // //                   color="textSecondary"
// // // //                   align="center"
// // // //                 >
// // // //                   Loading popular destinations data...
// // // //                 </Typography>
// // // //               </Paper>
// // // //             </Grid>

// // // //             {/* Placeholder for an Analytics Component 3 */}
// // // //             <Grid item xs={12}>
// // // //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff' }}>
// // // //                 <Typography variant="h6" gutterBottom>
// // // //                   User Activity
// // // //                 </Typography>
// // // //                 <Box
// // // //                   display="flex"
// // // //                   justifyContent="center"
// // // //                   alignItems="center"
// // // //                   height="150px"
// // // //                 >
// // // //                   <CircularProgress />
// // // //                 </Box>
// // // //                 <Typography
// // // //                   variant="body2"
// // // //                   color="textSecondary"
// // // //                   align="center"
// // // //                 >
// // // //                   Loading user activity data...
// // // //                 </Typography>
// // // //               </Paper>
// // // //             </Grid>
// // // //           </Grid>
// // // //         </Container>
// // // //       </Box>
// // // //     </Box>
    
// // // //   );
// // // // };

// // // // export default Dashboard;

// // // import React, { useState } from "react";
// // // import { FaPaperPlane } from "react-icons/fa";
// // // import { Card, CardContent, Typography, Button, Box, Container, Grid, Paper, CircularProgress } from "@mui/material";
// // // import Sidebar from "./sidebar";
// // // // import "./dashboard.css";

// // // const Dashboard = () => {
// // //   const [userInput, setUserInput] = useState("");
// // //   const [responses, setResponses] = useState([]);
// // //   const [showCards, setShowCards] = useState(true);

// // //   const handleInputChange = (e) => {
// // //     setUserInput(e.target.value);
// // //     if (e.target.value.trim() !== "") {
// // //       setShowCards(false);
// // //     }
// // //   };

// // //   const handleSubmit = async () => {
// // //     if (userInput.trim() === "") return;

// // //     // Add user's input to the responses state
// // //     const newMessage = { type: "user", text: userInput };
// // //     setResponses([...responses, newMessage]);

// // //     try {
// // //       // Create an array of messages from the current responses state
// // //       const messages = [
// // //         {
// // //           role: "system",
// // //           content: "You are a helpful trip advisor AI. Remember the user's preferences, and avoid asking repetitive questions. When giving itineraries, make sure to personalize based on the given preferences, such as group size, budget, and specific interests."
// // //         },
// // //         ...responses.map((response) => ({
// // //           role: response.type === "user" ? "user" : "assistant",
// // //           content: response.text
// // //         })),
// // //         { role: "user", content: userInput }
// // //       ];

// // //       // Interact with OpenAI GPT-4 model
// // //       const response = await openai.chat.completions.create({
// // //         model: "gpt-4",
// // //         messages: messages,
// // //         max_tokens: 1000
// // //       });

// // //       const botMessage = response.choices[0].message.content;

// // //       // Add the AI response to the responses state
// // //       setResponses((prevResponses) => [
// // //         ...prevResponses,
// // //         { type: "bot", text: botMessage }
// // //       ]);
// // //     } catch (error) {
// // //       console.error("Error communicating with the OpenAI API:", error);
// // //       setResponses((prevResponses) => [
// // //         ...prevResponses,
// // //         { type: "bot", text: "Sorry, there was an error processing your request." }
// // //       ]);
// // //     }

// // //     setUserInput("");
// // //   };

// // //   // Define isSmUp and isDarkMode variables
// // //   const isSmUp = true; // Example value, replace with actual logic
// // //   const isDarkMode = false; // Example value, replace with actual logic

// // //   return (
// // //     <Box style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
// // //       <Sidebar
// // //         style={{
// // //           flex: "0 0 250px",
// // //           position: "fixed",
// // //           height: "100%",
// // //           borderRight: "1px solid #ddd",
// // //         }}
// // //       />
// // //       <Box
// // //         flexGrow={1}
// // //         p={3}
// // //         sx={{ 
// // //           ml: isSmUp ? "240px" : "0",
// // //           bgcolor: isDarkMode ? '#0000007a ' : '#ffffff'
// // //          }}
// // //       >
// // //         <Container maxWidth="lg">
// // //           <h1>Analytics Dashboard</h1>
// // //           <p>Welcome to your analytics dashboard. Here you can view insights
// // //           about user activity and trip creation.</p>
// // //           <Typography variant="h5" color="textSecondary" gutterBottom>
// // //             Analytics
// // //           </Typography>

// // //           <Grid container spacing={3}>
// // //             {/* Placeholder for an Analytics Component 1 */}
// // //             <Grid item xs={12} md={6}>
// // //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff'}}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   Travel Trends
// // //                 </Typography>
// // //                 <Box
// // //                   display="flex"
// // //                   justifyContent="center"
// // //                   alignItems="center"
// // //                   height="150px"
// // //                 >
// // //                   <CircularProgress />
// // //                 </Box>
// // //                 <Typography
// // //                   variant="body2"
// // //                   color="textSecondary"
// // //                   align="center"
// // //                 >
// // //                   Loading travel trends data...
// // //                 </Typography>
// // //               </Paper>
// // //             </Grid>

// // //             {/* Placeholder for an Analytics Component 2 */}
// // //             <Grid item xs={12} md={6}>
// // //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff' }}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   Popular Destinations
// // //                 </Typography>
// // //                 <Box
// // //                   display="flex"
// // //                   justifyContent="center"
// // //                   alignItems="center"
// // //                   height="150px"
// // //                 >
// // //                   <CircularProgress />
// // //                 </Box>
// // //                 <Typography
// // //                   variant="body2"
// // //                   color="textSecondary"
// // //                   align="center"
// // //                 >
// // //                   Loading popular destinations data...
// // //                 </Typography>
// // //               </Paper>
// // //             </Grid>

// // //             {/* Placeholder for an Analytics Component 3 */}
// // //             <Grid item xs={12}>
// // //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff' }}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   User Activity
// // //                 </Typography>
// // //                 <Box
// // //                   display="flex"
// // //                   justifyContent="center"
// // //                   alignItems="center"
// // //                   height="150px"
// // //                 >
// // //                   <CircularProgress />
// // //                 </Box>
// // //                 <Typography
// // //                   variant="body2"
// // //                   color="textSecondary"
// // //                   align="center"
// // //                 >
// // //                   Loading user activity data...
// // //                 </Typography>
// // //               </Paper>
// // //             </Grid>
// // //           </Grid>
// // //         </Container>
// // //       </Box>
// // //     </Box>
// // //   );
// // // };

// // // export default Dashboard;

// /* FINAL DASHBOARD WITH AI CHATBOT */
// // import React, { useState } from "react";
// // import { FaPaperPlane } from "react-icons/fa";
// // import { Card, CardContent, Typography, Button, Box } from "@mui/material";
// // import Sidebar from "./sidebar";
// // import OpenAI from 'openai';
// // import ReactMarkdown from 'react-markdown';
// // import remarkGfm from 'remark-gfm';


// // // Initialize the OpenAI client
// // const openai = new OpenAI({
// //   apiKey: process.env.REACT_APP_OPEN_AI_KEY,
// //   dangerouslyAllowBrowser: true
// // });

// // const Dashboard = () => {
// //   const [userInput, setUserInput] = useState("");
// //   const [responses, setResponses] = useState([]);
// //   const [showCards, setShowCards] = useState(true);

// //   const handleInputChange = (e) => {
// //     setUserInput(e.target.value);
// //     if (e.target.value.trim() !== "") {
// //       setShowCards(false);
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     if (userInput.trim() === "") return;

// //     // Add user's input to the responses state
// //     const newMessage = { type: "user", text: userInput };
// //     setResponses([...responses, newMessage]);

// //     try {
// //       // Create an array of messages from the current responses state
// //       const messages = [
// //         {
// //           role: "system",
// //           content: "You are a helpful trip advisor AI. Remember the user's preferences, and avoid asking repetitive questions. When giving itineraries, make sure to personalize based on the given preferences, such as group size, budget, and specific interests."
// //         },
// //         ...responses.map((response) => ({
// //           role: response.type === "user" ? "user" : "assistant",
// //           content: response.text
// //         })),
// //         { role: "user", content: userInput }
// //       ];

// //       // Interact with OpenAI GPT-4 model
// //       const response = await openai.chat.completions.create({
// //         model: "gpt-4",
// //         messages: messages,
// //         max_tokens: 1000
// //       });

// //       const botMessage = response.choices[0].message.content;

// //       // Add the AI response to the responses state
// //       setResponses((prevResponses) => [
// //         ...prevResponses,
// //         { type: "bot", text: botMessage }
// //       ]);
// //     } catch (error) {
// //       console.error("Error communicating with the OpenAI API:", error);
// //       setResponses((prevResponses) => [
// //         ...prevResponses,
// //         { type: "bot", text: "Sorry, there was an error processing your request." }
// //       ]);
// //     }

// //     setUserInput("");
// //   };

// //   return (
// //     <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
// //       <Sidebar
// //         style={{
// //           flex: "0 0 250px",
// //           position: "fixed",
// //           height: "100%",
// //           borderRight: "1px solid #ddd",
// //         }}
// //       />

// //       <div
// //         style={{
// //           marginLeft: "250px",
// //           flex: "1",
// //           display: "flex",
// //           flexDirection: "column",
// //         }}
// //       >
// //         {showCards && (
// //           <Box
// //             sx={{
// //               padding: 2,
// //               borderBottom: "1px solid #ddd",
// //               backgroundColor: "#f7f7f7",
// //             }}
// //           >
// //             <Typography variant="h3" gutterBottom>
// //               AI Trip Planning
// //             </Typography>
// //             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
// //               <Card sx={{ minWidth: 150, backgroundColor: "#e1f5fe" }}>
// //                 <CardContent sx={{ padding: 1 }}>
// //                   <Typography variant="body2" sx={{ margin: 0 }}>
// //                     Chat with the AI to plan your trip.
// //                   </Typography>
// //                   <Typography variant="body2" sx={{ margin: 0 }}>
// //                     Example Input: "What are some activities to do in Cape Town?"
// //                   </Typography>
// //                 </CardContent>
// //               </Card>
// //               <Card sx={{ minWidth: 150, backgroundColor: "#fff3e0" }}>
// //                 <CardContent sx={{ padding: 2 }}>
// //                   <Typography variant="body2" sx={{ margin: 0 }}>
// //                     Ask any questions related to your trip.
// //                   </Typography>
// //                   <Typography variant="body2" sx={{ margin: 0 }}>
// //                     Example Input: "Find me a hotel in Durban."
// //                   </Typography>
// //                 </CardContent>
// //               </Card>
// //             </Box>
// //           </Box>
// //         )}

// //         <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
// //           {responses.map((response, index) => (
// //             <Box
// //               key={index}
// //               sx={{
// //                 textAlign: response.type === "user" ? "right" : "left",
// //                 backgroundColor:
// //                   response.type === "user" ? "#e0f7fa" : "#f1f8e9",
// //                 margin: 1,
// //                 padding: 1,
// //                 borderRadius: 1,
// //                 maxWidth: "70%",
// //                 display: "inline-block",
// //                 wordWrap: "break-word",
// //                 alignSelf: response.type === "user" ? "flex-end" : "flex-start",
// //               }}
// //             >
// //               {response.type === "user" ? (
// //                 response.text
// //               ) : (
// //                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
// //                   {response.text}
// //                 </ReactMarkdown>
// //               )}
// //             </Box>
// //           ))}
// //         </Box>

// //         <Box
// //           sx={{
// //             display: "flex",
// //             alignItems: "center",
// //             borderTop: "1px solid #ddd",
// //             padding: 1,
// //             position: "relative",
// //           }}
// //         >
// //           <input
// //             type="text"
// //             value={userInput}
// //             onChange={handleInputChange}
// //             placeholder="Ask me about your trip..."
// //             style={{
// //               flex: "1",
// //               padding: "10px",
// //               marginRight: "10px",
// //               borderRadius: "5px",
// //               border: "1px solid #ddd",
// //               maxWidth: "calc(100% - 60px)",
// //             }}
// //           />
// //           <Button
// //             onClick={handleSubmit}
// //             sx={{
// //               backgroundColor: "#007bff",
// //               color: "white",
// //               borderRadius: "5px",
// //               padding: "10px",
// //               minWidth: "40px",
// //               "&:hover": { backgroundColor: "#0056b3" },
// //             }}
// //           >
// //             <FaPaperPlane />
// //           </Button>
// //         </Box>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;

// // import React, { useState } from "react";
// // // import { FaPaperPlane } from "react-icons/fa";
// // // import { Card, CardContent, Typography, Button, Box } from "@mui/material";
// // // import Sidebar from "./sidebar";
// // // // import "./dashboard.css";

// // // const Dashboard = () => {
// // //   const [userInput, setUserInput] = useState("");
// // //   const [responses, setResponses] = useState([]);
// // //   const [showCards, setShowCards] = useState(true);

// // //   const handleInputChange = (e) => {
// // //     setUserInput(e.target.value);
// // //     if (e.target.value.trim() !== "") {
// // //       setShowCards(false);
// // //     }
// // //   };

// // //   const handleSubmit = async () => {
// // //     if (userInput.trim() === "") return;

// // //     // Add user's input to the responses state
// // //     const newMessage = { type: "user", text: userInput };
// // //     setResponses([...responses, newMessage]);

// // //     try {
// // //       // Create an array of messages from the current responses state
// // //       const messages = [
// // //         {
// // //           role: "system",
// // //           content: "You are a helpful trip advisor AI. Remember the user's preferences, and avoid asking repetitive questions. When giving itineraries, make sure to personalize based on the given preferences, such as group size, budget, and specific interests."
// // //         },
// // //         ...responses.map((response) => ({
// // //           role: response.type === "user" ? "user" : "assistant",
// // //           content: response.text
// // //         })),
// // //         { role: "user", content: userInput }
// // //       ];

// // //       // Interact with OpenAI GPT-4 model
// // //       const response = await openai.chat.completions.create({
// // //         model: "gpt-4",
// // //         messages: messages,
// // //         max_tokens: 1000
// // //       });

// // //       const botMessage = response.choices[0].message.content;

// // //       // Add the AI response to the responses state
// // //       setResponses((prevResponses) => [
// // //         ...prevResponses,
// // //         { type: "bot", text: botMessage }
// // //       ]);
// // //     } catch (error) {
// // //       console.error("Error communicating with the OpenAI API:", error);
// // //       setResponses((prevResponses) => [
// // //         ...prevResponses,
// // //         { type: "bot", text: "Sorry, there was an error processing your request." }
// // //       ]);
// // //     }

// // //     setUserInput("");
// // //   };

// // //   return (
// // //     <Box style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
// // //       <Sidebar
// // //         style={{
// // //           flex: "0 0 250px",
// // //           position: "fixed",
// // //           height: "100%",
// // //           borderRight: "1px solid #ddd",
// // //         }}
// // //       >
// // //       <Sidebar />
// // //       {/* </Drawer> */}
// // //       <Box
// // //         flexGrow={1}
// // //         p={3}
// // //         //  bgcolor="background.default"
        
// // //         sx={{ 
// // //           ml: isSmUp ? "240px" : "0",
// // //           bgcolor: isDarkMode ? '#0000007a ' : '#ffffff'
// // //          }}
// // //       >
// // //         <Container maxWidth="lg">
// // //           {/* <<Typography variant="h4" color="primary" gutterBottom>
// // //             Analytics Dashboard
// // //           </Typography> */}
// // //           <h1>Analytics Dashboard</h1>
// // //           {/* <Typography variant="body1" paragraph>
// // //             Welcome to your analytics dashboard. Here you can view insights
// // //             about user activity and trip creation.
// // //           </Typography> */}
// // //           <p>Welcome to your analytics dashboard. Here you can view insights
// // //           about user activity and trip creation.</p>
// // //           <Typography variant="h5" color="textSecondary" gutterBottom>
// // //             Analytics
// // //           </Typography>

// // //           <Grid container spacing={3}>
// // //             {/* Placeholder for an Analytics Component 1 */}
// // //             <Grid item xs={12} md={6}>
// // //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff'}}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   Travel Trends
// // //                 </Typography>
// // //                 <Box
// // //                   display="flex"
// // //                   justifyContent="center"
// // //                   alignItems="center"
// // //                   height="150px"
// // //                 >
// // //                   <CircularProgress />
// // //                 </Box>
// // //                 <Typography
// // //                   variant="body2"
// // //                   color="textSecondary"
// // //                   align="center"
// // //                 >
// // //                   Loading travel trends data...
// // //                 </Typography>
// // //               </Paper>
// // //             </Grid>

// // //             {/* Placeholder for an Analytics Component 2 */}
// // //             <Grid item xs={12} md={6}>
// // //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff' }}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   Popular Destinations
// // //                 </Typography>
// // //                 <Box
// // //                   display="flex"
// // //                   justifyContent="center"
// // //                   alignItems="center"
// // //                   height="150px"
// // //                 >
// // //                   <CircularProgress />
// // //                 </Box>
// // //                 <Typography
// // //                   variant="body2"
// // //                   color="textSecondary"
// // //                   align="center"
// // //                 >
// // //                   Loading popular destinations data...
// // //                 </Typography>
// // //               </Paper>
// // //             </Grid>

// // //             {/* Placeholder for an Analytics Component 3 */}
// // //             <Grid item xs={12}>
// // //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff' }}>
// // //                 <Typography variant="h6" gutterBottom>
// // //                   User Activity
// // //                 </Typography>
// // //                 <Box
// // //                   display="flex"
// // //                   justifyContent="center"
// // //                   alignItems="center"
// // //                   height="150px"
// // //                 >
// // //                   <CircularProgress />
// // //                 </Box>
// // //                 <Typography
// // //                   variant="body2"
// // //                   color="textSecondary"
// // //                   align="center"
// // //                 >
// // //                   Loading user activity data...
// // //                 </Typography>
// // //               </Paper>
// // //             </Grid>
// // //           </Grid>
// // //         </Container>
// // //       </Box>
// // //     </Box>
    
// // //   );
// // // };

// // // export default Dashboard;

// // import React, { useState } from "react";
// // import { FaPaperPlane } from "react-icons/fa";
// // import { Card, CardContent, Typography, Button, Box, Container, Grid, Paper, CircularProgress } from "@mui/material";
// // import Sidebar from "./sidebar";
// // // import "./dashboard.css";

// // const Dashboard = () => {
// //   const [userInput, setUserInput] = useState("");
// //   const [responses, setResponses] = useState([]);
// //   const [showCards, setShowCards] = useState(true);

// //   const handleInputChange = (e) => {
// //     setUserInput(e.target.value);
// //     if (e.target.value.trim() !== "") {
// //       setShowCards(false);
// //     }
// //   };

// //   const handleSubmit = async () => {
// //     if (userInput.trim() === "") return;

// //     // Add user's input to the responses state
// //     const newMessage = { type: "user", text: userInput };
// //     setResponses([...responses, newMessage]);

// //     try {
// //       // Create an array of messages from the current responses state
// //       const messages = [
// //         {
// //           role: "system",
// //           content: "You are a helpful trip advisor AI. Remember the user's preferences, and avoid asking repetitive questions. When giving itineraries, make sure to personalize based on the given preferences, such as group size, budget, and specific interests."
// //         },
// //         ...responses.map((response) => ({
// //           role: response.type === "user" ? "user" : "assistant",
// //           content: response.text
// //         })),
// //         { role: "user", content: userInput }
// //       ];

// //       // Interact with OpenAI GPT-4 model
// //       const response = await openai.chat.completions.create({
// //         model: "gpt-4",
// //         messages: messages,
// //         max_tokens: 1000
// //       });

// //       const botMessage = response.choices[0].message.content;

// //       // Add the AI response to the responses state
// //       setResponses((prevResponses) => [
// //         ...prevResponses,
// //         { type: "bot", text: botMessage }
// //       ]);
// //     } catch (error) {
// //       console.error("Error communicating with the OpenAI API:", error);
// //       setResponses((prevResponses) => [
// //         ...prevResponses,
// //         { type: "bot", text: "Sorry, there was an error processing your request." }
// //       ]);
// //     }

// //     setUserInput("");
// //   };

// //   // Define isSmUp and isDarkMode variables
// //   const isSmUp = true; // Example value, replace with actual logic
// //   const isDarkMode = false; // Example value, replace with actual logic

// //   return (
// //     <Box style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
// //       <Sidebar
// //         style={{
// //           flex: "0 0 250px",
// //           position: "fixed",
// //           height: "100%",
// //           borderRight: "1px solid #ddd",
// //         }}
// //       />
// //       <Box
// //         flexGrow={1}
// //         p={3}
// //         sx={{ 
// //           ml: isSmUp ? "240px" : "0",
// //           bgcolor: isDarkMode ? '#0000007a ' : '#ffffff'
// //          }}
// //       >
// //         <Container maxWidth="lg">
// //           <h1>Analytics Dashboard</h1>
// //           <p>Welcome to your analytics dashboard. Here you can view insights
// //           about user activity and trip creation.</p>
// //           <Typography variant="h5" color="textSecondary" gutterBottom>
// //             Analytics
// //           </Typography>

// //           <Grid container spacing={3}>
// //             {/* Placeholder for an Analytics Component 1 */}
// //             <Grid item xs={12} md={6}>
// //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff'}}>
// //                 <Typography variant="h6" gutterBottom>
// //                   Travel Trends
// //                 </Typography>
// //                 <Box
// //                   display="flex"
// //                   justifyContent="center"
// //                   alignItems="center"
// //                   height="150px"
// //                 >
// //                   <CircularProgress />
// //                 </Box>
// //                 <Typography
// //                   variant="body2"
// //                   color="textSecondary"
// //                   align="center"
// //                 >
// //                   Loading travel trends data...
// //                 </Typography>
// //               </Paper>
// //             </Grid>

// //             {/* Placeholder for an Analytics Component 2 */}
// //             <Grid item xs={12} md={6}>
// //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff' }}>
// //                 <Typography variant="h6" gutterBottom>
// //                   Popular Destinations
// //                 </Typography>
// //                 <Box
// //                   display="flex"
// //                   justifyContent="center"
// //                   alignItems="center"
// //                   height="150px"
// //                 >
// //                   <CircularProgress />
// //                 </Box>
// //                 <Typography
// //                   variant="body2"
// //                   color="textSecondary"
// //                   align="center"
// //                 >
// //                   Loading popular destinations data...
// //                 </Typography>
// //               </Paper>
// //             </Grid>

// //             {/* Placeholder for an Analytics Component 3 */}
// //             <Grid item xs={12}>
// //               <Paper elevation={3} sx={{ p: 2, bgcolor: isDarkMode ? '#7d7f7c ' : '#ffffff' }}>
// //                 <Typography variant="h6" gutterBottom>
// //                   User Activity
// //                 </Typography>
// //                 <Box
// //                   display="flex"
// //                   justifyContent="center"
// //                   alignItems="center"
// //                   height="150px"
// //                 >
// //                   <CircularProgress />
// //                 </Box>
// //                 <Typography
// //                   variant="body2"
// //                   color="textSecondary"
// //                   align="center"
// //                 >
// //                   Loading user activity data...
// //                 </Typography>
// //               </Paper>
// //             </Grid>
// //           </Grid>
// //         </Container>
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default Dashboard;

import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import Sidebar from "./sidebar";
import OpenAI from 'openai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPEN_AI_KEY,
  dangerouslyAllowBrowser: true
});

const Dashboard = () => {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [showCards, setShowCards] = useState(true);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (e.target.value.trim() !== "") {
      setShowCards(false);
    }
  };

  const handleSubmit = async () => {
    if (userInput.trim() === "") return;

    // Add user's input to the responses state
    const newMessage = { type: "user", text: userInput };
    setResponses([...responses, newMessage]);

    try {
      // Create an array of messages from the current responses state
      const messages = [
        {
          role: "system",
          content: "You are a helpful trip advisor AI. Remember the user's preferences, and avoid asking repetitive questions. When giving itineraries, make sure to personalize based on the given preferences, such as group size, budget, and specific interests."
        },
        ...responses.map((response) => ({
          role: response.type === "user" ? "user" : "assistant",
          content: response.text
        })),
        { role: "user", content: userInput }
      ];

      // Interact with OpenAI GPT-4 model
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        max_tokens: 1000
      });

      const botMessage = response.choices[0].message.content;

      // Add the AI response to the responses state
      setResponses((prevResponses) => [
        ...prevResponses,
        { type: "bot", text: botMessage }
      ]);
    } catch (error) {
      console.error("Error communicating with the OpenAI API:", error);
      setResponses((prevResponses) => [
        ...prevResponses,
        { type: "bot", text: "Sorry, there was an error processing your request." }
      ]);
    }

    setUserInput("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      
      <Sidebar
        style={{
          flex: "0 0 250px",
          position: "fixed",
          height: "100%",
          borderRight: "1px solid #ddd",
        }}
      />
      
      <div
        style={{
          marginLeft: "250px",
          flex: "1",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{marginLeft: "28px", marginTop: "30px"}}>AI Trip Planning</h1>
        {showCards && (
          <Box
            sx={{
              padding: 2,
              borderBottom: "1px solid #ddd",
              backgroundColor: "#f7f7f7",
            }}
          >
            {/* <Typography variant="h3" gutterBottom>
              AI Trip Planning
            </Typography> */}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Card sx={{ minWidth: 150, backgroundColor: "#e1f5fe" }}>
                <CardContent sx={{ padding: 1 }}>
                  <Typography variant="body2" sx={{ margin: 0 }}>
                    Chat with the AI to plan your trip.
                  </Typography>
                  <Typography variant="body2" sx={{ margin: 0 }}>
                    Example Input: "What are some activities to do in Cape Town?"
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: 150, backgroundColor: "#fff3e0" }}>
                <CardContent sx={{ padding: 2 }}>
                  <Typography variant="body2" sx={{ margin: 0 }}>
                    Ask any questions related to your trip.
                  </Typography>
                  <Typography variant="body2" sx={{ margin: 0 }}>
                    Example Input: "Find me a hotel in Durban."
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
          {responses.map((response, index) => (
            <Box
              key={index}
              sx={{
                textAlign: response.type === "user" ? "right" : "left",
                backgroundColor:
                  response.type === "user" ? "#e0f7fa" : "#f1f8e9",
                margin: 1,
                padding: 1,
                borderRadius: 1,
                maxWidth: "70%",
                display: "inline-block",
                wordWrap: "break-word",
                alignSelf: response.type === "user" ? "flex-end" : "flex-start",
              }}
            >
              {response.type === "user" ? (
                response.text
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response.text}
                </ReactMarkdown>
              )}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #ddd",
            padding: 1,
            position: "relative",
          }}
        >
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Ask me about your trip..."
            style={{
              flex: "1",
              padding: "10px",
              marginRight: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              maxWidth: "calc(100% - 60px)",
            }}
          />
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "5px",
              padding: "10px",
              minWidth: "40px",
              "&:hover": { backgroundColor: "#0056b3" },
            }}
          >
            <FaPaperPlane />
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;