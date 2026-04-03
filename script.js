// ============================================================
// Duck CEO Website — JavaScript
// ============================================================

// ---- CONFIG ----
// Replace with your real Stripe publishable key and checkout endpoint
const CONFIG = {
    // Stripe publishable key — get from dashboard.stripe.com/apikeys
    stripePublishableKey: "pk_test_REPLACE_WITH_YOUR_KEY",

    // Supabase Edge Function that creates a Stripe Checkout session
    checkoutEndpoint: "https://asdeammiiwokuwlxqkmc.supabase.co/functions/v1/create-checkout",

    // Price in cents
    priceAmount: 499,
    priceCurrency: "usd",
};

// ---- BUY PRO ----

async function buyPro() {
    const btn = document.getElementById("buy-pro-btn");
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span class="loading-spinner" style="width:18px;height:18px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px;"></span> Redirecting to checkout...';
    btn.disabled = true;

    try {
        const response = await fetch(CONFIG.checkoutEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                priceAmount: CONFIG.priceAmount,
                successUrl: window.location.origin + "/success.html",
                cancelUrl: window.location.href,
            }),
        });

        const data = await response.json();

        if (data.url) {
            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } else {
            throw new Error(data.error || "Failed to create checkout session");
        }
    } catch (err) {
        console.error("Checkout error:", err);
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert("Something went wrong. Please try again.\n\n" + err.message);
    }
}

// ---- SMOOTH SCROLL for anchor links ----

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            // Close mobile nav if open
            document.querySelector(".nav-links")?.classList.remove("open");
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

// ---- NAV background on scroll ----

window.addEventListener("scroll", () => {
    const nav = document.querySelector(".nav");
    if (window.scrollY > 50) {
        nav.style.background = "rgba(13, 13, 13, 0.95)";
    } else {
        nav.style.background = "rgba(13, 13, 13, 0.85)";
    }
});
