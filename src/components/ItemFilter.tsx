import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Paper,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { FilterOptions, Category, SortOrder } from '../types/item';

interface ItemFilterProps {
  filterOptions: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: Category[];
  users: string[];
  sortOrder: SortOrder;
  onSortChange: (sortOrder: SortOrder) => void;
  onAddCategory: () => void;
}

export const ItemFilter: React.FC<ItemFilterProps> = ({
  filterOptions,
  onFilterChange,
  categories,
  users,
  sortOrder,
  onSortChange,
  onAddCategory,
}) => {
  const handleCategoryChange = (event: any) => {
    onFilterChange({ ...filterOptions, category: event.target.value });
  };

  const handleUserChange = (event: any) => {
    onFilterChange({ ...filterOptions, userId: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    onFilterChange({ ...filterOptions, status: event.target.value });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filterOptions, searchText: event.target.value });
  };

  const handleClearSearch = () => {
    onFilterChange({ ...filterOptions, searchText: '' });
  };

  const handleSortChange = (event: any) => {
    onSortChange(event.target.value);
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 3,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            placeholder="購入品名で検索"
            value={filterOptions.searchText}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: filterOptions.searchText && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>カテゴリ</InputLabel>
            <Select
              value={filterOptions.category}
              label="カテゴリ"
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">すべて</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
              <MenuItem 
                value=""
                onClick={(e) => {
                  e.preventDefault();
                  onAddCategory();
                }}
                sx={{ 
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(27, 94, 32, 0.04)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddCircleOutlineIcon fontSize="small" />
                  新しいカテゴリを追加
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>購入者</InputLabel>
            <Select
              value={filterOptions.userId}
              label="購入者"
              onChange={handleUserChange}
            >
              <MenuItem value="all">すべて</MenuItem>
              <MenuItem value="家族全員">家族全員</MenuItem>
              {users.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>ステータス</InputLabel>
            <Select
              value={filterOptions.status}
              label="ステータス"
              onChange={handleStatusChange}
            >
              <MenuItem value="all">すべて</MenuItem>
              <MenuItem value="overdue">期限切れ</MenuItem>
              <MenuItem value="upcoming">近日中</MenuItem>
              <MenuItem value="due">期限切れ・近日中</MenuItem>
              <MenuItem value="noDate">日付未設定</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>並び替え</InputLabel>
            <Select
              value={sortOrder}
              label="並び替え"
              onChange={handleSortChange}
            >
              <MenuItem value="nextPurchaseDate">次回購入予定日</MenuItem>
              <MenuItem value="purchaseDate">購入日</MenuItem>
              <MenuItem value="price">価格</MenuItem>
              <MenuItem value="name">名前</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
}; 