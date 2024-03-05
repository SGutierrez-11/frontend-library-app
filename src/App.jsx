import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, Modal, Box, TextField, Typography } from '@mui/material';
import axios from 'axios';
import BookCard from './components/BookCard';

const App = () => {
    const [books, setBooks] = useState([]);
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [newBook, setNewBook] = useState({});

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5087/api/Book');
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleAddBook = async () => {
        try {
            // Construir el objeto de libro con el formato correcto
            const formattedNewBook = {
                id: 0,
                title: newBook.title,
                author: newBook.author,
                created: newBook.created,
                image: newBook.image
            };

            await axios.post('http://localhost:5087/api/Book', formattedNewBook);

            // Recargar la lista de libros después de agregar un nuevo libro
            const response = await axios.get('http://localhost:5087/api/Book');
            setBooks(response.data);

            // Ocultar el modal después de agregar el libro
            setShowAddBookModal(false);

            // Limpiar los campos del nuevo libro
            setNewBook({});
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewBook({ ...newBook, [name]: value });
    };

    return (
        <Container>
            <Typography variant="h3" align="center" gutterBottom>
                Library APP
            </Typography>
            <Typography variant="h5" align="center" gutterBottom>
                ¡Agrega libros para expandir tu biblioteca!
            </Typography>
            <Button onClick={() => setShowAddBookModal(true)} variant="contained" color="success" size="large" sx={{ display: 'block', margin: 'auto' }}>
                Agregar libro
            </Button>
            <Modal open={showAddBookModal} onClose={() => setShowAddBookModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, width: 400, maxWidth: '90%' }}>
                    <Typography variant="h6" gutterBottom>Agregar libro</Typography>
                    <TextField name="title" label="Título" fullWidth onChange={handleChange} />
                    <TextField name="author" label="Autor" fullWidth onChange={handleChange} />
                    <TextField name="created" label="Fecha de creación" fullWidth onChange={handleChange} />
                    <TextField name="image" label="URL de la imagen" fullWidth onChange={handleChange} />
                    <Button onClick={handleAddBook} variant="contained" sx={{ mt: 2 }}>Agregar</Button>
                </Box>
            </Modal>
            <Grid container spacing={3} sx={{ marginTop: 4 }}>
                {books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.id}>
                        <BookCard book={book} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default App;
