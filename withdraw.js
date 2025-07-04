function updateBalanceUI(amount) {
  const balanceSpan = document.getElementById("userBalance");
  balanceSpan.innerText = "৳" + amount;
}

function processWithdraw() {
  const email = localStorage.getItem("loggedInUser");
  if (!email) {
    alert("⚠️ দয়া করে প্রথমে লগইন করুন।");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(localStorage.getItem(email));
  if (!user) {
    alert("⚠️ ব্যবহারকারীর তথ্য পাওয়া যায়নি।");
    window.location.href = "login.html";
    return;
  }

  const method = document.getElementById("withdrawMethod").value;
  const mobile = document.getElementById("mobileNumber").value.trim();
  const amountStr = document.getElementById("withdrawAmount").value.trim();
  const amount = Number(amountStr);

  if (!method) {
    alert("⚠️ দয়া করে উত্তোলনের মাধ্যম নির্বাচন করুন।");
    return;
  }

  if (!mobile) {
    alert("⚠️ মোবাইল নম্বর লিখুন।");
    return;
  }

  if (!amount || amount < 500) {
    alert("⚠️ সর্বনিম্ন উত্তোলন হল ৫০০ টাকা।");
    return;
  }

  if (amount > user.balance) {
    alert("⚠️ আপনার ব্যালেন্স এত্ত কম।");
    return;
  }

  // ব্যালেন্স থেকে টাকা কাটা হচ্ছে
  user.balance -= amount;
  localStorage.setItem(email, JSON.stringify(user));
  updateBalanceUI(user.balance);

  alert(`✅ সফলভাবে ${amount} টাকা উত্তোলন করা হয়েছে!\nমাধ্যম: ${method === "bkash" ? "বিকাশ" : "নগদ"}\nমোবাইল নম্বর: ${mobile}\nদয়া করে ট্রানজেকশন প্রক্রিয়া করুন।`);

  // ইনপুট ফিল্ড ক্লিয়ার
  document.getElementById("withdrawMethod").value = "";
  document.getElementById("mobileNumber").value = "";
  document.getElementById("withdrawAmount").value = "";
}

window.onload = () => {
  const email = localStorage.getItem("loggedInUser");
  if (!email) {
    alert("⚠️ দয়া করে প্রথমে লগইন করুন।");
    window.location.href = "login.html";
    return;
  }
  const user = JSON.parse(localStorage.getItem(email));
  if (user && user.balance !== undefined) {
    updateBalanceUI(user.balance);
  }
};