import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
  IconButton,
  InputAdornment,
  ThemeProvider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { ItemTable } from './components/ItemTable';
import { ItemFilter } from './components/ItemFilter';
import { Item, Category, FilterOptions, SortOrder, ItemStatus, DefaultCategory } from './types/item';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import theme from './theme';

const DEFAULT_CATEGORIES: DefaultCategory[] = [
  '食品',
  'キッチン用品',
  '洗剤・掃除用品',
  '衛生用品',
  '文房具'
];

const USERS = ['家族全員', '父', '母', '子供'];

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [customUsers, setCustomUsers] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    category: '食品',
    quantity: 1,
    price: 0,
    store: '',
    purchaseDate: new Date(),
    nextPurchaseDate: null,
    userId: '家族全員'
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: 'all',
    userId: 'all',
    status: 'all',
    searchText: ''
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>('nextPurchaseDate');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  type DeleteTarget = {
    type: 'category' | 'user';
    value: string;
  };

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenCategoryDialog = () => setOpenCategoryDialog(true);
  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setNewCategory('');
  };

  const handleAddCategory = () => {
    if (newCategory && !DEFAULT_CATEGORIES.includes(newCategory as DefaultCategory) && !customCategories.includes(newCategory)) {
      setCustomCategories(prev => [...prev, newCategory]);
      handleCloseCategoryDialog();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value ? new Date(value) : null
    }));
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      const item: Item = {
        id: Date.now(),
        name: newItem.name,
        category: newItem.category as Category,
        quantity: newItem.quantity || 1,
        price: newItem.price,
        store: newItem.store || '',
        purchaseDate: newItem.purchaseDate || new Date(),
        nextPurchaseDate: newItem.nextPurchaseDate || null,
        userId: newItem.userId || '家族全員'
      };
      setItems(prev => [...prev, item]);
      
      if (newItem.userId && newItem.userId !== '家族全員' && !customUsers.includes(newItem.userId)) {
        setCustomUsers(prev => [...prev, newItem.userId as string]);
      }
      
      if (newItem.category && !DEFAULT_CATEGORIES.includes(newItem.category as DefaultCategory) && !customCategories.includes(newItem.category as Category)) {
        setCustomCategories(prev => [...prev, newItem.category as Category]);
      }
      
      setNewItem({
        name: '',
        category: '食品',
        quantity: 1,
        price: 0,
        store: '',
        purchaseDate: new Date(),
        nextPurchaseDate: null,
        userId: '家族全員'
      });
      handleClose();
    }
  };

  const handleDeleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
  };

  const handleSortChange = (newSortOrder: SortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleDeleteClick = (type: 'category' | 'user', value: string) => {
    // 使用状況をチェック
    const isInUse = items.some(item => 
      type === 'category' 
        ? item.category === value
        : item.userId === value
    );

    if (isInUse) {
      alert(
        type === 'category'
          ? `カテゴリ「${value}」は使用中のため削除できません。\n関連するアイテムを削除または別のカテゴリに変更してください。`
          : `購入者「${value}」は使用中のため削除できません。\n関連するアイテムを削除または別の購入者に変更してください。`
      );
      return;
    }

    setDeleteTarget({ type, value });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const target = deleteTarget;
    if (!target) return;

    if (target.type === 'category') {
      setCustomCategories(prev => prev.filter(cat => cat !== target.value));
    } else {
      setCustomUsers(prev => prev.filter(user => user !== target.value));
    }

    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const uniqueUsers = useMemo(() => {
    const userSet = new Set([...customUsers, ...items.map(item => item.userId)]);
    return Array.from(userSet).filter(user => user !== '家族全員');
  }, [items, customUsers]);

  const allCategories = useMemo(() => {
    return [...DEFAULT_CATEGORIES, ...customCategories];
  }, [customCategories]);

  const filteredAndSortedItems = items
    .filter(item => {
      if (filterOptions.category !== 'all' && item.category !== filterOptions.category) return false;
      if (filterOptions.userId !== 'all' && item.userId !== filterOptions.userId) return false;
      if (filterOptions.searchText && !item.name.toLowerCase().includes(filterOptions.searchText.toLowerCase())) return false;
      
      if (filterOptions.status !== 'all') {
        const today = new Date();
        const nextDate = item.nextPurchaseDate;
        
        if (!nextDate) {
          return filterOptions.status === 'noDate';
        }
        
        const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filterOptions.status) {
          case 'overdue':
            return diffDays < 0;
          case 'upcoming':
            return diffDays > 0 && diffDays <= 7;
          case 'due':
            return diffDays < 0 || diffDays <= 7;
          default:
            return true;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'nextPurchaseDate':
          if (!a.nextPurchaseDate) return 1;
          if (!b.nextPurchaseDate) return -1;
          return a.nextPurchaseDate.getTime() - b.nextPurchaseDate.getTime();
        case 'purchaseDate':
          return b.purchaseDate.getTime() - a.purchaseDate.getTime();
        case 'price':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name, 'ja');
        default:
          return 0;
      }
    });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default', 
        py: 4,
        background: 'linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 100%)'
      }}>
        <Container maxWidth="lg">
          <Paper 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              pb: 2,
              borderBottom: '2px solid',
              borderColor: 'primary.light'
            }}>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    color: 'primary.dark',
                    fontWeight: 700,
                    letterSpacing: '-0.5px'
                  }}
                >
                  日用品管理アプリ
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    color: 'primary.main',
                    opacity: 0.8
                  }}
                >
                  日用品の購入履歴を記録し、次回の購入時期を予測します
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                sx={{ 
                  py: 1.5, 
                  px: 3,
                  height: 'fit-content',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                新しい購入品を追加
              </Button>
            </Box>

            <ItemFilter
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              categories={allCategories}
              users={uniqueUsers}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onAddCategory={handleOpenCategoryDialog}
            />

            <Box sx={{ mt: 3 }}>
              <ItemTable items={filteredAndSortedItems} onDelete={handleDeleteItem} />
            </Box>
          </Paper>
        </Container>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>新しい購入品を追加</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
              <TextField
                name="name"
                label="購入品名"
                value={newItem.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                name="category"
                label="カテゴリ"
                value={newItem.category}
                onChange={handleInputChange}
                fullWidth
                select
              >
                {allCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      {category}
                      {!DEFAULT_CATEGORIES.includes(category as DefaultCategory) && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick('category', category);
                          }}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem 
                  value=""
                  onClick={(e) => {
                    e.preventDefault();
                    const newCategory = prompt('新しいカテゴリを入力してください');
                    if (newCategory && newCategory.trim()) {
                      const trimmedCategory = newCategory.trim();
                      if (!DEFAULT_CATEGORIES.includes(trimmedCategory as DefaultCategory) && !customCategories.includes(trimmedCategory as Category)) {
                        setCustomCategories(prev => [...prev, trimmedCategory as Category]);
                      }
                      setNewItem(prev => ({ ...prev, category: trimmedCategory }));
                    }
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
              </TextField>
              <TextField
                name="quantity"
                label="数量"
                type="number"
                value={newItem.quantity}
                onChange={handleInputChange}
                fullWidth
                inputProps={{ min: 1 }}
              />
              <TextField
                name="price"
                label="価格"
                type="number"
                value={newItem.price}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                name="store"
                label="購入店舗"
                value={newItem.store}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="purchaseDate"
                label="購入日"
                type="date"
                value={newItem.purchaseDate?.toISOString().split('T')[0]}
                onChange={handleDateChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="nextPurchaseDate"
                label="次回購入予定日"
                type="date"
                value={newItem.nextPurchaseDate?.toISOString().split('T')[0] || ''}
                onChange={handleDateChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="userId"
                label="購入者"
                value={newItem.userId}
                onChange={handleInputChange}
                fullWidth
                select
              >
                <MenuItem value="家族全員">家族全員</MenuItem>
                {uniqueUsers.map((user) => (
                  <MenuItem key={user} value={user}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      {user}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick('user', user);
                        }}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem 
                  value=""
                  onClick={(e) => {
                    e.preventDefault();
                    const newUser = prompt('新しい購入者を入力してください');
                    if (newUser && newUser.trim()) {
                      const trimmedUser = newUser.trim();
                      if (!customUsers.includes(trimmedUser)) {
                        setCustomUsers(prev => [...prev, trimmedUser]);
                      }
                      setNewItem(prev => ({ ...prev, userId: trimmedUser }));
                    }
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
                    新しい購入者を追加
                  </Box>
                </MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button onClick={handleAddItem} variant="contained">
              追加
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} maxWidth="xs" fullWidth>
          <DialogTitle>新しいカテゴリを追加</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                label="カテゴリ名"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                fullWidth
                autoFocus
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCategoryDialog}>キャンセル</Button>
            <Button onClick={handleAddCategory} variant="contained">
              追加
            </Button>
          </DialogActions>
        </Dialog>

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={handleDeleteConfirm}
          title={deleteTarget?.type === 'category' ? 'カテゴリの削除' : '購入者の削除'}
          message={
            deleteTarget?.type === 'category'
              ? `カテゴリ「${deleteTarget?.value}」を削除しますか？\nこのカテゴリを使用しているアイテムは「その他」カテゴリに移動されます。`
              : `購入者「${deleteTarget?.value}」を削除しますか？\nこの購入者を使用しているアイテムは「家族全員」に変更されます。`
          }
        />
      </Box>
    </ThemeProvider>
  );
};

export default App; 