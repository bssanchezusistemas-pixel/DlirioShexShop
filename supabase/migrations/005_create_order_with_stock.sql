-- Atomic order creation with stock decrement

CREATE OR REPLACE FUNCTION create_order_with_stock(
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_delivery_type delivery_type,
  p_delivery_address TEXT,
  p_whatsapp_message TEXT,
  p_total_amount INTEGER,
  p_items JSONB
)
RETURNS UUID AS $$
DECLARE
  v_customer_id UUID;
  v_order_id UUID;
  item RECORD;
  agg RECORD;
BEGIN
  INSERT INTO customers (name, phone)
  VALUES (p_customer_name, p_customer_phone)
  RETURNING id INTO v_customer_id;

  INSERT INTO orders (
    customer_id, total_amount, delivery_type, delivery_address, status, whatsapp_message
  )
  VALUES (
    v_customer_id, p_total_amount, p_delivery_type, p_delivery_address, 'pending', p_whatsapp_message
  )
  RETURNING id INTO v_order_id;

  -- Decrement stock once per product (aggregated quantities)
  FOR agg IN
    SELECT product_id, SUM(quantity)::INTEGER AS total_qty
    FROM jsonb_to_recordset(p_items) AS x(
      product_id TEXT,
      product_name TEXT,
      quantity INTEGER,
      unit_price INTEGER,
      size_label TEXT
    )
    WHERE product_id IS NOT NULL
    GROUP BY product_id
  LOOP
    UPDATE products
    SET stock = stock - agg.total_qty
    WHERE id = agg.product_id
      AND consult_only = false
      AND stock >= agg.total_qty;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'stock_insufficient:%', agg.product_id;
    END IF;
  END LOOP;

  -- Insert line items
  FOR item IN
    SELECT *
    FROM jsonb_to_recordset(p_items) AS x(
      product_id TEXT,
      product_name TEXT,
      quantity INTEGER,
      unit_price INTEGER,
      size_label TEXT
    )
  LOOP
    INSERT INTO order_items (
      order_id, product_id, product_name, quantity, unit_price, size_label
    )
    VALUES (
      v_order_id,
      item.product_id,
      item.product_name,
      item.quantity,
      item.unit_price,
      item.size_label
    );
  END LOOP;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION restore_order_stock(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN
    SELECT product_id, SUM(quantity)::INTEGER AS total_qty
    FROM order_items
    WHERE order_id = p_order_id AND product_id IS NOT NULL
    GROUP BY product_id
  LOOP
    UPDATE products
    SET stock = stock + item.total_qty
    WHERE id = item.product_id AND consult_only = false;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
