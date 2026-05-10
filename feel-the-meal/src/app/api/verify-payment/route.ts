import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = body;

    // Verify Signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed: Invalid signature" },
        { status: 400 }
      );
    }

    // Initialize Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!resendApiKey || !adminEmail) {
      console.error("Missing Resend API Key or Admin Email in environment variables.");
      // Even if email fails, payment was successful. But we should log it.
      return NextResponse.json({ success: true, warning: "Email not sent (missing config)" });
    }

    const resend = new Resend(resendApiKey);

    // Format the email content
    const { name, phone, address, state, items, totalPaid, orderDate } = orderDetails;

    const itemsHtml = items
      .map(
        (item: any) =>
          `<li><strong>${item.quantity}x ${item.product.name}</strong> - Rs. ${
            item.product.price * item.quantity
          }</li>`
      )
      .join("");

    const emailHtml = `
      <h2>New Order Received! 🎂</h2>
      <p><strong>Date/Time:</strong> ${new Date(orderDate).toLocaleString()}</p>
      <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
      
      <h3>Customer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Address:</strong> ${address}</li>
        <li><strong>State:</strong> ${state}</li>
      </ul>

      <h3>Order Summary:</h3>
      <ul>
        ${itemsHtml}
      </ul>
      <h3 style="color: #c9a96e;">Total Paid: Rs. ${totalPaid}</h3>
    `;

    // Send Email
    await resend.emails.send({
      from: "Feel The Meal <onboarding@resend.dev>", // Replace with your verified domain if available
      to: adminEmail,
      subject: `New Order from ${name} - Rs. ${totalPaid}`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Payment verification/email error:", error);
    return NextResponse.json(
      { error: "Server error during verification" },
      { status: 500 }
    );
  }
}
