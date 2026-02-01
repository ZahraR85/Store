import Cart from "../models/Cart.js";

// ------------------ ADD ITEM TO CART ------------------
export const addToCart = async (req, res) => {
  const { productId, size, color } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === (size || null) &&
        item.color === (color || null)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        size: size || null,
        color: color || null,
        quantity: 1,
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    // populate product details before sending
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Add to cart failed" });
  }
};

// ------------------ GET USER CART ------------------
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    res.json(cart || { items: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

// ------------------ REMOVE ITEM FROM CART ------------------
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    cart.updatedAt = Date.now();
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Remove failed" });
  }
};

// ------------------ UPDATE ITEM QUANTITY ------------------
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    cart.updatedAt = Date.now();

    await cart.save();

    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

// ------------------ CLEAR CART ------------------
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], updatedAt: Date.now() },
      { new: true }
    ).populate("items.product");

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Clear cart failed" });
  }
};
