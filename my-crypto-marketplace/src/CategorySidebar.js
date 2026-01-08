import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';

function CategorySidebar({ categories, onSelectCategory, onFilterChange }) {
  const [open, setOpen] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleClick = (id) => {
    setOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategorySelect = (id) => {
    setSelectedId(id);
    onSelectCategory(id);
    // Скидаємо фільтри при зміні категорії
    setSelectedFilters({}); 
    onFilterChange({});
  };

  useEffect(() => {
    const fetchFilters = async () => {
        if (selectedId) {
            try {
                const response = await fetch(`http://localhost:3001/api/categories/${selectedId}/filters`);
                if (!response.ok) throw new Error("Could not fetch filters");
                const data = await response.json();
                setFilters(data);
            } catch (error) {
                console.error(error);
                setFilters(null);
            }
        } else {
            setFilters(null);
        }
    };
    fetchFilters();
  }, [selectedId]);
  
  const handleFilterSelection = (filterKey, value) => {
      const newFilters = { ...selectedFilters };
      // Використовуємо чекбокси, тому логіка така: якщо значення вже є, видаляємо, інакше додаємо.
      // Для простоти, поки що дозволимо тільки один вибір на характеристику.
      if (newFilters[filterKey] === value) {
          delete newFilters[filterKey];
      } else {
          newFilters[filterKey] = value;
      }
      setSelectedFilters(newFilters);
      onFilterChange(newFilters);
  };


  return (
    <Paper>
      <Typography variant="h6" sx={{ p: 2 }}>Категорії</Typography>
      <List component="nav" dense>
        <ListItemButton onClick={() => handleCategorySelect(null)} selected={selectedId === null}>
            <ListItemText primary="Всі товари" />
        </ListItemButton>
        {categories.map(category => (
          <div key={category.id}>
            <ListItemButton onClick={() => handleClick(category.id)}>
              <ListItemText primary={category.name} />
              {open[category.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open[category.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {category.children.map(subcategory => (
                  <ListItemButton 
                    key={subcategory.id} 
                    sx={{ pl: 4 }}
                    selected={selectedId === subcategory.id}
                    onClick={() => handleCategorySelect(subcategory.id)}
                  >
                    <ListItemText primary={subcategory.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
      {filters && Object.keys(filters).length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ p: 2 }}>
                <Typography variant="h6">Фільтри</Typography>
                {Object.entries(filters).map(([key, values]) => (
                    <Box key={key} sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>{key}</Typography>
                        {values.map(value => (
                            <FormControlLabel 
                                key={value}
                                sx={{ display: 'block', ml: -1 }}
                                control={
                                    <Checkbox 
                                        size="small"
                                        checked={selectedFilters[key] === value}
                                        onChange={() => handleFilterSelection(key, value)}
                                    />
                                } 
                                label={value}
                            />
                        ))}
                    </Box>
                ))}
            </Box>
          </>
      )}
    </Paper>
  );
}

export default CategorySidebar;