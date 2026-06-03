import { useState, useEffect } from 'react';
import { X, Package, Truck, CheckCircle2, Navigation, Calendar, ArrowLeft, ArrowRight, Eye, ShieldCheck } from 'lucide-react';

export default function OrdersModal({ isOpen, onClose, orders, user, onOpenAuth }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [acceleratedOffsets, setAcceleratedOffsets] = useState({});

  if (!isOpen) return null;

  // Reset tracking view on modal close
  const handleClose = () => {
    setSelectedOrder(null);
    onClose();
  };

  const getOrderOffset = (orderId) => {
    return acceleratedOffsets[orderId] || 0;
  };

  const accelerateTransit = (orderId) => {
    setAcceleratedOffsets(prev => ({
      ...prev,
      [orderId]: (prev[orderId] || 0) + 90000 // Add 90 seconds (1.5 minutes) of simulated elapsed time
    }));
  };

  const getTrackingStatus = (order) => {
    const baseTime = order.timestamp || Date.now();
    const offset = getOrderOffset(order.id);
    const elapsedMinutes = (Date.now() - baseTime + offset) / (1000 * 60);

    // 5 Stages of Cosmic Logistics
    const stages = [
      {
        id: 1,
        title: "Vanguard Labs Hub",
        subtitle: "Order Confirmed",
        desc: "Formulation certified & prepared under vacuum parameters.",
        location: "Zero-Gravity Lab Hub (Bengaluru)",
        timeOffset: 0
      },
      {
        id: 2,
        title: "Dispatched Portal",
        subtitle: "Cosmic Cargo Handover",
        desc: "Departed from orbital containment warehouse.",
        location: "Orbit Gateway Portal (Mumbai)",
        timeOffset: 60 * 1000 * 30 // +30 mins
      },
      {
        id: 3,
        title: "In Transit",
        subtitle: "Logistics Flight Set",
        desc: "In transit through atmospheric logistics channel.",
        location: "Regional Sorting Facility (In Flight)",
        timeOffset: 60 * 1000 * 120 // +2 hours
      },
      {
        id: 4,
        title: "Local Depot Hub",
        subtitle: "Out for Delivery",
        desc: "Cosmic courier dispatched with pressurized container.",
        location: "Local Depot Centre (Destination City)",
        timeOffset: 60 * 1000 * 360 // +6 hours
      },
      {
        id: 5,
        title: "Destination Portal",
        subtitle: "Delivered",
        desc: "Safely received. Pressurization seals intact.",
        location: "Client Residence (Your Address)",
        timeOffset: 60 * 1000 * 720 // +12 hours
      }
    ];

    let activeStageIndex = 0;
    if (elapsedMinutes > 6.0) {
      activeStageIndex = 4; // Stage 5: Delivered
    } else if (elapsedMinutes > 3.5) {
      activeStageIndex = 3; // Stage 4: Out for Delivery
    } else if (elapsedMinutes > 1.5) {
      activeStageIndex = 2; // Stage 3: In Transit
    } else if (elapsedMinutes > 0.4) {
      activeStageIndex = 1; // Stage 2: Dispatched
    }

    return {
      stages,
      activeStageIndex,
      currentLocation: stages[activeStageIndex].location,
      currentDesc: stages[activeStageIndex].desc,
      statusLabel: stages[activeStageIndex].subtitle,
      percentComplete: (activeStageIndex / 4) * 100
    };
  };

  const formatFutureDate = (timestamp, timeOffsetMs) => {
    const d = new Date(timestamp + timeOffsetMs);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div 
        className="checkout-modal glassmorphism" 
        style={{ maxWidth: '650px', width: '100%', height: 'auto', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-area">
            {selectedOrder ? (
              <button 
                className="modal-close-btn" 
                style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }} 
                onClick={() => setSelectedOrder(null)}
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <Package size={20} className="gold-text" style={{ marginRight: '0.5rem' }} />
            )}
            <h2>{selectedOrder ? `Tracking Shipment #${selectedOrder.id.slice(-6)}` : "Cosmic Order Vault"}</h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-content" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {/* Guest / Unauthenticated State */}
          {!user ? (
            <div className="empty-orders-view">
              <Package size={48} className="empty-icon gold-text" />
              <h3>Identify Your Coordinates</h3>
              <p>Sign in to view your zero-gravity order logs, dispatch manifests, and route coordinates.</p>
              <button 
                className="btn-gold" 
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  onOpenAuth();
                  onClose();
                }}
              >
                Authenticate Coordinates
              </button>
            </div>
          ) : orders.length === 0 ? (
            /* Empty Orders State */
            <div className="empty-orders-view">
              <Package size={48} className="empty-icon" />
              <h3>Orbit Vault Empty</h3>
              <p>You have not placed any zero-gravity cosmetics orders yet. Acquire items to initiate dispatch trajectories.</p>
            </div>
          ) : !selectedOrder ? (
            /* Orders Listing View */
            <div className="orders-list-container">
              <p className="orders-intro-text">
                Logged in as <span className="gold-text">{user.name}</span>. Select a manifest below to inspect shipment progress.
              </p>
              <div className="orders-cards-stack">
                {orders.map((order) => {
                  const tracking = getTrackingStatus(order);
                  return (
                    <div key={order.id} className="order-history-card glassmorphism-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-id-tag">#{order.id}</span>
                          <span className="order-date-tag">{order.date}</span>
                        </div>
                        <span className={`status-badge stage-${tracking.activeStageIndex + 1}`}>
                          {tracking.statusLabel.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="order-items-preview">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="preview-item-row">
                            <span className="preview-item-name">{item.name}</span>
                            <span className="preview-item-qty">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-card-footer">
                        <div className="order-total-block">
                          <span className="lbl">TOTAL</span>
                          <span className="val gold-text">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                        <button 
                          className="btn-gold-sm"
                          style={{ padding: '0.6rem 1.2rem', gap: '0.5rem' }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye size={14} />
                          Track Manifest
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Order Tracking Timeline & Route Map View */
            (() => {
              const tracking = getTrackingStatus(selectedOrder);
              return (
                <div className="order-tracking-view">
                  {/* Accelerate / Speed up simulation controls */}
                  <div className="tracker-accelerator-banner">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span className="lbl gold-text">COSMIC LOGISTICS SIMULATOR</span>
                      <p className="desc">Transit takes 12 hours. Fast-forward to test tracking updates in real time.</p>
                    </div>
                    <button 
                      className="accelerate-btn" 
                      onClick={() => accelerateTransit(selectedOrder.id)}
                      disabled={tracking.activeStageIndex === 4}
                    >
                      Fast-Forward Orbit
                    </button>
                  </div>

                  {/* Shipment Coordinates Status Info */}
                  <div className="shipment-status-card glassmorphism-card">
                    <div className="info-grid">
                      <div>
                        <span className="label">CURRENT COORDINATES</span>
                        <h4 className="value gold-text">{tracking.currentLocation}</h4>
                      </div>
                      <div>
                        <span className="label">STATUS BRIEF</span>
                        <h4 className="value">{tracking.statusLabel}</h4>
                      </div>
                    </div>
                    <p className="status-narrative">{tracking.currentDesc}</p>
                  </div>

                  {/* Orbital Route Map (Abstract CSS Visual Diagram) */}
                  <div className="orbital-map-container">
                    <span className="label">DISPATCH ROUTE PLAN</span>
                    <div className="orbital-map">
                      {/* Starry nodes */}
                      <div className="map-node node-start checked">
                        <span className="node-lbl">Labs</span>
                      </div>
                      <div className={`map-node node-mid1 ${tracking.activeStageIndex >= 1 ? 'checked' : ''}`}>
                        <span className="node-lbl">Portal</span>
                      </div>
                      <div className={`map-node node-mid2 ${tracking.activeStageIndex >= 2 ? 'checked' : ''}`}>
                        <span className="node-lbl">Transit</span>
                      </div>
                      <div className={`map-node node-mid3 ${tracking.activeStageIndex >= 3 ? 'checked' : ''}`}>
                        <span className="node-lbl">Depot</span>
                      </div>
                      <div className={`map-node node-end ${tracking.activeStageIndex === 4 ? 'checked animate-glow' : ''}`}>
                        <span className="node-lbl">Home</span>
                      </div>

                      {/* Connection Route Line */}
                      <div className="map-route-line-bg"></div>
                      <div 
                        className="map-route-line-active" 
                        style={{ width: `${tracking.percentComplete}%` }}
                      ></div>
                      
                      {/* Orbit pulsing rocket dot */}
                      {tracking.activeStageIndex < 4 && (
                        <div 
                          className="map-orbit-dot gold-pulse" 
                          style={{ left: `calc(${tracking.percentComplete}% - 6px)` }}
                        >
                          <Navigation size={10} className="rocket-icon" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vertical Stepper Log */}
                  <div className="tracking-timeline">
                    <span className="label">CHRONO-LOG MANIFEST</span>
                    <div className="stepper-stack">
                      {tracking.stages.map((stage, idx) => {
                        const isCompleted = tracking.activeStageIndex >= idx;
                        const isCurrent = tracking.activeStageIndex === idx;
                        const timestamp = selectedOrder.timestamp || Date.now();
                        
                        return (
                          <div 
                            key={stage.id} 
                            className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                          >
                            <div className="step-left-marker">
                              <div className="step-icon-container">
                                {isCompleted ? (
                                  <CheckCircle2 size={16} className="gold-text" />
                                ) : isCurrent ? (
                                  <Truck size={14} className="current-icon" />
                                ) : (
                                  <div className="upcoming-dot" />
                                )}
                              </div>
                              {idx < 4 && <div className="step-connector-line" />}
                            </div>

                            <div className="step-content">
                              <div className="step-header">
                                <h4 className="step-title">{stage.title}</h4>
                                <span className="step-timestamp">
                                  {formatFutureDate(timestamp, stage.timeOffset)}
                                </span>
                              </div>
                              <span className="step-subtitle gold-text">{stage.subtitle}</span>
                              <p className="step-desc">{stage.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
