# PayFast Payment Integration Setup

## 🚀 **PayFast Integration Overview**

This integration provides secure payment processing for Nazakat Nail Store using PayFast gateway.

## 📋 **Prerequisites**

1. **PayFast Account**: Apply for a PayFast merchant account
2. **Merchant Credentials**: Get your Merchant ID and Merchant Key
3. **SSL Certificate**: Required for production (webhook URLs must be HTTPS)

## ⚙️ **Configuration Steps**

### 1. **Update Environment Variables**

Update your `.env` file in the backend folder:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=your_merchant_id_here
PAYFAST_MERCHANT_KEY=your_merchant_key_here
PAYFAST_PASSPHRASE=your_passphrase_here
PAYFAST_RETURN_URL=http://localhost:5173/payment/success
PAYFAST_CANCEL_URL=http://localhost:5173/payment/cancel
PAYFAST_NOTIFY_URL=http://localhost:3000/api/payment/notify
FRONTEND_URL=http://localhost:5173
```

### 2. **PayFast Dashboard Configuration**

In your PayFast merchant dashboard, configure:

- **Return URL**: `http://yourdomain.com/payment/success`
- **Cancel URL**: `http://yourdomain.com/payment/cancel`
- **Notify URL**: `http://yourdomain.com/api/payment/notify`

⚠️ **Important**: For production, URLs must be HTTPS

### 3. **Testing Configuration**

For development/testing:
- Use sandbox credentials provided by PayFast
- Test URLs can be HTTP (localhost)
- PayFast provides test card numbers for testing

## 🛠 **Implementation Features**

### **Backend Features**
- ✅ PayFast payment data generation
- ✅ Secure signature validation
- ✅ Webhook handling for payment notifications
- ✅ Order status updates
- ✅ Email confirmations
- ✅ Payment verification

### **Frontend Features**
- ✅ Secure checkout page
- ✅ Customer information collection
- ✅ Order summary display
- ✅ Payment success page
- ✅ Payment cancellation page
- ✅ Real-time payment status checking

## 💳 **Payment Flow**

1. **Customer adds items to cart**
2. **Customer clicks "Checkout"**
3. **Customer fills billing information**
4. **System creates PayFast payment**
5. **Customer redirected to PayFast**
6. **Customer completes payment**
7. **PayFast sends webhook notification**
8. **System updates order status**
9. **Customer redirected to success page**
10. **Confirmation email sent**

## 🔒 **Security Features**

- **Signature Validation**: All PayFast communications validated
- **HTTPS Enforcement**: Production webhooks require HTTPS
- **Input Sanitization**: All customer data sanitized
- **XSS Protection**: Frontend protected against XSS
- **CSRF Protection**: Forms protected against CSRF

## 📧 **Email Notifications**

Automatic emails sent for:
- Order confirmation
- Payment confirmation
- Payment failure notifications

## 🧪 **Testing**

### **Test Card Numbers (PayFast Sandbox)**
- **Visa**: 4000000000000002
- **Mastercard**: 5200000000000007
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### **Test Scenarios**
1. **Successful Payment**: Use test card numbers
2. **Failed Payment**: Use card number 4000000000000010
3. **Cancelled Payment**: Click cancel on PayFast page

## 🚀 **Deployment Checklist**

### **Before Going Live**
- [ ] Replace sandbox credentials with live credentials
- [ ] Update webhook URLs to HTTPS
- [ ] Test all payment scenarios
- [ ] Verify email notifications
- [ ] Set up SSL certificate
- [ ] Update CORS settings for production domain

### **Environment Variables for Production**
```env
NODE_ENV=production
PAYFAST_MERCHANT_ID=your_live_merchant_id
PAYFAST_MERCHANT_KEY=your_live_merchant_key
PAYFAST_RETURN_URL=https://yourdomain.com/payment/success
PAYFAST_CANCEL_URL=https://yourdomain.com/payment/cancel
PAYFAST_NOTIFY_URL=https://yourdomain.com/api/payment/notify
FRONTEND_URL=https://yourdomain.com
```

## 📊 **Monitoring & Analytics**

- **Order Status Tracking**: Monitor in `/orders` page
- **Payment Logs**: Check server logs for webhook events
- **PayFast Dashboard**: Monitor transactions in PayFast portal

## 🆘 **Troubleshooting**

### **Common Issues**
1. **Invalid Signature**: Check merchant credentials and passphrase
2. **Webhook Not Received**: Verify notify URL is accessible
3. **Payment Fails**: Check PayFast account status and limits
4. **CORS Errors**: Update CORS settings for payment domains

### **Debug Mode**
Enable debug logging by adding to your environment:
```env
DEBUG=payfast:*
```

## 📞 **Support**

- **PayFast Support**: support@payfast.co.za
- **Technical Issues**: Check server logs and PayFast documentation
- **Integration Help**: Refer to PayFast API documentation

## 🔄 **Updates & Maintenance**

- Regularly check PayFast API updates
- Monitor webhook delivery success rates
- Update security certificates before expiry
- Test payment flow after any system updates

---

## 🎉 **Ready to Go!**

Your PayFast integration is now ready. Test thoroughly before going live!
