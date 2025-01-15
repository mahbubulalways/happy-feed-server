export type TPurchaseHtml = {
  payload: {
    name: string;
    paymentDate: Date;
    transaction_Id: string;
    amount: number;
    vat: number;
    orderStatusLink: string;
  };
};

const purchaseHtmlContent = ({ payload }: TPurchaseHtml): string => {
  const formattedDate = payload?.paymentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const totalAmount = payload?.amount + payload?.vat;

  return `
      <body style="margin: 0; height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column;   background-color: #F4F4F4; ">
        <div style="max-width: 400px;  max-height: 550px;  background-color: white; width:100%;  height: 100%; box-sizing: border-box; margin:auto;padding:20px ">
            <div style="text-align: center;">
                <div style="font-size: 56px; color: #047857;">&#10004;</div>
            </div>
                <h1 style="text-align: center; font-size: 24px; font-weight: bold; color: #1669a1; margin-top: 10px;">Payment Successful</h1>
                <p style="text-align: center; font-size: 14px; font-weight: 300; color: #6b7280; margin-bottom: 10px;">
                    Thank you for your purchase, ${
                      payload?.name
                    }. Your order is being processed.
                </p>
                <div style="border-top: 1px solid #e0e0e0; margin: 20px 0;"></div>
                <h1 style="font-size: 18px; font-weight: 500; margin-bottom: 10px;">Order Summary</h1>
                <div style="display: flex; justify-content: space-between; gap: 20px; font-size: 15px; font-weight: 300; margin-top: 6px;">
                    <span>Payment Status:</span>
                    <span>Paid</span>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 20px; font-size: 15px; font-weight: 300; margin-top: 6px;">
                    <span>Payment Date:</span>
                    <span>${formattedDate}</span>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 20px; font-size: 15px; font-weight: 300; margin-top: 6px;">
                    <span>Transaction ID:</span>
                    <span>${payload?.transaction_Id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 20px; font-size: 15px; font-weight: 300; margin-top: 6px;">
                    <span>Amount:</span>
                    <span>TK ${payload?.amount.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 20px; font-size: 15px; font-weight: 300; margin-top: 6px;">
                    <span>VAT:</span>
                    <span>TK ${payload?.vat.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 20px; font-size: 15px; font-weight: 500; margin-top: 6px;">
                    <span>Total:</span>
                    <span>TK ${totalAmount.toFixed(2)}</span>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${
                      payload?.orderStatusLink
                    }" style="background-color: #1669a1; color: white; font-size: 15px; font-weight: 500; padding: 10px; width: 100%; text-align: center; border: none; border-radius: 4px; text-decoration: none; cursor: pointer;">View Order Status</a>
                </div>
          </div>
        </body>
      `;
};

export default purchaseHtmlContent;
