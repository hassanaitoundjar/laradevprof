# Database Setup for Products

## Supabase Table Creation

Run these SQL commands in your Supabase SQL Editor to create the products table:

```sql
-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  type VARCHAR(50) DEFAULT 'Service',
  payment_gateways TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Users can view their own products" ON products
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON products
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON products
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON products
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_status ON products(status);
```

## Products Table Structure

- **id**: UUID primary key
- **user_id**: Foreign key to auth.users
- **title**: Product name
- **price**: Product price (decimal)
- **currency**: Currency code (USD, EUR, etc.)
- **description**: Product description
- **type**: Product type (Service, Digital, Physical)
- **payment_gateways**: Array of enabled payment methods
- **custom_fields**: JSON array of custom fields
- **status**: Product status (draft, active, inactive)
- **created_at**: Creation timestamp
- **updated_at**: Last update timestamp

## Orders Table Setup

```sql
-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_title VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    customer_notes TEXT,
    seller_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger for orders
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_orders_updated_at();

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Sellers can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own orders" ON orders
    FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Allow order creation" ON orders
    FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

## Orders Table Structure

- **id**: UUID primary key
- **seller_id**: Foreign key to auth.users (product seller)
- **customer_email**: Customer's email address
- **customer_name**: Customer's full name
- **product_id**: Foreign key to products (nullable if product deleted)
- **product_title**: Product name at time of order
- **quantity**: Number of items ordered
- **unit_price**: Price per item
- **total_amount**: Total order amount
- **currency**: Currency code
- **payment_method**: Payment method used
- **payment_status**: Payment status (pending, paid, failed, refunded)
- **order_status**: Order fulfillment status (pending, processing, shipped, delivered, cancelled)
- **customer_notes**: Notes from customer
- **seller_notes**: Internal notes from seller
- **created_at**: Order creation timestamp
- **updated_at**: Last update timestamp

## Customers Table Setup

```sql
-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  last_order_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seller_id, email)
);

-- Add RLS policies for customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own customers" ON customers
  FOR ALL USING (auth.uid() = seller_id);

-- Add trigger for customers updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for customers

CREATE POLICY "Sellers can delete their own customers" ON customers
    FOR DELETE USING (auth.uid() = seller_id);

-- Create indexes for better performance
CREATE INDEX idx_customers_seller_id ON customers(seller_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);
```

## Queries Table Setup

```sql
-- Create queries table
CREATE TABLE queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'technical', 'billing', 'product', 'refund', 'complaint')),
  reply_message TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for queries
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own queries" ON queries
  FOR ALL USING (auth.uid() = seller_id);

-- Add trigger for queries updated_at
CREATE TRIGGER update_queries_updated_at
  BEFORE UPDATE ON queries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for queries
CREATE INDEX idx_queries_seller_id ON queries(seller_id);
CREATE INDEX idx_queries_customer_email ON queries(customer_email);
CREATE INDEX idx_queries_status ON queries(status);
CREATE INDEX idx_queries_priority ON queries(priority);
CREATE INDEX idx_queries_category ON queries(category);
CREATE INDEX idx_queries_created_at ON queries(created_at);
```

## Queries Table Structure

- **id**: UUID primary key
- **seller_id**: Foreign key to auth.users (seller)
- **customer_email**: Customer's email address
- **customer_name**: Customer's full name
- **subject**: Query subject/title
- **message**: Customer's message/inquiry
- **priority**: Query priority (low, medium, high, urgent)
- **status**: Query status (open, in_progress, resolved, closed)
- **category**: Query category (general, technical, billing, product, refund, complaint)
- **reply_message**: Seller's reply to the query
- **replied_at**: Timestamp when reply was sent
- **created_at**: Query creation timestamp
- **updated_at**: Last update timestamp

## Customers Table Structure

- **id**: UUID primary key
- **seller_id**: Foreign key to auth.users (seller)
- **email**: Customer's email address (unique per seller)
- **name**: Customer's full name
- **phone**: Customer's phone number
- **address**: Customer's street address
- **city**: Customer's city
- **country**: Customer's country
- **postal_code**: Customer's postal/zip code
- **total_orders**: Total number of orders placed
- **total_spent**: Total amount spent by customer
- **last_order_date**: Date of most recent order
- **notes**: Internal notes about customer
- **status**: Customer status (active, inactive, blocked)
- **created_at**: Customer creation timestamp
- **updated_at**: Last update timestamp

## Security

- Row Level Security (RLS) enabled
- Users can only access their own products
- Automatic user_id validation on all operations
