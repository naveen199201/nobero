import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Filters from "./Filters";
import ScrollButton from "./ScrollButton";
import './productlist.css';
import {
    Box,
    Grid,
    Card,
    CardMedia,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";

// Main component to display a list of products
const ProductList = () => {
    // State to hold the list of products
    const [products, setProducts] = useState([]);
    // State to hold filter criteria
    const [filters, setFilters] = useState({
        price: "",
        color: [],
        size: "",
    });
    // State to hold the current sort order
    const [sortOrder, setSortOrder] = useState("");

    // useEffect to fetch products data from the API when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/products/");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // Function to get unique colors from the product list
    const getUniqueColors = () => {
        const colors = new Set();
        products.forEach(product => {
            const availableSkus = JSON.parse(product.available_skus.replace(/'/g, '"'));
            availableSkus.colors.forEach(color => colors.add(color));
        });
        return Array.from(colors);
    };

    // Function to get unique sizes from the product list
    const getUniqueSizes = () => {
        const sizes = new Set();
        products.forEach(product => {
            const availableSkus = JSON.parse(product.available_skus.replace(/'/g, '"'));
            availableSkus.sizes.forEach(size => sizes.add(size));
        });
        return Array.from(sizes);
    };

    // Function to filter products by price range
    const filterByPrice = (product) => {
        switch (filters.price) {
            case "lessThan500":
                return parseFloat(product.price.replace("₹", "")) < 500;
            case "between500And900":
                return (
                    parseFloat(product.price.replace("₹", "")) >= 500 &&
                    parseFloat(product.price.replace("₹", "")) <= 900
                );
            case "between900And1500":
                return (
                    parseFloat(product.price.replace("₹", "")) > 900 &&
                    parseFloat(product.price.replace("₹", "")) <= 1500
                );
            case "between1500And2000":
                return (
                    parseFloat(product.price.replace("₹", "")) > 1500 &&
                    parseFloat(product.price.replace("₹", "")) <= 2000
                );
            case "moreThan2000":
                return parseFloat(product.price.replace("₹", "")) > 2000;
            default:
                return true; // If no price filter is selected, show all products
        }
    };

    // Function to filter products by selected color
    const filterByColor = (product) => {
        if (filters.color.length === 0) return true; // If no color filter is selected, show all products
        const availableSkus = JSON.parse(product.available_skus.replace(/'/g, '"'));
        return availableSkus.colors.some((color) =>
            filters.color.includes(color)
        );
    };

    // Function to filter products by selected size
    const filterBySize = (product) => {
        if (!filters.size) return true; // If no size filter is selected, show all products

        const availableSkus = JSON.parse(product.available_skus.replace(/'/g, '"'));
        return availableSkus.sizes.includes(filters.size);
    };

    // Event handler to change sort order based on user selection
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    // Function to sort products based on the selected sort order
    const sortProducts = (products) => {
        return products.sort((a, b) => {
            const priceA = parseFloat(a.price.replace("₹", ""));
            const priceB = parseFloat(b.price.replace("₹", ""));
            if (sortOrder === "lowToHigh") {
                return priceA - priceB;
            } else if (sortOrder === "highToLow") {
                return priceB - priceA;
            }
            return 0; // If no sort order is selected, maintain original order
        });
    };

    // Apply all filters and sort the filtered product list
    const filteredProducts = sortProducts(
        products.filter(filterByPrice).filter(filterByColor).filter(filterBySize)
    );

    // Render the product list and filters
    return (
        <Box display="flex" sx={{ m: 5 }}>
            <Grid container spacing={2}>
                {/* Header with product count and sort dropdown */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                    <Box>
                        <Typography variant="h4">
                            Product List
                        </Typography>
                        <Typography gutterBottom>
                            {filteredProducts.length} Items
                        </Typography>
                    </Box>
                    <FormControl variant="outlined" sx={{ minWidth: 120, mb: 0 }}>
                        <InputLabel>Sort by</InputLabel>
                        <Select
                            value={sortOrder}
                            onChange={handleSortChange}
                        >
                            <MenuItem value="none">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
                            <MenuItem value="highToLow">Price: High to Low</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Sidebar with filters */}
                <Grid item xs={2}>
                <Box className="scroll"
                    >
                    <Filters
                        filters={filters}
                        setFilters={setFilters}
                        uniqueColors={getUniqueColors()}
                        uniqueSizes={getUniqueSizes()}
                    />
                    </Box>
                </Grid>

                {/* Main product display area */}
                <Grid item xs={10}>
                <Box className="scroll">
                        <Grid container spacing={2}>
                            {filteredProducts.map((product) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} sx={{ mb: 2 }}>
                                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                        <Card sx={{ height: "450px" }}>
                                            <CardMedia
                                                component="img"
                                                height={"100%"}
                                                width={"100%"}
                                                src={'https://' + product.img}
                                                alt={product.title}
                                            />
                                        </Card>
                                        <Typography sx={{ fontSize: "1rem", color: 'black', mt: 2 }}>
                                            {product.title}
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography variant="body2" color="black" sx={{ fontSize: '20px', pr: 1 }}>
                                                {product.price}
                                            </Typography>
                                            <Typography variant="body2" color="black">
                                                ₹<strike>{product.mrp}</strike>
                                            </Typography>
                                        </Box>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            {/* Button to scroll back to the top of the page */}
            <ScrollButton />
        </Box>
    );
};

export default ProductList;
