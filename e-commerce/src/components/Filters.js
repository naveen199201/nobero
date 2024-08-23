import { Box,Button } from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import './filters.css';

const Filters = ({ filters, setFilters,uniqueColors }) => {
  const [showMoreColors, setShowMoreColors] = useState(false);
  const [showMoreSizes, setShowMoreSizes] = useState(false);
  const [showMorePrices, setShowMorePrices] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "color") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: checked
          ? [...prevFilters[name], value]
          : prevFilters[name].filter((color) => color !== value),
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: prevFilters[name] === value ? "" : value,
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      price: "",
      color: [],
      size: "",
    });
  };

  return (
    <div>
    <Box className="filter-box">
      <h2 className="filter-heading">Filters</h2>
      <Button onClick={clearFilters}>
        Clear All
      </Button>
    </Box>

      <div>
        <Box className="filter-box" >
        <h3>Price</h3>
        <Button onClick={() => setShowMorePrices(!showMorePrices)} className="showmore">
          {showMorePrices ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </Button>
        </Box>
        {[
          { label: "Less than ₹500", value: "lessThan500" },
          { label: "Between ₹500 and ₹1000", value: "between500And1000" },
          { label: "Between ₹1000 and ₹1500", value: "between1000And1500" },
          { label: "Between ₹1500 and ₹2000", value: "between1500And2000" },
          { label: "More than ₹2000", value: "moreThan2000" },
        ]
          .slice(0, showMorePrices ? undefined : 4)
          .map((price, index) => (
            <div key={index} className="prices">
              <input
                type="radio"
                name="price"
                value={price.value}
                checked={filters.price === price.value}
                onChange={handleFilterChange}
              />
              <label>{price.label}</label>
            </div>
          ))}
      </div>
      <div>
        <Box className="filter-box">
        <h3>Colors</h3>
        <Button onClick={() => setShowMoreColors(!showMoreColors)} className="showmore">
          {showMoreColors ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </Button>
        </Box>
        {uniqueColors
          .slice(0, showMoreColors ? undefined : 4)
          .map((color, index) => (
            <div key={index} className="colors">
              <input
                type="checkbox"
                name="color"
                value={color}
                checked={filters.color.includes(color)}
                onChange={handleFilterChange}
              />
              <label>{color}</label>
            </div>
          ))}
      </div>
      <div>
        <Box className="filter-box">
        <h3>Size</h3>
        <Button onClick={() => setShowMoreSizes(!showMoreSizes)}>
          {showMoreSizes ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </Button>
        </Box>
        {["S", "M", "L", "XL", "XXL", "XXXL"]
          .slice(0, showMoreSizes ? undefined : 4)
          .map((size, index) => (
            <div key={index} className="sizes">
              <input
                type="radio"
                name="size"
                value={size}
                checked={filters.size === size}
                onChange={handleFilterChange}
              />
              <label>{size}</label>
            </div>
          ))} 
      </div>
    </div>
  );
};

export default Filters;
