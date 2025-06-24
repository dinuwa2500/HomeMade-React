import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Collapse, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDataFromApi } from '../../pages/api';

const categories = [
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/1-2.png',
    name: 'Agricultural Products',
    link: '/category/agricultural-products',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/2.png',
    name: 'Bags',
    link: '/category/bags',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/3.png',
    name: 'Bamboo Products',
    link: '/category/bamboo-products',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/4.png',
    name: 'Batik Wear',
    link: '/category/batik-wear',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/5.png',
    name: 'Beauty And Cosmetics',
    link: '/category/beauty-and-cosmetics',
  },
  {
    img: 'https://ekade.lk/wp-content/uploads/2023/06/7.png',
    name: 'Bedsheets',
    link: '/category/bedsheets',
  },
];

const CategoryCollapse = () => {
  const { categoryName } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(categoryName ? decodeURIComponent(categoryName.replace(/-/g, ' ')) : '');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Sync selectedCategory with URL param
    if (categoryName) {
      setSelectedCategory(decodeURIComponent(categoryName.replace(/-/g, ' ')));
    }
  }, [categoryName]);

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      // Fetch real products by category from backend
      fetchDataFromApi(`/api/products?category=${encodeURIComponent(selectedCategory)}`)
        .then(data => {
          if (data && (data.products || Array.isArray(data))) {
            setItems(data.products || data);
          } else {
            setItems([]);
          }
        })
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else {
      setItems([]);
    }
  }, [selectedCategory]);

  return (
    <div>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {categories.map(cat => (
          <Grid item xs={6} sm={4} md={3} key={cat.name}>
            <Card
              onClick={() => {
                setSelectedCategory(cat.name);
              }}
              sx={{ cursor: 'pointer', boxShadow: selectedCategory === cat.name ? 6 : 1, border: selectedCategory === cat.name ? '2px solid #1976d2' : 'none', transition: 'box-shadow 0.2s, border 0.2s' }}
            >
              <CardMedia component="img" height="120" image={cat.img} alt={cat.name} />
              <CardContent>
                <Typography variant="subtitle1" align="center">{cat.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Collapse in={!!selectedCategory} timeout="auto" unmountOnExit>
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          {selectedCategory} Items
        </Typography>
        {loading ? (
          <Typography sx={{ ml: 2 }}>Loading...</Typography>
        ) : (
          <Grid container spacing={2}>
            {items.length > 0 ? (
              items.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card>
                    <CardMedia component="img" height="140" image={item.img} alt={item.name} />
                    <CardContent>
                      <Typography variant="subtitle1">{item.name}</Typography>
                      <Typography color="text.secondary">Rs. {item.price}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography sx={{ ml: 2 }}>No items in this category.</Typography>
            )}
          </Grid>
        )}
      
      </Collapse>
    </div>
  );
};

export default CategoryCollapse;
