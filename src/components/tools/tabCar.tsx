import React from "react";

import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { grey } from "@material-ui/core/colors";
import { Grid } from "@material-ui/core";

const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      backgroundColor: grey[900],
      color: grey[100],
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: grey[400],
      },
    },
  })
)(TableRow);

const useStyles = makeStyles({
  table: {
    width: "100%",
    overflow: "show",
  },
  img: {
    width: "140px",
  },
});

export default function TabCar({ ...props }) {
  const classes = useStyles();

  const keyData = ((data: {}[]) => {
    if (data.length === 0 || typeof data !== "object") return [];

    const firstObject = data.length > 0 ? data[0] : data;

    let keyArray: any[] = [];
    Object.keys(firstObject).forEach((ele) => {
      if (typeof firstObject[ele] !== "object") {
        keyArray.push(ele);
      }
    });
    return keyArray;
  })(props.ctn);

  return (
    <Grid item xs={11}>
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {keyData.map(
                (ele: any, index: string | number | null | undefined) => (
                  <StyledTableCell key={index}>{ele}</StyledTableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.ctn.map(
              (
                row: {
                  [x: string]: React.ReactNode;
                  name: string | number | null | undefined;
                },
                i: number
              ) => (
                <StyledTableRow key={i}>
                  {keyData.map(
                    (ele: any, index: string | number | null | undefined) => {
                      return typeof row[ele] === "string" &&
                        row[ele] != undefined &&
                        row[ele] != null &&
                        row[ele].includes("pictures") ? (
                        <StyledTableCell key={index}>
                          <img
                            src={row[ele]}
                            className={classes.img}
                            alt={row[ele]}
                          />
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell align="left" key={index}>
                          {row[ele]}
                        </StyledTableCell>
                      );
                    }
                  )}
                </StyledTableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
