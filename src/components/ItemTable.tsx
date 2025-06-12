import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Item } from '../types/item';

interface ItemTableProps {
  items: Item[];
  onDelete: (id: number) => void;
}

export const ItemTable: React.FC<ItemTableProps> = ({ items, onDelete }) => {
  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (date: Date | null) => {
    if (!date) return 'default';
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'error';
    if (diffDays <= 7) return 'warning';
    return 'success';
  };

  if (items.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          color: 'text.secondary',
          bgcolor: 'background.default',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom>
          登録されている消耗品はありません
        </Typography>
        <Typography variant="body2">
          新しい消耗品を追加してください
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>消耗品名</TableCell>
            <TableCell>カテゴリ</TableCell>
            <TableCell>数量</TableCell>
            <TableCell>価格</TableCell>
            <TableCell>購入店舗</TableCell>
            <TableCell>購入日</TableCell>
            <TableCell>次回購入予定日</TableCell>
            <TableCell>購入者</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow 
              key={item.id}
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                transition: 'background-color 0.2s',
              }}
            >
              <TableCell>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {item.name}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={item.category}
                  size="small"
                  sx={{ 
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    fontWeight: 500
                  }}
                />
              </TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  ¥{item.price.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>{item.store}</TableCell>
              <TableCell>{formatDate(item.purchaseDate)}</TableCell>
              <TableCell>
                <Chip
                  label={formatDate(item.nextPurchaseDate)}
                  size="small"
                  color={getStatusColor(item.nextPurchaseDate)}
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={item.userId}
                  size="small"
                  sx={{ 
                    bgcolor: 'secondary.light',
                    color: 'secondary.contrastText',
                    fontWeight: 500
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => onDelete(item.id)}
                  size="small"
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.light',
                      color: 'error.contrastText',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 