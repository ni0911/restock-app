import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { NewItem } from '../types/item';

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
  newItem: NewItem;
  setNewItem: (item: NewItem) => void;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  onClose,
  onAdd,
  newItem,
  setNewItem,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        新しい購入品を追加
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3, 
          pt: 2 
        }}>
          <DatePicker
            label="購入日"
            value={newItem.purchaseDate}
            onChange={(date: Date | null) => setNewItem({ ...newItem, purchaseDate: date || new Date() })}
          />
          <TextField
            label="購入品名"
            value={newItem.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem({ ...newItem, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="数量"
            type="text"
            inputProps={{
              inputMode: 'numeric'
            }}
            value={newItem.quantity === 0 ? '' : newItem.quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setNewItem({ ...newItem, quantity: value === '' ? 1 : parseInt(value, 10) });
            }}
            fullWidth
          />
          <TextField
            label="価格"
            type="text"
            inputProps={{
              inputMode: 'numeric'
            }}
            value={newItem.price === 0 ? '' : newItem.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setNewItem({ ...newItem, price: value === '' ? 0 : parseInt(value, 10) });
            }}
            fullWidth
          />
          <TextField
            label="購入店舗"
            value={newItem.store}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem({ ...newItem, store: e.target.value })}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          キャンセル
        </Button>
        <Button 
          onClick={onAdd} 
          variant="contained"
          sx={{ px: 3 }}
        >
          追加
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 