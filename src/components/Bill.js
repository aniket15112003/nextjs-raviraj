'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const Bill = ({ register, payment }) => {
  const now = new Date();
  const router = useRouter();

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN');
  const formatCurrency = (value) => `₹ ${Number(value).toFixed(2)}`;

  const handlePrint = () => {
    window.print();
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="receipt">
      <header>
        <h4 className="text-center">Receipt</h4>
        <hr />
      </header>

      <table className="table-details">
        <tbody>
          <tr>
            <td><strong>Receipt ID:</strong></td>
            <td>#{register.id}</td>
          </tr>
          <tr>
            <td><strong>Date:</strong></td>
            <td>{formatDate(now)}</td>
          </tr>
          <tr>
            <td><strong>Payment ID:</strong></td>
            <td>{payment.id}</td>
          </tr>
          <tr>
            <td><strong>Payment Date:</strong></td>
            <td>{formatDate(payment.created_at)}</td>
          </tr>
          <tr>
            <td><strong>Amount Paid:</strong></td>
            <td>{formatCurrency(payment.amount)}</td>
          </tr>
        </tbody>
      </table>

      <h4 className="text-center">Registration Details</h4>

      <table className="customer-details">
        <tbody>
          <tr>
            <td><strong>Name:</strong></td>
            <td>{register.name}</td>
          </tr>
          <tr>
            <td><strong>Email:</strong></td>
            <td>{register.email || '-'}</td>
          </tr>
          <tr>
            <td><strong>Mobile:</strong></td>
            <td>{register.mobile}</td>
          </tr>
          <tr>
            <td><strong>City:</strong></td>
            <td>{register.city}</td>
          </tr>
          <tr>
            <td><strong>People:</strong></td>
            <td>{register.people}</td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-4">
        <p><strong>Thank you for your registration!</strong></p>
        <p style={{ color: 'red' }}>Please take a screenshot of this receipt as proof of registration.</p>
      </div>

      <div className="text-center button-group">
        <button onClick={handlePrint}>🖨️ Print Receipt</button>
        <button onClick={goHome} style={{ marginLeft: '10px' }}>🏠 Go to Home</button>
      </div>

      <style jsx>{`
        .receipt {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .text-center {
          text-align: center;
        }

        .table-details,
        .customer-details {
          width: 100%;
          margin-bottom: 20px;
          border-collapse: collapse;
        }

        td {
          padding: 10px;
          vertical-align: top;
          border: 1px solid #ccc;
        }

        .button-group {
          margin-top: 20px;
        }

        button {
          padding: 8px 16px;
          font-size: 16px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        button:hover {
          background-color: #005bb5;
        }

        @media (max-width: 300px) {
          .receipt {
            padding: 10px;
          }

          td {
            font-size: 14px;
          }

          button {
            width: 100%;
            margin-top: 10px;
          }
        }

        @media print {
          .button-group {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Bill;
