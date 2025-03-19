import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './PaymentResult.scss';

const API_URL = 'https://pregnancy-growth-tracking-web-api-a6hxfqhsenaagthw.australiasoutheast-01.azurewebsites.net';

const PaymentResultCard = ({ onBackHome, onRetry }) => {
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [vnpayDetails, setVnpayDetails] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const vnpayInfo = {
          amount: params.get('vnp_Amount'),
          bankCode: params.get('vnp_BankCode'),
          bankTranNo: params.get('vnp_BankTranNo'),
          cardType: params.get('vnp_CardType'),
          orderInfo: params.get('vnp_OrderInfo'),
          payDate: params.get('vnp_PayDate'),
          transactionNo: params.get('vnp_TransactionNo'),
          responseCode: params.get('vnp_ResponseCode'),
          transactionStatus: params.get('vnp_TransactionStatus'),
          txnRef: params.get('vnp_TxnRef')
        };
        setVnpayDetails(vnpayInfo);

        if (vnpayInfo.responseCode === '00') {
          const response = await axios.get(`${API_URL}/api/Payment/payment-callback${location.search}`);
          
          if (response.data.success) {
            setPaymentSuccess(true);
            setPaymentDetails(response.data);
            localStorage.setItem('lastPaymentDetails', JSON.stringify(response.data));
          } else {
            setPaymentSuccess(false);
          }
        } else {
          setPaymentSuccess(false);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (location.search.includes('vnp_')) {
      verifyPayment();
    } else {
      const savedPayment = localStorage.getItem('lastPaymentDetails');
      if (savedPayment) {
        const paymentData = JSON.parse(savedPayment);
        setPaymentSuccess(true);
        setPaymentDetails(paymentData);
      }
      setLoading(false);
    }
  }, [location]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  if (loading) {
    return (
      <div className="payment-result">
        <div className="payment-status loading">
          <div className="status-icon">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <h2>Đang xác nhận thanh toán...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result">
      <div className="payment-status">
        <div className="status-icon">
          {paymentSuccess ? (
            <i className="fas fa-check-circle"></i>
          ) : (
            <i className="fas fa-times-circle"></i>
          )}
        </div>
        <h2>{paymentSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}</h2>
        
        {paymentSuccess && paymentDetails && (
          <div className="payment-details">
            <h3>Chi tiết giao dịch</h3>
            <div className="detail-group">
              <div className="detail-item">
                <label>Số tiền:</label>
                <span className="amount">{formatCurrency(paymentDetails.amountVND)}</span>
              </div>
              <div className="detail-item">
                <label>Mã giao dịch:</label>
                <span className="transaction">{paymentDetails.transactionId}</span>
              </div>
              {vnpayDetails && (
                <>
                  <div className="detail-item">
                    <label>Số giao dịch:</label>
                    <span>{vnpayDetails.transactionNo}</span>
                  </div>
                  <div className="detail-item">
                    <label>Thời gian:</label>
                    <span>{formatDateTime(vnpayDetails.payDate)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngân hàng:</label>
                    <span>{vnpayDetails.bankCode}</span>
                  </div>
                  <div className="detail-item">
                    <label>Loại thẻ:</label>
                    <span>{vnpayDetails.cardType}</span>
                  </div>
                </>
              )}
              <div className="detail-item">
                <label>Gói thành viên:</label>
                <span className="membership">Gói {paymentDetails.membershipId}</span>
              </div>
            </div>
          </div>
        )}
        
        <p className="message">
          {paymentSuccess
            ? 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Hóa đơn đã được gửi vào email của bạn.'
            : 'Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.'}
        </p>
        <div className="button-group">
          <button className="home-button" onClick={onBackHome}>
            Về trang chủ
          </button>
          {!paymentSuccess && (
            <button className="retry-button" onClick={onRetry}>
              Thử lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResultCard; 