import React, { useState, useEffect } from 'react';
import { IconButton, Card, CardContent, Typography, CardActions, Modal, Box, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import axios from 'axios';

const BookCard = ({ book, onUpdate, onDelete }) => {
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedBook, setUpdatedBook] = useState(book);
    const [bookImage, setBookImage] = useState('');

    useEffect(() => {
        const fetchBookImage = async () => {
            try {
                const response = await axios.get(`http://localhost:5087/api/Image/${book.image}`);
                setBookImage(response.data);
            } catch (error) {
                console.error('Error fetching book image:', error);
            }
        };

        fetchBookImage();
    }, [book.image]);

    const handleUpdateBook = async () => {
        try {
            await axios.put(`http://localhost:5087/api/Book/${updatedBook.id}`, updatedBook);
            // Cerrar el modal después de la actualización y actualizar los libros
            setShowUpdateModal(false);
            onUpdate(); // Actualizar la lista de libros
            // Actualizar la imagen si se cambió
            if (updatedBook.image !== book.image) {
                const response = await axios.get(`http://localhost:5087/api/Image/${updatedBook.image}`);
                setBookImage(response.data);
            }
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleDeleteBook = async () => {
        try {
            await axios.delete(`http://localhost:5087/api/Book/${book.id}`);
            // Llamar a la función de eliminación pasada como prop
            onDelete(book.id);

            // Eliminar la imagen asociada al libro
            await axios.delete(`http://localhost:5087/api/Image/${book.image}`);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUpdatedBook({ ...updatedBook, [name]: value });
    };

    return (
        <Card>
            <img src={bookImage} alt={book.title} style={{ width: '100%' }} />
            <CardContent>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', fontSize: 18 }}>
                    {book.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Author:</strong> {book.author}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Published:</strong> {book.created}
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton aria-label="update" onClick={() => setShowUpdateModal(true)} sx={{ color: 'orange' }}>
                    <ChangeCircleIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={handleDeleteBook} sx={{ color: 'red' }}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>

            {/* Modal para actualizar información del libro */}
            <Modal open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, width: 400, maxWidth: '90%' }}>
                    <Typography variant="h6" gutterBottom>Actualizar libro</Typography>
                    <TextField name="title" label="Título" fullWidth value={updatedBook.title} onChange={handleChange} />
                    <TextField name="author" label="Autor" fullWidth value={updatedBook.author} onChange={handleChange} />
                    <TextField name="created" label="Fecha de creación" fullWidth value={updatedBook.created} onChange={handleChange} />
                    <TextField name="image" label="URL de la imagen" fullWidth value={updatedBook.image} onChange={handleChange} />
                    <Button onClick={handleUpdateBook} variant="contained" sx={{ mt: 2 }}>Guardar</Button>
                </Box>
            </Modal>
        </Card>
    );
};

export default BookCard;