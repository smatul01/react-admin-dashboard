import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import React, { useState, useEffect, useRef} from "react";
import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
//{"gameId":"game-2957FB14-2939-4A7C-BC54-331D65EE7D58","away":0,"home":5,"awayOdds":-34567,"homeOdds":3456,"date":1667775470}
const Football = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [bids, setBids] = useState({"game-2957FB14-2939-4A7C-BC54-331D65EE7D58": {"id": "123", "gameId": 'game-2957FB14-2939-4A7C-BC54-331D65EE7D58', away: -2, home: 1, awayOdds: -232, homeOdds: 223, away : -2, awayOdds : -232, date : 1667782930}});
//   const [count, setCount] = useState(0);
  const ws = useRef(null);


  useEffect(() => {

    axios.get(`https://3l339humd5.execute-api.us-east-1.amazonaws.com/prod/feeds?game=game-nfl`)
    .then(res => {
      // console.log("data")
      // console.log(res)
      const data = res.data
    const parsed = JSON.parse(data.Data)

    console.log(parsed)
    })



    ws.current = new WebSocket(`wss://86k7zlg8nd.execute-api.us-east-1.amazonaws.com/prod?client=${ uuidv4()}`);



   ws.current.onopen = () => console.log("ws opened");
   ws.current.onclose = () => console.log("ws closed");
   const wsCurrent = ws.current;

        return () => {
            wsCurrent.close();
        };
    },[]);

  useEffect(() => {
    if (!ws.current) return;
      ws.current.onmessage  = function (event) {

    const json = JSON.parse(event.data);
    console.log(json)
    try {
      if ((json.event = "data")) {
        const newTodos = Object.assign({}, bids);
        let gamid = json.gameId
        console.log(json)
        newTodos[json.gameId] = json
        setBids( prevConnections => ({
          ...prevConnections,
         ...newTodos
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

      },[bids])



  const columns = [
    { field: "gameId", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "away",
      headerName: "Away",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
        field: "awayOdds",
        headerName: "Away Odss",
        type: "number",
        headerAlign: "left",
        align: "left",
      },
    {
        field: "home",
        headerName: "Home",
        type: "number",
        headerAlign: "left",
        align: "left",
      },
      {
        field: "homeOdds",
        headerName: "Home Odss",
        type: "number",
        headerAlign: "left",
        align: "left",
      },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 2,
    }
    // {
    //   field: "email",
    //   headerName: "Email",
    //   flex: 1,
    // },
    // {
    //   field: "accessLevel",
    //   headerName: "Access Level",
    //   flex: 1,
    //   renderCell: ({ row: { access } }) => {
    //     return (
    //       <Box
    //         width="60%"
    //         m="0 auto"
    //         p="5px"
    //         display="flex"
    //         justifyContent="center"
    //         backgroundColor={
    //           access === "admin"
    //             ? colors.greenAccent[600]
    //             : access === "manager"
    //             ? colors.greenAccent[700]
    //             : colors.greenAccent[700]
    //         }
    //         borderRadius="4px"
    //       >
    //         {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
    //         {access === "manager" && <SecurityOutlinedIcon />}
    //         {access === "user" && <LockOpenOutlinedIcon />}
    //         <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
    //           {access}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // },
  ];

  function toLowerKeys(obj) {
    return Object.keys(obj).reduce((accumulator, key) => {
      accumulator[key.toLowerCase()] = obj[key];
      return accumulator;
    }, {});
  }

  return (
    <Box m="20px">
      <Header title="NFL ODDS" subtitle="NFL Odds week 9" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={Object.keys(bids).map((key) => bids[key])}   getRowId={row => row["gameId"]} columns={columns} />
      </Box>
    </Box>
  );
};

export default Football;
