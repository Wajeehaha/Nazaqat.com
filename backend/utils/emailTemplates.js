const generateOrderConfirmationEmail = (user, order, cartItems, totalAmount) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const itemsHtml = cartItems.map(item => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 16px 8px; text-align: left;">
        <div style="display: flex; align-items: center;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 12px;">
          <div>
            <h3 style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">${item.name}</h3>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">${item.description || 'Premium nail product'}</p>
          </div>
        </div>
      </td>
      <td style="padding: 16px 8px; text-align: center; color: #6b7280;">
        ${item.quantity}
      </td>
      <td style="padding: 16px 8px; text-align: right; color: #111827; font-weight: 600;">
        Rs. ${item.price}
      </td>
      <td style="padding: 16px 8px; text-align: right; color: #111827; font-weight: 600;">
        Rs. ${item.totalPrice}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - Nazakat Nails</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9fafb;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 700;
        }
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #111827;
            margin-bottom: 24px;
        }
        .order-info {
            background-color: #f3f4f6;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .order-info h2 {
            color: #111827;
            font-size: 20px;
            margin-bottom: 12px;
        }
        .order-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .detail-label {
            color: #6b7280;
            font-weight: 500;
        }
        .detail-value {
            color: #111827;
            font-weight: 600;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .items-table th {
            background-color: #f9fafb;
            padding: 16px 8px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }
        .total-section {
            background-color: #111827;
            color: white;
            padding: 24px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .total-row:last-child {
            margin-bottom: 0;
            font-size: 20px;
            font-weight: 700;
            padding-top: 16px;
            border-top: 1px solid #374151;
        }
        .message {
            background-color: #fef3e2;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        .message p {
            color: #92400e;
            font-weight: 500;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .social-links {
            margin-top: 16px;
        }
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #ec4899;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 16px 0;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #be185d;
        }
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .order-details {
                grid-template-columns: 1fr;
            }
            .items-table th,
            .items-table td {
                padding: 12px 4px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>Order Confirmed! 💅</h1>
            <p>Your beautiful nail products are on their way</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hi ${user.name || 'Valued Customer'}, 👋
            </div>
            
            <p style="color: #6b7280; margin-bottom: 24px;">
                Thank you for your order! We're excited to help you achieve stunning nails with our premium products. 
                Your order has been confirmed and is being processed.
            </p>

            <!-- Order Information -->
            <div class="order-info">
                <h2>📋 Order Information</h2>
                <div class="order-details">
                    <div class="detail-item">
                        <span class="detail-label">Order ID:</span>
                        <span class="detail-value">#${order._id.toString().slice(-8).toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${currentDate}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value" style="color: #059669;">Processing</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Customer:</span>
                        <span class="detail-value">${user.name}</span>
                    </div>
                </div>
            </div>

            <!-- Order Items -->
            <h2 style="color: #111827; margin-bottom: 16px;">🛍️ Your Items</h2>
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="text-align: left;">Product</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Price</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <!-- Total Section -->
            <div class="total-section">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>Rs. ${totalAmount}</span>
                </div>
                <div class="total-row">
                    <span>Shipping:</span>
                    <span>FREE</span>
                </div>
                <div class="total-row">
                    <span>Total Amount:</span>
                    <span>Rs. ${totalAmount}</span>
                </div>
            </div>

            <!-- Message -->
            <div class="message">
                <p>
                    <strong>🚚 Shipping Information:</strong><br>
                    Your order will be processed within 1-2 business days and shipped via our premium delivery service. 
                    You'll receive a tracking number once your order ships.
                </p>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">Track Your Order</a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                If you have any questions about your order, please don't hesitate to contact our customer support team. 
                We're here to help you achieve the perfect nails!
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Nazakat Nail Store</strong></p>
            <p>Your destination for premium nail products</p>
            <p>📧 support@nazakat.com | 📞 +1 (555) 123-4567</p>
            
            <div class="social-links">
                <a href="#">Follow us on Instagram</a> |
                <a href="#">Facebook</a> |
                <a href="#">Twitter</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                © ${new Date().getFullYear()} Nazakat Nail Store. All rights reserved.<br>
                This email was sent to ${user.email}
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

const generateWelcomeEmail = (user) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Nazakat Nails</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9fafb;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
            color: white;
            padding: 50px 30px;
            text-align: center;
        }
        .content {
            padding: 40px 30px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .button {
            display: inline-block;
            background-color: #ec4899;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 16px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1 style="font-size: 32px; margin-bottom: 16px;">Welcome to Nazakat! 💅✨</h1>
            <p style="font-size: 18px; opacity: 0.9;">Your journey to beautiful nails starts here</p>
        </div>
        
        <div class="content">
            <h2 style="color: #111827; margin-bottom: 16px;">Hi ${user.name}, 👋</h2>
            
            <p style="color: #6b7280; margin-bottom: 24px;">
                Welcome to Nazakat Nail Store! We're thrilled to have you join our community of nail enthusiasts. 
                Get ready to discover premium nail products across our 4 specialized categories.
            </p>
            
            <div style="background-color: #fef3e2; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <h3 style="color: #92400e; margin-bottom: 12px;">🎯 Explore Our Collections:</h3>
                <ul style="color: #92400e; padding-left: 20px;">
                    <li>💎 Gel Nails - Long-lasting shine</li>
                    <li>🎨 Acrylic Nails - Professional extensions</li>
                    <li>✨ Nail Art - Creative designs</li>
                    <li>🌿 Nail Care - Health & maintenance</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="#" class="button">Start Shopping</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
                As a new member, you'll receive exclusive offers, nail care tips, and be the first to know about new arrivals!
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Nazakat Nail Store</strong></p>
            <p style="color: #6b7280; font-size: 14px;">Your destination for premium nail products</p>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = { generateOrderConfirmationEmail, generateWelcomeEmail };
