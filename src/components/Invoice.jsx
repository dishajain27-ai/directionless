import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Printer, ArrowLeft, ArrowDownToLine } from 'lucide-react';

export default function Invoice({ 
  orderId, 
  paymentDetails, 
  cartItems, 
  totalAmount, 
  onClose 
}) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;

  // Trigger celebration confetti on mount
  useEffect(() => {
    // Run three bursts of confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#D4AF37', '#7A5CFF', '#ffffff']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#D4AF37', '#7A5CFF', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text receipt
    const separator = '='.repeat(40);
    const date = new Date().toLocaleDateString();
    
    let text = `${separator}\n`;
    text += `          DIRECTIONLESS\n`;
    text += `       Luxury Makeup Portal\n`;
    text += `${separator}\n`;
    text += `Order ID : ${orderId}\n`;
    text += `Date     : ${date}\n`;
    text += `Payment  : ${paymentDetails.method} (${paymentDetails.summary})\n`;
    text += `Payer    : ${paymentDetails.payer}\n`;
    text += `${separator}\n\n`;
    text += `ITEMS:\n`;
    
    cartItems.forEach(item => {
      text += `- ${item.name}\n  Qty: ${item.quantity} x Rs.${item.price} = Rs.${(item.quantity * item.price).toLocaleString('en-IN')}\n`;
    });
    
    text += `\n${separator}\n`;
    text += `Subtotal : Rs.${subtotal.toLocaleString('en-IN')}\n`;
    text += `Tax (8%) : Rs.${tax.toLocaleString('en-IN')}\n`;
    text += `Shipping : ${shipping === 0 ? 'FREE' : `Rs.${shipping.toLocaleString('en-IN')}`}\n`;
    text += `${separator}\n`;
    text += `Total    : Rs.${totalAmount.toLocaleString('en-IN')}\n`;
    text += `${separator}\n`;
    text += `\nThank you for shopping with DIRECTIONLESS.\n`;
    text += `Crafted for the aesthetic vanguard.\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `directionless_invoice_${orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="invoice-container-wrapper">
      {/* Top action header (hidden during printing) */}
      <div className="invoice-actions no-print">
        <button className="btn-outline back-btn" onClick={onClose}>
          <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          Back to storefront
        </button>
        
        <div className="action-right">
          <button className="btn-outline" onClick={handleDownload}>
            <ArrowDownToLine size={16} style={{ marginRight: '8px' }} />
            Download TXT
          </button>
          <button className="btn-gold" onClick={handlePrint}>
            <Printer size={16} style={{ marginRight: '8px' }} />
            Print Receipt
          </button>
        </div>
      </div>

      {/* Invoice Receipt Body */}
      <div className="invoice-card glassmorphism print-area">
        {/* Confirmed Icon */}
        <div className="invoice-confirmed-icon no-print">
          <CheckCircle2 size={44} className="gold-text float-medium" />
          <h2>Order Confirmed</h2>
          <p>Your transaction has been processed securely.</p>
        </div>

        {/* Invoice Branding Header */}
        <div className="invoice-header">
          <div>
            <h1 className="brand-title">DIRECTIONLESS</h1>
            <p className="brand-subtitle">L’Éclipse Cosmétique Vault</p>
          </div>
          <div className="invoice-meta">
            <div>
              <span className="meta-label">INVOICE ID:</span>
              <span className="meta-val">{orderId}</span>
            </div>
            <div>
              <span className="meta-label">DATE:</span>
              <span className="meta-val">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div className="invoice-divider"></div>

        {/* Transaction details */}
        <div className="invoice-billing">
          <div>
            <h3>Billed To:</h3>
            <p className="billing-name">{paymentDetails.payer}</p>
            {paymentDetails.method === 'COD' && (
              <>
                <p className="billing-address">{paymentDetails.address}</p>
                <p className="billing-phone">Ph: {paymentDetails.phone}</p>
              </>
            )}
          </div>
          <div className="billing-payment-method">
            <h3>Method of Payment:</h3>
            <p>{paymentDetails.method}</p>
            <span className="payment-summary">{paymentDetails.summary}</span>
          </div>
        </div>

        {/* Items Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th className="align-right">Qty</th>
              <th className="align-right">Unit Price</th>
              <th className="align-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className="table-item-name">{item.name}</span>
                  <span className="table-item-category">{item.category}</span>
                </td>
                <td className="align-right">{item.quantity}</td>
                <td className="align-right">₹{item.price.toLocaleString('en-IN')}</td>
                <td className="align-right">₹{(item.quantity * item.price).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="invoice-totals">
          <div className="totals-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="totals-row">
            <span>Taxes (8%)</span>
            <span>₹{tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="totals-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
          </div>
          <div className="totals-divider"></div>
          <div className="totals-row grand-total">
            <span>Grand Total</span>
            <span className="gold-text">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="invoice-footer">
          <p>This invoice is electronically signed and secured using secure transaction cryptographic standards.</p>
          <p className="footer-tagline">DIRECTIONLESS — Crafted for the aesthetic vanguard.</p>
        </div>
      </div>
    </div>
  );
}
