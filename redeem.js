// redeem.js

const redeemCodes = {
  "FARM500-01": 500,
  "FARM500-02": 500,
  "FARM500-03": 500,
  "FARM500-04": 500,
  "FARM500-05": 500,
  "FARM500-06": 500,
  "FARM500-07": 500,
  "FARM500-08": 500,
  "FARM500-09": 500,
  "FARM500-10": 500,
  "FARM500-11": 2000,
  "FARM500-12": 1000,
  "FARM500-13": 500,
  "FARM500-14": 500,
  "FARM500-15": 500,
  "FARM500-16": 500,
  "FARM500-17": 500,
  "FARM500-18": 500,
  "FARM500-19": 500,
  "FARM500-20": 500
};

function redeemNow() {
  const code = document.getElementById("redeemCode").value.trim();
  if (!code) {
    alert("⚠️ একটি কোড লিখুন!");
    return;
  }

  const email = localStorage.getItem("loggedInUser");
  if (!email) {
    alert("⚠️ দয়া করে প্রথমে লগইন করুন।");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(localStorage.getItem(email));

  if (redeemCodes[code]) {
    const amount = redeemCodes[code];
    user.balance = (user.balance || 0) + amount;
    localStorage.setItem(email, JSON.stringify(user));
    delete redeemCodes[code];
    document.getElementById("redeemCode").value = "";
    alert("✅ কোড সফলভাবে রিডিম হয়েছে! ব্যালেন্সে ৳" + amount + " যোগ হয়েছে।");
    window.location.href = "dashboard.html";
  } else {
    alert("❌ ভুল কোড বা ইতিমধ্যে ব্যবহৃত হয়েছে।");
  }
}