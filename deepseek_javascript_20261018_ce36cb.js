// --- DATOS DE LOS LIBROS (Simulando Base de Datos) ---
const libros = [
    { id: 1, titulo: "Harry Potter y la piedra", autor: "J.K. Rowling", precio: 350, categoria: "Ficción", stock: 5, img: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 2, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", precio: 299, categoria: "Novela", stock: 3, img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 3, titulo: "La insoportable levedad", autor: "Milan Kundera", precio: 250, categoria: "Novela", stock: 0, img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 4, titulo: "Como agua para chocolate", autor: "Laura Esquivel", precio: 180, categoria: "Novela", stock: 10, img: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 5, titulo: "Fuerte es el silencio", autor: "Elena Poniatowska", precio: 450, categoria: "Clásico", stock: 2, img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 6, titulo: "Rayuela", autor: "Julio Cortázar", precio: 445, categoria: "Clásico", stock: 4, img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 7, titulo: "La ley de Herodes", autor: "Jorge Ibargüengoitia", precio: 150, categoria: "Ficción", stock: 6, img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 8, titulo: "Arráncame la vida", autor: "Ángeles Mastretta", precio: 350, categoria: "Novela", stock: 1, img: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 9, titulo: "Una habitación propia", autor: "Virginia Woolf", precio: 240, categoria: "Clásico", stock: 2, img: "https://images.unsplash.com/photo-1509266272358-7701da638078?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 10, titulo: "Veinte poemas de amor", autor: "Pablo Neruda", precio: 200, categoria: "Poesía", stock: 8, img: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 11, titulo: "Ariel", autor: "José Enrique Rodó", precio: 120, categoria: "Clásico", stock: 5, img: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    { id: 12, titulo: "Antología Poética", autor: "Varios Autores", precio: 300, categoria: "Poesía", stock: 10, img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
];

// --- ESTADO GLOBAL ---
let carrito = []; // Array para guardar {id, cantidad}
let paginaActual = 1;
const librosPorPagina = 4; // Cantidad de libros a mostrar por página
let filtroCategoria = 'all';
let terminoBusqueda = '';

// --- REFERENCIAS AL DOM ---
const booksGrid = document.getElementById('booksGrid');
const pagination = document.getElementById('pagination');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filterContainer');

// --- FUNCIONES PRINCIPALES ---

// 1. Filtrar y Paginar Libros
function renderLibros() {
    // Filtrar por categoría y búsqueda
    let librosFiltrados = libros.filter(libro => {
        const matchCategoria = filtroCategoria === 'all' || libro.categoria === filtroCategoria;
        const matchBusqueda = libro.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) || 
                              libro.autor.toLowerCase().includes(terminoBusqueda.toLowerCase());
        return matchCategoria && matchBusqueda;
    });

    // Calcular paginación
    const totalPaginas = Math.ceil(librosFiltrados.length / librosPorPagina);
    
    // Asegurar que la página actual no exceda el total
    if (paginaActual > totalPaginas && totalPaginas > 0) paginaActual = totalPaginas;
    if (totalPaginas === 0) paginaActual = 1;

    const inicio = (paginaActual - 1) * librosPorPagina;
    const fin = inicio + librosPorPagina;
    const librosPaginados = librosFiltrados.slice(inicio, fin);

    // Limpiar grid
    booksGrid.innerHTML = '';

    // Caso: No hay resultados en búsqueda o filtro
    if (librosFiltrados.length === 0) {
        booksGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <h3>No se encontraron libros que coincidan con tu búsqueda.</h3>
            <p>Intenta con otro término o categoría.</p>
        </div>`;
        pagination.innerHTML = '';
        return;
    }

    // Renderizar tarjetas de libros
    librosPaginados.forEach(libro => {
        // Verificar si hay stock
        const sinStock = libro.stock <= 0;
        
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${libro.img}" alt="${libro.titulo}" class="book-image">
            <h3 class="book-title">${libro.titulo}</h3>
            <p class="book-author">${libro.autor}</p>
            <p class="book-price">$${libro.precio.toFixed(2)}</p>
            <button class="btn-add" onclick="agregarAlCarrito(${libro.id})" ${sinStock ? 'disabled' : ''}>
                ${sinStock ? 'Agotado' : 'Agregar al carrito'}
            </button>
        `;
        booksGrid.appendChild(card);
    });

    renderPaginacion(totalPaginas);
}

// 2. Renderizar botones de paginación
function renderPaginacion(totalPaginas) {
    pagination.innerHTML = '';
    if (totalPaginas <= 1) return; // No mostrar paginación si solo hay 1 página

    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === paginaActual ? 'active' : ''}`;
        btn.innerText = i;
        btn.onclick = () => {
            paginaActual = i;
            renderLibros();
        };
        pagination.appendChild(btn);
    }
}

// 3. Agregar al Carrito
window.agregarAlCarrito = (id) => {
    const libro = libros.find(l => l.id === id);
    
    // Verificar stock nuevamente por seguridad
    if (libro.stock <= 0) {
        alert("Lo sentimos, este libro está agotado.");
        return;
    }

    // Verificar si ya está en el carrito
    const itemEnCarrito = carrito.find(item => item.id === id);
    
    if (itemEnCarrito) {
        // Validar que no supere el stock disponible
        if (itemEnCarrito.cantidad < libro.stock) {
            itemEnCarrito.cantidad++;
        } else {
            alert("No hay más ejemplares disponibles en stock.");
            return;
        }
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }

    actualizarContador();
};

// 4. Actualizar Contador del Header
function actualizarContador() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    cartCount.innerText = totalItems;
}

// 5. Mostrar Carrito (Modal)
function abrirCarrito() {
    cartModal.style.display = "block";
    renderCarrito();
}

// 6. Renderizar contenido del carrito
function renderCarrito() {
    cartItemsContainer.innerHTML = '';
    
    // Caso: Carrito vacío
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
        cartTotal.innerText = "Total: $0.00";
        document.getElementById('checkoutBtn').disabled = true;
        document.getElementById('checkoutBtn').style.opacity = '0.5';
        return;
    }

    let total = 0;
    document.getElementById('checkoutBtn').disabled = false;
    document.getElementById('checkoutBtn').style.opacity = '1';

    // Recorrer items del carrito
    carrito.forEach(item => {
        const libro = libros.find(l => l.id === item.id);
        const subtotal = libro.precio * item.cantidad;
        total += subtotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${libro.titulo}</div>
                <div class="cart-item-price">$${libro.precio} x ${item.cantidad} = $${subtotal.toFixed(2)}</div>
            </div>
            <div class="cart-controls">
                <button class="btn-remove" onclick="eliminarDelCarrito(${libro.id})"><i class="fas fa-trash"></i> Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = `Total: $${total.toFixed(2)}`;
}

// 7. Eliminar item del carrito
window.eliminarDelCarrito = (id) => {
    carrito = carrito.filter(item => item.id !== id);
    actualizarContador();
    renderCarrito();
};

// 8. Vaciar Carrito
document.getElementById('clearCartBtn').addEventListener('click', () => {
    if(confirm("¿Estás seguro de vaciar el carrito?")) {
        carrito = [];
        actualizarContador();
        renderCarrito();
    }
});

// 9. Proceder al Pago
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (carrito.length === 0) return; // No hacer nada si está vacío
    alert("Gracias por tu compra. Redirigiendo a pasarela de pago...");
    carrito = [];
    actualizarContador();
    renderCarrito();
    cartModal.style.display = "none";
});

// --- EVENT LISTENERS ---

// Búsqueda en tiempo real
searchInput.addEventListener('input', (e) => {
    terminoBusqueda = e.target.value;
    paginaActual = 1; // Resetear a página 1 al buscar
    renderLibros();
});

// Filtros de Categoría
filterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        // Cambiar clase activa visualmente
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Aplicar filtro
        filtroCategoria = e.target.dataset.category;
        paginaActual = 1;
        renderLibros();
    }
});

// Abrir Modal Carrito
document.getElementById('cartBtn').addEventListener('click', abrirCarrito);

// Cerrar Modal (Icono X)
document.querySelector('.close').addEventListener('click', () => {
    cartModal.style.display = "none";
});

// Cerrar Modal (Click fuera del cuadro)
window.addEventListener('click', (e) => {
    if (e.target == cartModal) {
        cartModal.style.display = "none";
    }
});

// --- INICIALIZACIÓN ---
// Renderizar los libros al cargar la página
renderLibros();