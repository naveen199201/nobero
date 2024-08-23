import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Filters from "./Filters";
import ScrollButton from "./ScrollButton";
import {
    Box,
    Grid,
    Card,
    
    CardMedia,
    Typography,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        price: "",
        color: [],
        size: "",
    });
    const [sortOrder, setSortOrder] = useState("");

    // Fetch products and extract unique colors and sizes
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

    const getUniqueColors = () => {
        const colors = new Set();
        products.forEach(product => {
            const availableSkus = JSON.parse(product.available_skus.replace(/'/g, '"'));
            availableSkus.colors.forEach(color => colors.add(color));
        });
        return Array.from(colors);
    };

    const getUniqueSizes = () => {
        const sizes = new Set();
        products.forEach(product => {
            const availableSkus = JSON.parse(product.available_skus.replace(/'/g, '"'));
            availableSkus.sizes.forEach(size => sizes.add(size));
        });
        return Array.from(sizes);
    };

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
                return true;
        }
    };

    const filterByColor = (product) => {
        if (filters.color.length === 0) return true;

        const availableSkus = JSON.parse(product.available_skus.replace(/'/g, '"'));
        return availableSkus.colors.some((color) =>
            filters.color.includes(color)
        );
    };

    const filterBySize = (product) => {
        if (!filters.size) return true;

        const availableSkus = JSON.parse(product.available_skus.replace(/'/g, '"'));
        return availableSkus.sizes.includes(filters.size);
    };
    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };

    const sortProducts = (products) => {
        return products.sort((a, b) => {
            const priceA = parseFloat(a.price.replace("₹", ""));
            const priceB = parseFloat(b.price.replace("₹", ""));
            if (sortOrder === "lowToHigh") {
                return priceA - priceB;
            } else if (sortOrder === "highToLow") {
                return priceB - priceA;
            }
            return 0;
        });
    };

    const filteredProducts = sortProducts(
        products.filter(filterByPrice).filter(filterByColor).filter(filterBySize)
    );

    return (
        <Box display="flex" sx={{ m: 5 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{display:'flex', justifyContent:'space-between'}} >
                    <Box>
                    <Typography variant="h4" >
                        Product List
                    </Typography>
                    <Typography  gutterBottom>
                        {filteredProducts.length} Items
                    </Typography>
                    </Box>
                    <FormControl variant="outlined" sx={{ minWidth: 120, mb: 0 }}>
                            <InputLabel>Sort by</InputLabel>
                            <Select
                                value={sortOrder}
                                onChange={handleSortChange}
                                // label="Sort by"
                            >
                                <MenuItem value="none">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
                                <MenuItem value="highToLow">Price: High to Low</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                <Grid item xs={2}>
                    <Filters
                        filters={filters}
                        setFilters={setFilters}
                        uniqueColors={getUniqueColors()}
                        uniqueSizes={getUniqueSizes()}
                    />
                </Grid>
                <Grid item xs={10}>
                    <Box ml={2}>
                        <Grid container spacing={2}>
                            {filteredProducts.map((product) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                    <Card sx={{ height: "450px" }}>
                                        <CardMedia
                                            component="img"
                                            // height="200px"
                                            // width="200px"

                                            height={"100%"}
                                            width={"100%"}
                                            src={'https://' + product.img}
                                            alt={product.title}
                                        // sx={{px:6}}
                                        />
                                    </Card>
                                    <Typography variant="h6">{product.title}</Typography>
                                    <Box sx={{ display: "flex", flexDirection: 'row', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '20px', pr: 1 }}>
                                            {product.price}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{}}>
                                            ₹<strike>{product.mrp}</strike>
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        component={Link}
                                        to={`/product/${product.id}`}
                                        sx={{ pr: '1' }}
                                    >
                                        {/* <a href={product.url}> */}
                                        View Details
                                        {/* </a> */}
                                    </Button>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <ScrollButton />
        </Box>
    );
};

export default ProductList;
