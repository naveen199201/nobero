import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button } from "@mui/material";
import './ProductDetails.css';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Paper,
    List,
    ListItem,
    CircularProgress,
} from "@mui/material";

const ProductDetail = () => {
    const { id } = useParams();
    const ids = Number(id);
    console.log(id);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [description, setDescription] = useState('');

    const extractKeyValuePairs = (text) => {
        const result = {};
        // Split by period followed by space or end of string to handle multiple sentences
        const sections = text.split(/(?<=\.)\s*/);
    
        sections.forEach(section => {
            // Use regex to find key and value
            const match = section.match(/^([A-Za-z\s]+):\s*(.+)$/);
            if (match) {
                const key = match[1].trim(); // Extract key and trim whitespace
                const value = match[2].trim(); // Extract value and trim whitespace
                result[key] = value;
            }
        });
    
        return result;
    };
    
    

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${ids}/`);
                setProduct(response.data);
                console.log(response.data)
                setDescription(response.data.description)
                console.log(response.data.description)

                // setSizes(JSON.parse(response.data.available_skus));
                // let available_skus= response.data.available_skus;
                // console.log(JSON.parse(available_skus));
                setLoading(false);
            } catch (err) {
                setError("Product not found");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [ids]);
    useEffect(() => {
        if (product) {
            
            let available_skus = JSON.parse(product.available_skus.replace(/'/g, '"')).sizes;
            console.log(available_skus);
            const uniqueSizesSet = new Set(available_skus);
            const uniqueSizesArray = Array.from(uniqueSizesSet);
            console.log();
            setSizes(uniqueSizesArray)
        }
    }, [product])
    useEffect(() => {
        if (product) {
            console.log("hello")
            console.log(product.description)
            // const parsedDescription = parseDescription(product.description);
            const keyValuePairs = extractKeyValuePairs(product.description);
    
    console.log(keyValuePairs);
        }
        }, [product])
    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }
    if (error) {
        return (
            <Container>
                <Typography variant="h5" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    const specifications = product.specifications
        ? JSON.parse(product.specifications.replace(/'/g, '"'))
        : {};

    

    return (
        <Box className="product-detail">
            <Card>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <CardMedia
                            component="img"
                            height="800"
                            width="100%"
                            src={'https://' + product.img}
                            alt={product.title}
                            sx={{objectFit:'fill'}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {product.title}
                            </Typography>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {product.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                MRP: <strike>₹{product.mrp} </strike> Inclusive of all Taxes
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {product.last_7_day_sale} people bought this in last 7 days
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }} >Select Size:</Typography>
                            <Box mt={2} mb={2} sx={{ display: 'flex', flexDirection: 'row',justifyContent:'space-between' }}>
                                {sizes.map(
                                    (value) => {
                                        return (
                                            <Typography key={value} variant="body1" >
                                                <Button className="size-button" >
                                                    {value}
                                                </Button>
                                            </Typography>
                                        )
                                    }
                                )}
                            </Box>
                            <Button sx={{ backgroundColor: '#242f66 ', borderRadius: '40px', p: 2, color: "white", fontWeight: 'bold' }} fullWidth >
                                Add to Cart
                            </Button>
                            <CardMedia
                            component="img"
                            height="100"
                            width="100%"
                            src={'https://nobero.com/cdn/shop/files/trust_banner_2.svg?v=1680263466'}
                            alt={product.title}
                            sx={{objectFit:'fill',mt:4}}
                        />
                            <Box sx={{ padding: 2 }}>
                                {/* <Typography variant="body1" gutterBottom>
                                    {product.description}
                                </Typography> */}
                                <Typography variant="h6" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
                                    Key Highlights
                                </Typography>
                                <List sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: '10px' }}>
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <ListItem key={key} disablePadding className="hightlights-item">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <Typography variant="body1" color="text.secondary">
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                                                </Typography>

                                                <Typography variant="body1">{value}</Typography>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                                <Grid item xs={12} sm={6}>
                        
                    </Grid>
                                
                            </Box>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
};

export default ProductDetail;
