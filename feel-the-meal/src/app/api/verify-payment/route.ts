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
    const { name, email, phone, address, state, items, totalPaid, orderDate } = orderDetails;

    const itemsHtml = items
      .map(
        (item: any) =>
          `<li><strong>${item.quantity}x ${item.product.name}</strong> - Rs. ${
            item.product.price * item.quantity
          }</li>`
      )
      .join("");

    // Admin Email HTML
    const adminEmailHtml = `
      <h2>New Order Received! 🎂</h2>
      <p><strong>Date/Time:</strong> ${new Date(orderDate).toLocaleString()}</p>
      <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
      
      <h3>Customer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
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

    // Customer Email HTML
    const customerEmailHtml = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #c9a96e; text-align: center; margin-bottom: 30px;">Feel The Meal</h1>
        <h2 style="color: #111;">Hello ${name},</h2>
        <h3 style="color: #2e7d32;">Your order has been received! 🎉</h3>
        <p>Thank you for choosing Feel The Meal. We are preparing your delicious handcrafted confections.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #111;">Order Details</h3>
          <p><strong>Date:</strong> ${new Date(orderDate).toLocaleString()}</p>
          <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
          <ul style="padding-left: 20px;">
            ${itemsHtml}
          </ul>
          <h3 style="color: #c9a96e; margin-bottom: 0;">Total Paid: Rs. ${totalPaid}</h3>
        </div>

        <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin-top: 30px; font-size: 14px;">
          <h4 style="margin-top: 0; color: #111;">Need Help?</h4>
          <p style="margin-bottom: 5px;">For any problem or questions regarding your order, please contact us:</p>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 5px;">📞 <strong>Phone:</strong> <a href="tel:+919953573758" style="color: #c9a96e;">+91 99535 73758</a></li>
            <li style="margin-bottom: 5px;">✉️ <strong>Email:</strong> <a href="mailto:feelthemeal21@gmail.com" style="color: #c9a96e;">feelthemeal21@gmail.com</a></li>
            <li>📸 <strong>Instagram:</strong> <a href="https://www.instagram.com/feel.the_meal?igsh=MXRlanhzdzFyb3JhZQ==" style="color: #c9a96e;">@feel.the_meal</a></li>
          </ul>
        </div>
      </div>
    `;

    // Send Email to Admin
    await resend.emails.send({
      from: "Feel The Meal <onboarding@resend.dev>", // Replace with your verified domain
      to: adminEmail,
      subject: `New Order from ${name} - Rs. ${totalPaid}`,
      html: adminEmailHtml,
    });

    // Send Email to Customer
    await resend.emails.send({
      from: "Feel The Meal <onboarding@resend.dev>", // Replace with your verified domain
      to: email,
      subject: "Your Feel The Meal Order Confirmation",
      html: customerEmailHtml,
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
