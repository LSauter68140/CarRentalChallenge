import React, { useEffect, useState } from "react";
import { Button, TextField, withStyles } from "@material-ui/core";
import { buttonLink } from "./tools/buttonLink";
import TabCar from "./tools/tabCar";

/*css file*/
import "./showCar.css";

const CustomBtn = withStyles(() => ({
  root: {
    margin: "10px auto",
    maxWidth: "250px",
  },
}))(Button);

export const ShowCar = ({ fct }) => {
  const [dataCar, setDataCar] = useState([]);
  const [level, setLevel] = useState(0);
  const [query, setQuery] = useState("/cars.json");
  const [dstWanted, setDst] = useState(0);
  const [drtWanted, setDrt] = useState(0);
  useEffect(() => {
    fetch(query, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        // for the initial state
        if (level == 0) return;
        // when we chose a button
        rentalPrice(data);
      })
      .catch((err) => {
        console.error("Error ", err);
      });
  }, [query]);

  const rentalPrice = (data: {
    length: number;
    map: (arg0: (car: any) => any) => React.SetStateAction<never[]>;
  }) => {
    if (data.length > 0) {
      let nameProperties: string = "";
      // @ts-ignore
      setDataCar(
        data.map((car) => {
          // we convert all the price in Euro
          car.pricePerKm /= 100;
          car.pricePerDay /= 100;
          if (level > 2) {
            if (level == 4) {
              // to put a degressive price
              let percentage = 1;
              if (drtWanted > 1 && drtWanted < 5) {
                percentage = 0.9;
              } else if (drtWanted > 4 && drtWanted < 11) {
                percentage = 0.7;
              } else if (drtWanted > 10) {
                percentage = 0.5;
              }
              if (percentage != 1) {
                nameProperties =
                  "pricePerDay -" + Math.round((1 - percentage) * 100) + "%";
                // we replace the columns

                const priceKm = car.pricePerKm;
                const priceDay = Math.round(car.pricePerDay * percentage);
                delete car.pricePerDay;
                delete car["rentalCost"];
                delete car.pricePerKm;

                car[nameProperties] = priceDay;
                car["pricePerKm"] = priceKm;
              }
            }
            // we apply the new price for the computation
            const pricePerDayReal =
              nameProperties === "" ? car.pricePerDay : car[nameProperties];
            // we convert the price in "centime" to euros
            car["rentalCost (eur)"] =
              pricePerDayReal * drtWanted + car.pricePerKm * dstWanted;
          }
          return car;
        })
      );
    }
  };

  const levelConfig = (index: number) => {
    setLevel(index);

    if (index == 1) {
      //re-initialize the table
      setQuery("/cars.json?duration=00&distance=00");
    } else if (!query.includes("?")) {
      // for the first use
      // it's useful to call useEffect function and display the table
      setQuery("/cars.json?duration=00&distance=00");
    }
  };

  return (
    <div>
      <section className="left">
        {buttonLink.map((element, index) => (
          <CustomBtn
            onClick={() => {
              levelConfig(element.query);
              fct(element.title);
            }}
            variant="contained"
            color="primary"
            key={index}
          >
            {element.title}
          </CustomBtn>
        ))}
      </section>
      <section className="right">
        {level > 1 && (
          <article className="select">
            <TextField
              id="standard-number"
              InputProps={{ inputProps: { min: 50, max: 3000, step: 50 } }}
              label="Rental distance(Km)"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                const subQuery = query.split("&")[0];
                setQuery(subQuery + "&distance=" + e.target.value);
                setDst(parseInt(e.target.value));
              }}
            />
            <TextField
              id="standard-number"
              label="Rental Duration (Day)"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 30 } }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                const subQuery = query.split("&")[1];

                setQuery(
                  "/cars.json?duration=" + e.target.value + "&" + subQuery
                );
                setDrt(parseInt(e.target.value));
              }}
            />
          </article>
        )}
        <p>Nb : All prices are in euros (€)</p>
        <TabCar ctn={dataCar} />
      </section>
    </div>
  );
};
