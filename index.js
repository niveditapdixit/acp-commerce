const express = require("express");
const bodyParser = require("body-parser");
const products = require("./products");

const app = express();
app.use(bodyParser.json());

// ACP Discovery Endpoint
app.get("/.well-known/ai-plugin.json", (req, res) => {
  res.json({
    schema_version: "v1",
    name_for_human: "My AI Shop",
    name_for_model: "my_ai_shop",
    description_for_human: "Shop for AI gadgets and accessories.",
    description_for_model: "Use this plugin to discover and purchase AI gadgets.",
    auth: { type: "none" },
    api: {
      type: "openapi",
      url: "http://localhost:3000/openapi.yaml"
    },
    logo_url: "http://localhost:3000/logo.png",
    contact_email: "support@myshop.com",
    legal_info_url: "http://localhost:3000/legal"
  });
});

// Product Discovery
app.get("/products", (req, res) => {
  res.json({ products });
});

// Checkout Flow
app.post("/checkout", (req, res) => {
  const { product_id, quantity } = req.body;
  const product = products.find(p => p.id === product_id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const total = product.price * quantity;
  const order = {
    order_id: `order-${Date.now()}`,
    product,
    quantity,
    total,
    currency: product.currency,
    status: "pending_payment"
  };

  res.json(order);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`ACP server running at http://localhost:${PORT}`));