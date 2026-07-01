export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

export const validateProduct = (req, res, next) => {
  const { name, description, price, category, image, stock } = req.body;

  if (!name || !description || price === undefined || !category || !image || stock === undefined) {
    return res.status(400).json({ message: 'Name, description, price, category, image, and stock are required' });
  }

  if (price < 0) {
    return res.status(400).json({ message: 'Price cannot be negative' });
  }

  if (stock < 0) {
    return res.status(400).json({ message: 'Stock cannot be negative' });
  }

  next();
};
