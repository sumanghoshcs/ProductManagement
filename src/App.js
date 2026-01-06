import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

const API_URL = "https://fakestoreapi.com/products";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(API_URL);
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get("https://fakestoreapi.com/products/categories");
    setCategories(res.data);
  };

  /* ---------------- ADD / EDIT PRODUCT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // EDIT PRODUCT
      const res = await axios.put(`${API_URL}/${editingId}`, formData);
      setProducts(products.map((p) => (p.id === editingId ? res.data : p)));
      setEditingId(null);
    } else {
      // ADD PRODUCT
      const res = await axios.post(API_URL, formData);
      setProducts([res.data, ...products]);
    }

    setFormData({ title: "", price: "", category: "" });
  };

  /* ---------------- DELETE PRODUCT ---------------- */
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setProducts(products.filter((p) => p.id !== id));
  };

  /* ---------------- EDIT PRODUCT ---------------- */
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category,
    });
  };

  /* ---------------- SEARCH & FILTER ---------------- */
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Management Dashboard</h2>

      {/* ---------------- SEARCH & FILTER ---------------- */}
      <input
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginRight: "10px" }}
      />

      <select
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* ---------------- FORM ---------------- */}
      <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          required
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <input
          placeholder="Category"
          required
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      {/* ---------------- PRODUCT LIST ---------------- */}
      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
